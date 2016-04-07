'use strict';

//########################################################################//
//##### Lance les services nécessaires au démarrage de l'application #####//
//########################################################################//

function BootstrapApplication() {

    // Si le client est l'application web, on lance directement la recherche du serveur.
    // Sinon il faut attendre que l'appareil soit prêt
    if (Client.isWebApp) {
        // Passe la fonction principale un objet Robotator qui va déterminer l'adresse IP complète du serveur et lancer l'application en fonction
        var robot = new Robotator();
        robot.launchApp(application);
    } else {
        // Initialisation de Cordova
        var app = {
            initialize: function initialize() {
                this.bindEvents();
            },
            bindEvents: function bindEvents() {
                document.addEventListener('deviceready', this.onDeviceReady, false);
            },
            onDeviceReady: function onDeviceReady() {
                var robot = new Robotator();
                robot.launchApp(application);
            }
        };

        app.initialize();
    }
}

BootstrapApplication();