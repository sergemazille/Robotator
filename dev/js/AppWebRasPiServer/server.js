/**************************************/
/* *** DEPENDANCES ET PARAMETRAGE *** */
/**************************************/
var GPIO = require('onoff').Gpio; // Contrôle des broches directement sur le RasPi

var SerialPort = require('serialport').SerialPort; // Communique avec l'Arduberry

var express = require('express'); // Serveur web
var app = express(); // Assignation du serveur à la variable 'app'
app.use(express.static(__dirname + '/public')); // Indique où sont les fichiers statiques
app.set('view engine', 'ejs'); // Le moteur de template est 'ejs'
app.set('views', __dirname + '/public'); // Evite de repréciser le chemin complet des vues lors du rendu

// Autorise les accès Cross-Origin
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const fs = require('fs'); // fs permet de naviguer dans le filesystem (pour trouver et charger les fichiers audio)
const os = require('os'); // servira à récupérer l'adresse IP de connexion

// Module Polo pour broadcaster l'adresse IP du serveur
var polo = require('polo');

// Constantes
const TURBO_ON = 't'; // vitesse turbo
const TURBO_OFF = 'n'; // vitesse normale
const STOP_MOTORS = '0'; // moteurs à l'arrêt
const STRAIGHT = '7'; // servo moteur droit

const AUTONOMOUS_NETWORK_MODE = "autonomous";
const LOCAL_NETWORK_MODE = "local";

const PORT = 8888;

// Permet d'accéder au système pour modifier le mot de passe du réseau
var exec = require('child_process').exec;

// Debugging
const Console = require('console').Console;
const output = fs.createWriteStream(__dirname + '/debug.log');
const logger = new Console(output);

// Audio
var MPlayer = require('mplayer');
var player = new MPlayer();

// Paramétrages de body-parser pour récupérer les requêtes de type POST
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Ouvre l'écoute du port série
var serial = new SerialPort("/dev/ttyAMA0", {baudrate: 9600});

// Affiche 'open' quand le port série est opérationnel
serial.on("open", function () {
    //logger.log('open');

    // Initialisation moteurs
    serial.write(TURBO_OFF); // Turbo off
    serial.write(STOP_MOTORS); // Moteurs off
});

// Reset de l'Arduberry
function arduberryReset() {
    exec("avrdude -c gpio -p m328p", function (error, stdout, stderr) {
    });
}
arduberryReset();

/***********************/
/* *** SERVEUR WEB *** */
/***********************/

// Rendu de la page principale pour le client (index.ejs)
app.get('/', function (req, res) {
    res.render('index');
});

/* *** APIs *** */

// Contrôle moteurs
app.post('/motor', function (req, res) {

    var direction = req.body.direction;
    serial.write(direction);
    res.end();
});

// Contrôle du turbo
app.post('/turbo', function (req, res) {

    var turboState = req.body.turboState; // Récupère la vitesse (t = turbo, n = normal)
    serial.write(turboState);

    res.end();
});

// Contrôle audio (chaque son est associé à une couleur)
app.post('/audio', function (req, res) {

    var couleur = req.body.couleur;
    player.openFile(__dirname + '/public/audio/' + couleur + '.mp3');

    res.end();
});

// Contrôle LEDs
app.post('/led', function (req, res) {

    var couleur = req.body.couleur;
    logger.log(couleur);

    var couleurs = {
        "vert": 21,
        "rouge": 26,
        "jaune": 20
    }; // Les chiffres correspondent aux sorties GPIO (directement sur le RasPi)

    var led = new GPIO(couleurs[couleur], 'out'); // On met en place la LED correspondante

    // Fait clignoter la LED
    var ledOn = 0;
    var intervalHandler = setInterval(
        function () {

            if (ledOn) {
                led.writeSync(0);
                ledOn = 0;
            } else {
                led.writeSync(1);
                ledOn = 1;
            }
        },
        150
    );

    // Annule le clignotement au bout d'environ 2 secondes
    setTimeout(function () {
        clearInterval(intervalHandler);
        led.writeSync(0);
        res.end();
    }, 1750); // Au bout d'environ '2' secondes on éteint tout

});

