"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//##############################################################################//
//##### Récupère l'adresse IP du serveur et lance l'application principale #####//
//##############################################################################//

var Robotator = function () {
    function Robotator() {
        _classCallCheck(this, Robotator);
    }

    _createClass(Robotator, [{
        key: "launchApp",
        value: function launchApp(appCallBack) {
            // Si l'utilisateur est sur un navigateur, c'est le serveur qui fournit la page, il suffit donc d'interroger l'API correspondante
            if (Client.isWebApp) {
                this.getIPFromAppWeb(appCallBack);
            } else {
                // Sinon c'est la partie Node du client qui se charge de récupérer l'adresse IP nécessaire
                this.getIpFromNodeServices(appCallBack);
            }
        }
    }, {
        key: "getIPFromAppWeb",
        value: function getIPFromAppWeb(appCallBack) {

            var config = JSON.parse(localStorage.getItem("config"));
            var serverPort = config.port;

            $.ajax({
                method: "POST",
                url: "/getServerIp" // pas besoin d'avoir l'IP puisque c'est le serveur qui fournit la page

            }).done(function (serverIp) {

                appCallBack("http://" + serverIp + ":" + serverPort);
            }).fail(function () {
                console.log("" + Locales.network.SERVER_NOT_FOUND);
            });
        }
    }, {
        key: "getIpFromNodeServices",
        value: function getIpFromNodeServices(appCallBack) {

            var config = JSON.parse(localStorage.getItem("config"));
            var serverPort = config.port;
            var lastIp = config.ip;
            var autonomousModeIp = config.autonomousModeIp;

            var applicationNotLaunched = true;

            jxcore('nodeServices.js').loadMainFile(function (ret, err) {

                // Demande l'adresse IP du serveur à la partie Node.js pour lancer l'application
                jxcore("ipFromNodeServices").call({
                    "serverPort": serverPort,
                    "ipsToPing": [lastIp, autonomousModeIp]
                }, function (serverIp) {

                    if (applicationNotLaunched) {

                        // Met à jour l'IP utilisée dans 'localStorage'
                        config.ip = serverIp;
                        localStorage.setItem("config", JSON.stringify(config)); // Enregistre l'IP utilisée pour accélérer la prochaine connection

                        applicationNotLaunched = false; // Empêche de lancer plusieurs fois l'application
                        appCallBack("http://" + serverIp + ":" + serverPort);
                    }
                });
            });

            //// chargement JXCore...
            //let inter = setInterval(function () {
            //    if (typeof jxcore == 'undefined') return;
            //    clearInterval(inter);
            //    jxcore.isReady(function () {
            //        jxcore('nodeServices.js').loadMainFile(function (ret, err) {
            //            if (err) {
            //                let msg;
            //                if (!err || err.replace)
            //                    msg = err;
            //                else
            //                    msg = JSON && JSON.stringify ? JSON.stringify(err) : err;
            //                alert(msg);
            //// FIN chargement JXCore
            //
            //            } else {
            //                console.log("JXCore");
            //
            //                // Fonction de debugging
            //                jxcore("console").register(function (msg) {
            //                    console.log(msg);
            //                });
            //
            //                // Demande l'adresse IP du serveur à la partie Node.js pour lancer l'application
            //                jxcore("ipFromNodeServices").call(
            //                    {
            //                        "serverPort": serverPort,
            //                        "ipsToPing": [lastIp, autonomousModeIp]
            //                    },
            //                    function (serverIp) {
            //                        if (applicationNotLaunched) {
            //                            localStorage.setItem("lastIp", serverIp); // Enregistre l'IP utilisée pour accélérer la prochaine connection
            //                            applicationNotLaunched = false; // Empêche de lancer plusieurs fois l'application
            //                            appCallBack(`http://${serverIp}:${serverPort}`);
            //                        }
            //                    });
            //            }
            //        });
            //    });
            //}, 5);
        }
    }]);

    return Robotator;
}();