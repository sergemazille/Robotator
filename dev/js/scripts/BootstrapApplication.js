//########################################################################//
//##### Lance les services nécessaires au démarrage de l'application #####//
//########################################################################//

// Lance le message de chargement
let messageBox = new MessageBox();
messageBox.robotatorLoading();

// Charge les paramètres d'environement
let config = new Config(BootstrapApplication);

function BootstrapApplication() {

    // Si le client est l'application web, on lance directement la recherche du serveur.
    // Sinon il faut attendre que l'appareil soit prêt
    if (Client.isWebApp) {
        // Passe la fonction principale un objet Robotator qui va déterminer l'adresse IP complète du serveur pour lancer l'application en fonction
        let robotator = new Robotator();
        robotator.launchApp(application);
    } else {
        // Initialisation de Cordova
        var app = {
            initialize: function () {
                this.bindEvents();
            },
            bindEvents: function () {
                document.addEventListener('deviceready', this.onDeviceReady, false);
            },
            onDeviceReady: function () {
                let robotator = new Robotator();
                robotator.launchApp(application);
            }
        };
        app.initialize();
    }
}
