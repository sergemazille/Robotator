'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//################################//
//##### GESTION DES MESSAGES #####//
//################################//

var MessageBox = function () {
    function MessageBox() {
        _classCallCheck(this, MessageBox);

        this.bindEvents();
    }

    _createClass(MessageBox, [{
        key: 'robotatorLoading',
        value: function robotatorLoading() {

            // Si Robotator n'est pas trouvé en 60 secondes, il y a un problème
            //let loadingTimeout = setTimeout(function () {
            //    $(".vex").hide(); // cache le modal de chargement
            //    vexAlert(Locales.loading.FAILED, true); // la valeur 'true' fermera l'application
            //}, 60000);

            // Message d'attente modal
            vex.defaultOptions.className = 'vex-theme-default'; // Choix du theme par défaut de la fenêtre modale
            vex.dialog.alert({
                message: Locales.loading.IN_PROGRESS,
                contentClassName: 'modalBox',
                buttons: [$.extend({}, vex.dialog.buttons.NO, {
                    text: Locales.buttons.CANCEL,
                    className: 'modalBoxBtn'
                })],
                overlayClosesOnClick: false,
                escapeButtonCloses: false,
                callback: function callback(cbData) {
                    if (false === cbData) {
                        vexAlert(Locales.loading.FAILED, true);
                    }
                }
            });
        }
    }, {
        key: 'bindEvents',
        value: function bindEvents() {
            // Écoute le lancement de l'application pour fermer le message de chargement
            document.addEventListener("appLaunched", this.closeMessageBox, false);
        }
    }, {
        key: 'closeMessageBox',
        value: function closeMessageBox() {
            $(".vex").hide();
        }
    }]);

    return MessageBox;
}();

function vexAlert(msg, closeApp) {
    vex.dialog.alert({
        message: msg,
        contentClassName: 'modalBox',
        callback: function callback() {
            if (closeApp && Client.isMobileApp) {
                navigator.app.exitApp(); // L'application s'éteint pour laisser l'utilisateur changer ses réglages de connexion
            }
        }
    });
}