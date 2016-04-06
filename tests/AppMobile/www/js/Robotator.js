"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//#######################################################################################################//
//##### Fournit les infos sur le serveur, récupère son adresse IP et lance l'application principale #####//
//#######################################################################################################//

var Robotator = function () {
    function Robotator() {
        _classCallCheck(this, Robotator);

        this.PORT = 8888; // TODO : Récupérer dans les préférences de l'utilisateur
        this.VIDEO_STREAM_PORT = 1234; // configuré par le serveur UV4L
        this.LAST_IP = localStorage.getItem("lastIp");
        this.AUTONOMOUS_MODE_IP = "10.0.0.1";
    }

    _createClass(Robotator, [{
        key: "launchApp",
        value: function launchApp(cbFunction) {

            // Si l'utilisateur est sur un navigateur, c'est le serveur qui fournit la page, il suffit donc d'interroger l'API correspondante
            if (Client.isWebApp) {
                this.getIPFromAppWeb(cbFunction);
            } else {
                // Sinon c'est la partie Node du client qui se charge de récupérer l'adresse IP nécessaire
                this.getIpFromNodeServices(cbFunction);
            }
        }
    }, {
        key: "getIPFromAppWeb",
        value: function getIPFromAppWeb(cbFunction) {
            console.log("Start getIpFromAppWeb");

            var serverPort = this.PORT;

            $.ajax({
                method: "POST",
                url: "/getServerIP" // pas besoin d'avoir l'IP puisque c'est le serveur qui fournit la page

            }).done(function (serverIp) {

                cbFunction("http://" + serverIp + ":" + serverPort);
            }).fail(function () {
                console.log("" + Locales.network.SERVER_NOT_FOUND);
            });
        }
    }, {
        key: "getIpFromNodeServices",
        value: function getIpFromNodeServices(cbFunction) {
            console.log("getIpFromNodeServices");

            var serverPort = this.PORT;
            var lastIp = this.LAST_IP;
            var autonomousModeIp = this.AUTONOMOUS_MODE_IP;

            var applicationNotLaunched = true;

            //JXCore loading stuff...
            var inter = setInterval(function () {

                if (typeof jxcore == 'undefined') return;
                clearInterval(inter);
                jxcore.isReady(function () {

                    jxcore('nodeServices.js').loadMainFile(function (ret, err) {
                        if (err) {
                            var msg = void 0;
                            if (!err || err.replace) msg = err;else msg = JSON && JSON.stringify ? JSON.stringify(err) : err;
                            alert(msg);
                        } else {

                            jxcore("ipFromNodeServices").call({
                                "serverPort": serverPort,
                                "ipsToPing": [lastIp, autonomousModeIp]
                            }, function (serverIp) {
                                if (applicationNotLaunched) {
                                    console.log(serverIp);
                                    localStorage.setItem("lastIp", serverIp); // Enregistre l'IP utilisée pour accélérer la prochaine connection
                                    applicationNotLaunched = false; // Empêche de lancer plusieurs fois l'application
                                    cbFunction("http://" + serverIp + ":" + serverPort);
                                }
                            });
                        }
                    });
                });
            }, 5);
        }
    }, {
        key: "isInAutonomousMode",
        value: function isInAutonomousMode(cbFunction) {
            console.log("Start isInAutonomousMode");

            var autonomousModeIP = this.AUTONOMOUS_MODE_IP;
            var port = this.PORT;

            var p = new Ping(); // testable uniquement quand Cordova est chargé sur l'application mobile
            p.ping(autonomousModeIP, function success(result) {
                var status = result[0].status;

                // Si le status est 'timeout', c'est que Robotator n'est pas en mode autonome
                if ('timeout' === status) {
                    return false;
                } else if ('success' === status) {
                    // Sinon le serveur est bien en mode autonome et on connaît son IP...
                    console.log("IP from 'Ping 10.0.0.1' : http://" + lastIpUsed + ":" + port);
                    cbFunction("http://" + autonomousModeIP + ":" + port);
                }
            }, function error() {
                console.log("Erreur de ping à l'adresse IP : " + autonomousModeIP);
            });
        }
    }, {
        key: "tryLastIpUsed",
        value: function tryLastIpUsed(cbFunction) {
            /*console.log("Start tryLastIpUsed");
               let port = this.PORT;
             let lastIpUsed = localStorage.getItem("lastIpUsed");
               console.log(`http://${lastIpUsed}:${port}`);
               if (null != lastIpUsed) {
             let p = new Ping(); // testable uniquement quand Cordova est chargé sur l'application mobile
               p.ping(lastIpUsed,
             function success(result) {
             let status = result[0].status;
               // Si le status est 'timeout', c'est que Robotator n'est pas en mode autonome
             if ('timeout' === status) {
             return false; // lancer la méthode de recherche suivante
             } else if ('success' === status) {
               console.log(`IP from 'lastIpUsed' : http://${lastIpUsed}:${port}`);
             cbFunction(`http://${lastIpUsed}:${port}`);
             }
             },
             function error() {
             console.log(`Erreur de ping à l'adresse IP : ${lastIpUsed}`);
             });
             }*/
        }
    }, {
        key: "getIPFromAppWebService",
        value: function getIPFromAppWebService(cbFunction) {
            console.log("Start getIPFromAppWebService");

            var port = this.PORT;

            //JXCore stuff...
            var inter = setInterval(function () {

                if (typeof jxcore == 'undefined') return;
                clearInterval(inter);
                jxcore.isReady(function () {

                    jxcore('app.js').loadMainFile(function (ret, err) {
                        if (err) {
                            var msg = void 0;
                            if (!err || err.replace) msg = err;else msg = JSON && JSON.stringify ? JSON.stringify(err) : err;
                            alert(msg);
                        } else {

                            // Système de messages (debugging)
                            jxcore('msg').register(function (msg) {
                                console.log("Message from nodeServices : " + msg);
                            });

                            // Le module Polo de JXCore renvoie l'adresse IP du serveur
                            jxcore('getIPFromAppWebService').call(function (serverIP) {
                                console.log("IP from 'Polo' : http://" + serverIP + ":" + port);
                                cbFunction("http://" + serverIP + ":" + port);
                            });
                        }
                    });
                });
            }, 5);
        }

        // getters

    }, {
        key: "port",
        get: function get() {
            return this.PORT;
        }
    }, {
        key: "videoStreamPort",
        get: function get() {
            return this.VIDEO_STREAM_PORT;
        }
    }, {
        key: "autonomousModeIP",
        get: function get() {
            return this.AUTONOMOUS_MODE_IP;
        }
    }]);

    return Robotator;
}();