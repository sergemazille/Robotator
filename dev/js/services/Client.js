/***************************************************************************************************/
/* ***** Vérifie le moyen de connexion du client (navigateur (mobile/desktop) ou app mobile) ***** */
/***************************************************************************************************/

class Client {

    // L'idéal serait de détecter le support des touch events mais c'est plus compliqué qu'il n'y paraît :http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
    static get isMobileDevice() {
        let isMobile = {
            Android: function () {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function () {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };

        if(null === isMobile.any()){
            return false
        }
        return isMobile.any();
    }

    static get isWebApp() {

        return (null != document.getElementById("webApp"));
    }

    static get isMobileApp() {
        return !this.isWebApp; // s'il s'agit de l'application mobile c'est qu'il ne s'agit pas de l'application web...
    }

    static get language() {
        return window.navigator.userLanguage || window.navigator.language;
    }
}