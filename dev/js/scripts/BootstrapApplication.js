//########################################################################//
//##### Lance les services nécessaires au démarrage de l'application #####//
//########################################################################//

// Lance le message de chargement
MessageBox.robotatorLoading();

function BootstrapApplication() {

    // Si le client est l'application web, on lance directement la recherche du serveur.
    // Sinon il faut attendre que l'appareil soit prêt
    if (Client.isWebApp) {
        // Passe la fonction principale à l'objet Connection
        new Connection(application);
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
                new Connection(application);
            }
        };
        app.initialize();
    }
}

// Charge les paramètres d'environement et lance le bootstrap
new Config(BootstrapApplication);