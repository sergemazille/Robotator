//###########################################//
//##### Code principal de l'application #####//
//###########################################//

function application(robotatorIP) {

    console.log("Dans l'application");

    //##################################//
    //### CONSTANTES ET PARAMÉTRAGES ###//
    //##################################//

    const TURBO_ON = 't'; // vitesse turbo
    const TURBO_OFF = 'n'; // vitesse normale

    const AUTONOMOUS_NETWORK_MODE = "autonomous";
    const LOCAL_NETWORK_MODE = "local";

    const ROBOTATOR_IP = robotatorIP;

    // Permet d'écouter le bon évènement en fonction du client : browser ou app (app par défaut)
    let BUTTON_DOWN = "touchstart";
    let BUTTON_UP = "touchend";
    let BUTTON_OUT = "touchleave";

    if (Client.isWebApp) {
        BUTTON_DOWN = "mousedown";
        BUTTON_UP = "mouseup";
        BUTTON_OUT = "mouseout";
    }

    // Arrêt du timeout de chargement
    clearTimeout(loadingTimeout);
    $(".vex").hide();

    // Mise en place de la vidéo comme arrière-plan de l'application
    let simpleIP = ROBOTATOR_IP.slice(0, -5); // On enlève le port puisque le flux vidéo est sur le port 1234
    let videoStream = simpleIP + ":1234/stream/video.mjpeg";
    $('#interface').css("background-image", "url('" + videoStream + "')");

    //##################//
    //### ÉVÈNEMENTS ###//
    //##################//

    // Gestion des évènements de l'Activity Android
    document.addEventListener("pause", switchOff, false);
    document.addEventListener("stop", switchOff, false);
    $(".power").on("click", function () {
        switchButtonImage(this);
        switchOff();
    });

    // Éteint tout et quitte l'application
    function switchOff() {

        $.post(
            ROBOTATOR_IP + "/poweroff",
            {"info": "Power off"}, // juste pour info
            function (data) {
                // Quitte l'application
                navigator.app.exitApp();
            }
        );
    }

    //###########################################//
    //### COMPORTEMENT DES IMAGES DES BOUTONS ###//
    //###########################################//

    function switchButtonImage(image) {

        // Passe 'true' si la source de l'image contient la chaîne '_on' (bouton allumé) et 'false' sinon
        let buttonOn = !(image.getAttribute('src').indexOf('_on') === -1);

        // Pour passer le bouton en mode 'éteint', on lui passe l'image de base dont le nom se trouve dans 'data-image'
        if (buttonOn) {
            image.setAttribute('src', "img/" + image.getAttribute('data-image') + '.png'); // Passe à 'off'
        } else {
            image.setAttribute('src', "img/" + image.getAttribute('data-image') + '_on.png'); // Passe à 'on'
        }

        return !buttonOn; // l'état du bouton a désormais changé, on renvoie donc son inverse pour refléter son nouvel état
    }

    //###############//
    //### MOTEURS ###//
    //###############//

    //$(".motor").on("dragstart", function () {
    //    // Change l'image du bouton
    //    switchButtonImage(this);
    //
    //    $.post(
    //        ROBOTATOR_IP + "/motor",
    //        {"direction": 0} // 0 stoppe les moteurs
    //    );
    //});

    // Arrête les moteurs quand le bouton est relâché
    $(".motor").on(BUTTON_UP, function () {
        // Change l'image du bouton
        switchButtonImage(this);

        // On remet le servomotor droit
        if ($(this).hasClass("tourne")) {
            $.post(
                ROBOTATOR_IP + "/motor",
                {"direction": '7'} // 7 remet le servomotor à 0
            );
        }
        // Ne s'applique pas s'il s'agit du servomotor (on ne veut pas couper les autres moteurs juste parce que l'on a tourné...)
        else {
            $.post(
                ROBOTATOR_IP + "/motor",
                {"direction": 0} // 0 stoppe les moteurs
            );
        }
    });

    // Démarre les moteurs quand le bouton est appuyé
    $(".motor").on(BUTTON_DOWN, function () {
        // Change l'image du bouton
        switchButtonImage(this);

        // Envoie la commande moteur
        $.post(
            ROBOTATOR_IP + "/motor",
            {"direction": $(this).attr("id")}
        );
    });

    // Turbo
    $("#turbo").on("click", function () {

        let turboOn = switchButtonImage(this); // Change l'image du bouton et récupère son état (true/false)
        let turboState = (turboOn) ? TURBO_ON : TURBO_OFF; // Si le turbo est désormais allumé, l'état est à 255, sinon 180

        // Commande l'activation du turbo
        $.post(
            ROBOTATOR_IP + "/turbo",
            {"turboState": turboState}
        );
    });


    //################//
    //### LUMIERES ###//
    //################//

    // LEDs associées à l'audio
    $(".led").on("click", function () {

        switchButtonImage(this); // Change l'image du bouton
        let that = this;

        // Commande l'activation de la bonne LED
        $.post(
            ROBOTATOR_IP + "/led",
            {
                "couleur": $(this).attr("id")
            },
            function () {
                switchButtonImage(that); // Passe l'image du bouton sur 'off'
            }
        );
    });

    // Phares
    $(".headlights").on("click", function () {

        console.log("Phares appuyés");
        let headlightsOn = switchButtonImage(this); // Change l'image du bouton et récupère son état allumé (true/false)
        let headlightsState = (headlightsOn) ? 1 : 0; // Si les phares sont désormais allumés, l'état est à 1, sinon 0

        // Commande l'activation des phares
        $.post(
            ROBOTATOR_IP + "/headlights",
            {"headlightsState": headlightsState}
        );
    });


    //#############//
    //### AUDIO ###//
    //#############//

    $(".audio").on("click", function () {
        $.post(
            ROBOTATOR_IP + "/audio",
            {
                "couleur": $(this).attr("id")
            }
        );
    });

    //#####################//
    //### CONFIGURATION ###//
    //#####################//

    $("#config").on("click", function () {
        switchButtonImage(this); // Change l'image du bouton
        let that = this;

        $.post( // Interroge le serveur pour connaître le mode réseau en cours
            ROBOTATOR_IP + "/getNetworkMode",
            function (currentNetworkMode) {

                // Boîte de dialogue modale
                vex.dialog.open({
                    message: Locales.network.CHOICE_QUESTION,
                    input: `<input id="local" name="networkMode" type="radio" value="local" checked="checked" /><label for="local">${Locales.network.CHOICE_LOCAL}</label><br>
                        <input id="autonomous" name="networkMode" type="radio" value="autonomous" /><label for="autonomous">${Locales.network.CHOICE_AUTONOMOUS}</label>`,
                    buttons: [
                        $.extend({}, vex.dialog.buttons.YES, {
                            text: Locales.buttons.VALIDATE
                        }), $.extend({}, vex.dialog.buttons.NO, {
                            text: Locales.buttons.CANCEL
                        })
                    ],

                    callback: function (data) {
                        switchButtonImage(that); // Change l'image du bouton

                        if (data === false) {

                            return;

                            // Vérifie également que le nouveau mode réseau choisi n'est pas déjà celui en cours, pour éviter un redémarrage inutile
                        } else if (AUTONOMOUS_NETWORK_MODE === data.networkMode && AUTONOMOUS_NETWORK_MODE != currentNetworkMode) {

                            let msg = Locales.network.AUTONOMOUS;
                            changeNetworkMod(msg, data);

                        } else if (LOCAL_NETWORK_MODE === data.networkMode && LOCAL_NETWORK_MODE != currentNetworkMode) {

                            let msg = Locales.network.LOCAL;
                            changeNetworkMod(msg, data);

                        }
                    }
                });
            }
        );
    });

    function changeNetworkMod(msg, data) {
        // Changement du mode réseau
        $.post(
            ROBOTATOR_IP + "/changeNetworkMode",
            {"networkMode": data.networkMode}
        );

        // Informe l'utilisateur
        vexAlert(msg, true) // true indique qu'il faut également fermer l'application
    }

    // Changement du mot de passe de connexion au réseau de Robotator
    $(".password").on("click", function () {

        let newPassword = $(this).attr("data-password");

        // test de changement de mot de passe
        $.post (
            ROBOTATOR_IP + "/password",
            {"newPassword": newPassword}
        );
    });
}