app.post('/headlights', function (req, res) {

    var headlightsState = parseInt(req.body.headlightsState); // Récupère l'état des phares (0 = éteint, 1 = allumé)

    var headlights1 = new GPIO(16, 'out'); // phare gauche
    var headlights2 = new GPIO(19, 'out'); // phare droit

    headlights1.writeSync(headlightsState); // Allume ou éteint en fonction...
    headlights2.writeSync(headlightsState); // Allume ou éteint en fonction...

    res.end();
});

// Remet Robotator à zéro avant de l'arrêter
app.post('/poweroff', function (req, res) {

    // Éteint les moteurs
    serial.write(TURBO_OFF); // Turbo off
    serial.write(STOP_MOTORS); // Moteurs off

    // Éteint les phares
    var headlights1 = new GPIO(16, 'out');
    var headlights2 = new GPIO(19, 'out');
    headlights1.writeSync(0);
    headlights2.writeSync(0);

    // Reset de l'Arduberry
    arduberryReset();

    res.end("OK");
});

// Renvoie le mode de connexion réseau (local ou autonome) en fonction de l'adresse IP du serveur
app.post('/getNetworkMode', function (req, res) {

    var currentNetworkMode = LOCAL_NETWORK_MODE; // Par défaut en local

    // On récupère l'adresse IP du serveur pour vérifier si on est en mode autonome (10.0.0.1)
    if (getServerIP() == '10.0.0.1') {
        currentNetworkMode = AUTONOMOUS_NETWORK_MODE;
    }

    res.send(currentNetworkMode);
});

// Renvoie l'adresse IP du serveur (AJAX)
app.post('/getServerIp', function (req, res) {
    res.send(getServerIP());
});

// Renvoie l'adresse IP du serveur
function getServerIP() {

    var net = os.networkInterfaces();
    var ipAddresses = [];
    for (var ifc in net) {
        var addrs = net[ifc];
        for (var a in addrs) {
            if (addrs[a].family == "IPv4" && addrs[a].address != "127.0.0.1") {
                ipAddresses.push(addrs[a].address);
            }
        }
    }
    return ipAddresses[0];
}

/*************************/
/* *** CONFIGURATION *** */
/*************************/

// Changement du mode réseau
app.post('/changeNetworkMode', function (req, res) {
    var newNetworkMode = req.body.networkMode;

    switch (newNetworkMode) {
        case AUTONOMOUS_NETWORK_MODE:
            exec("sudo sh /home/pi/scripts/autonomousNetwork.sh", function (error, stdout, stderr) {
            }); // On active le script 'réseau autonome' sur le Robot
            break;

        case LOCAL_NETWORK_MODE:
            exec("sudo sh /home/pi/scripts/localNetwork.sh", function (error, stdout, stderr) {
            }); // On active le script 'réseau local' sur le Robot
            break;

        default:
            break;
    }
    res.end();
});

// Changement du mot de passe réseau
// TODO : Check le mot de passe en input
app.post('/password', function (req, res) {

    var newPassword = req.body.newPassword;
    exec("sed -i '10 d' /etc/hostapd/hostapd.conf", function (error, stdout, stderr) {
    }); // On supprime la ligne 10 qui contient l'ancien mot de passe
    exec("sed -i '10i\wpa_passphrase=" + newPassword + "' /etc/hostapd/hostapd.conf", function (error, stdout, stderr) {
    }); // On ajoute le nouveau mot de passe

    res.end(); // Renvoyer le résultat de l'opération (avec consigne de rebooter (mode autonome) pour que le nouveau mot de passe soit effectif)
});

// Lance l'écoute sur le port 8888
var server = app.listen(PORT, function () {
});

/********************************/
/* *** BROADCAST IP SERVEUR *** */
/********************************/
var serverIP = getServerIP();
if (serverIP != '10.0.0.1') { // On ne fait pas appel au module Polo si nous sommes en réseau autonome

    var apps = polo();
    apps.put({
        name: 'robotator',
        host: serverIP,
        port: PORT
    });
}
