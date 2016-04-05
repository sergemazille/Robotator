/*****************************************************************************/
/* ***** Contient les chaînes de caractères à afficher à l'utilisateur ***** */
/*****************************************************************************/

class Locales {

    // Retourne uniquement la partie de l'objet correspondant à la langue de l'utilisateur (ou sinon dans la langue par défaut)
    static getUserLocales(localesObject) {
        const DEFAULT_LANGUAGE = "fr"; // TODO : définir à partir des préférences de l'utilisateur (Page des préférences à faire également...)

        for (let lang in localesObject) {
            if (Client.language === lang) { // la langue de l'utilisateur est fournie par le service 'dev/js/services/Client.js'
                return localesObject[lang];
            }
        }
        // si la langue n'a pas été déterminée...
        return localesObject[DEFAULT_LANGUAGE];
    }

    /*****************************/
    /* * Chaînes de caractères * */
    /*****************************/

    static get loading() {
        let _locales = {
            fr: {
                FAILED: `<img src="${Paths.images.LOGO_SAD}"><br>Désolé, Robotator ne peut pas être contacté.<br>Essayez de le redémarrer...<br>...ou vérifiez la connexion de votre appareil.`,
                IN_PROGRESS: `<img src="${Paths.images.LOGO}"><br>Recherche de Robotator en cours...<br><img src="${Paths.images.SPINNER}">`,
            },
            en: {
                FAILED: `<img src="${Paths.images.LOGO_SAD}"><br>Sorry, Robotator cannot be reached.<br>Try to reboot him...<br>...ou check your device's connection.`,
                IN_PROGRESS: `<img src="${Paths.images.LOGO}"><br>Searching Robotator...<br><img src="${Paths.images.SPINNER}">`,
            },
        };

        return this.getUserLocales(_locales);
    }

    static get network() {
        let _locales = {
            fr: {
                AUTONOMOUS: "Robotator redémarre en mode 'réseau autonome'...\nVeuillez vous connecter au réseau WiFi 'Robotator'",
                LOCAL: "Robotator redémarre en mode 'réseau local'...",
                CHOICE_QUESTION: "Choix du mode de connexion :",
                CHOICE_LOCAL: "Réseau local",
                CHOICE_AUTONOMOUS: "Réseau autonome",
                SERVER_NOT_FOUND: "Robotator n'a pas pu être contacté",
            },
        };

        return this.getUserLocales(_locales);
    }

    static get buttons() {
        let _locales = {
            fr: {
                VALIDATE: "VALIDER",
                CANCEL: "ANNULER",
                OK: "OK",
            },
            en: {
                VALIDATE: "VALIDATE",
                CANCEL: "CANCEL",
                OK: "OK",
            },
        };

        return this.getUserLocales(_locales);
    }
}