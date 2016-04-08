'use strict';

//#################################//
//##### MESSAGE DE CHARGEMENT #####//
//#################################//

// Si Robotator n'est pas trouvé en 60 secondes, il y a un problème
var loadingTimeout = setTimeout(function () {
    $(".vex").hide(); // cache le modal de chargement
    vexAlert(Locales.loading.FAILED, true); // la valeur 'true' fermera l'application
}, 60000);

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