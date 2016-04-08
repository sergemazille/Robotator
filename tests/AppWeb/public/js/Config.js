"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//#################################################################################//
//##### Récupère la configuration sur le serveur et la stocke en localStorage #####//
//#################################################################################//

var Config = function Config(bootstrapCallBack) {
    _classCallCheck(this, Config);

    // Dans l'application web, c'est le serveur qui retourne la configuration sous forme d'objet json
    if (Client.isWebApp) {
        $.ajax({
            method: "POST",
            url: "/getConfig" // pas besoin d'avoir l'IP puisque c'est le serveur qui fournit la page
        }).done(function (config) {
            localStorage.setItem("config", JSON.stringify(config)); // stocke l'ojet json en localstorage

            // Les paramètres de configuration sont chargés, on peut lancer le boot
            bootstrapCallBack();
        }).fail(function () {
            console.log("" + Locales.network.SERVER_NOT_FOUND); // TODO : remplacer par un messageBox
        });
    } else {
            (function () {

                // chargement JXCore...
                var inter = setInterval(function () {
                    if (typeof jxcore == 'undefined') return;
                    clearInterval(inter);
                    jxcore.isReady(function () {
                        jxcore('nodeServices.js').loadMainFile(function (ret, err) {
                            if (err) {
                                var msg = void 0;
                                if (!err || err.replace) msg = err;else msg = JSON && JSON.stringify ? JSON.stringify(err) : err;
                                alert(msg);
                                // FIN chargement JXCore
                            } else {
                                    // Enregistrement des fonctions utilisant Node.js côté client

                                    // Fonction de debugging
                                    jxcore("console").register(function (msg) {
                                        console.log(msg);
                                    });

                                    // Dans l'application mobile, c'est JXCore qui se charge de lire le fichier 'serverConfig.json' local
                                    jxcore("getConfig").call(function (config) {
                                        localStorage.setItem("config", JSON.stringify(config)); // stocke l'ojet json dans 'localStorage'

                                        // Les paramètres de configuration sont chargés, on peut lancer le boot
                                        bootstrapCallBack();
                                    });
                                }
                        });
                    });
                }, 5);
            })();
        }
};