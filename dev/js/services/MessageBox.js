//################################//
//##### GESTION DES MESSAGES #####//
//################################//

class MessageBox {

    static robotatorLoading() {

        // Si Robotator n'est pas trouvé en 60 secondes, il y a un problème
        let loadingTimeout = setTimeout(function () {
            $(".vex").hide(); // cache le modal de chargement
            MessageBox.messageAlert(Locales.loading.FAILED, true); // la valeur 'true' fermera l'application
        }, 60000);

        document.addEventListener("appLaunched", function () {
            clearTimeout(loadingTimeout);
            MessageBox.closeMessageBox();
        });

        // Message de chargement
        vex.defaultOptions.className = 'vex-theme-default'; // Choix du theme par défaut de la fenêtre modale
        vex.dialog.alert({
            message: Locales.loading.IN_PROGRESS,
            contentClassName: 'modalBox',
            buttons: [
                $.extend({},
                    vex.dialog.buttons.NO, {
                        text: Locales.buttons.CANCEL,
                        className: 'modalBoxCancelBtn'
                    })
            ],
            overlayClosesOnClick: false,
            escapeButtonCloses: false,
            callback: function (cbData) {
                if (false === cbData) {
                    vexAlert(Locales.loading.FAILED, true);
                }
            }
        });
    }

    static closeMessageBox() {
        $(".vex").hide();
    }

    static messageAlert(msg, closeApp) {
        vex.dialog.alert({
            message: msg,
            contentClassName: 'modalBox',
            callback: function () {
                if (closeApp && Client.isMobileApp) {
                    navigator.app.exitApp(); // L'application s'éteint pour laisser l'utilisateur changer ses réglages de connexion
                }
            }
        });
    }

    static networkModeChoice(currentNetworkMode, appCallback) {

        let pushButtons = `<label><input type="radio" name="choice" id="local" value="local" /><p class="choiceBtn">${Locales.network.CHOICE_LOCAL}</p></label>
        <label><input type="radio" name="choice" id="autonomous" value="autonomous" /><p class="choiceBtn">${Locales.network.CHOICE_AUTONOMOUS}</p></label>`

        // Boîte de dialogue modale
        vex.dialog.open({
            message: `${Locales.network.CHOICE_QUESTION}`,
            input: pushButtons,
            buttons: [
                $.extend({}, vex.dialog.buttons.YES, {
                    text: Locales.buttons.VALIDATE
                }),
                $.extend({}, vex.dialog.buttons.NO, {
                    text: Locales.buttons.CANCEL
                })
            ],
            callback: function (data) {
                appCallback(data.choice);
            }
        });

        $("input").each(function () {
            if (currentNetworkMode === this.id) {
                this.setAttribute("checked", "checked"); // Permet d'indiquer visuellement quel est le mode réseau courant
                this.setAttribute("value", false); // Ne changera pas le mode s'il s'agit déjà du mode courant
            }
        });
    }
}