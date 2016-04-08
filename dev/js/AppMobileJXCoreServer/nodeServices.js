// destination : 'Robotator\AppMobile\www\jxcore'

//##############################################################//
//##### Services requérant Node.js côté application mobile #####//
//##############################################################//

// Dépendances
const polo = require('polo');
const tcpp = require('tcp-ping');
const fs = require('fs'); // fs permet de naviguer dans le filesystem

// Lit le fichier de configuration et le retourne sous forme d'un objet json
Mobile("getConfig").registerAsync(function (callback) {
    try {
        let config = fs.readFileSync(__dirname + '/serverConfig.json');
        callback(JSON.parse(config));
    } catch (err) {
        Mobile("console").call(`Erreur : ${err}`);
    }
});

// Fournit l'adresse IP et le port de connexion vers le serveur
Mobile("ipFromNodeServices").registerAsync(function (data, callback) {

    let serverPort = data.serverPort;
    let ipsToPing = data.ipsToPing;

    let ipNotFound = true; // Flag pour ne pas exécuter le callback plusieurs fois

    // Teste les adresses IP reçues en paramètre et appel le callBack dès que l'un est valide
    for (let i in ipsToPing) {

        tcpp.probe(ipsToPing[i], serverPort, function (err, serverAvailable) {
            if (serverAvailable && ipNotFound) {

                callback(ipsToPing[i]);
                ipNotFound = false; // Empêche les prochaines recherches ('break' ne semble pas fonctionner...)
                // TODO : recherche explication problème avec 'break'
            }
        });
    }

    // Si aucune des adresses testées n'est valide, le service du module Polo est utilisé
    let services = polo();
    services.once('up', function (name) {
        let serverIp = services.get(name).host;
        callback(serverIp);
    });
});
