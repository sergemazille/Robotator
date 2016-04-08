/************************************************************************/
/* ***** Contient les chemin vers les ressources de l'application ***** */
/************************************************************************/

class Paths {

    static get images() {

        let _paths = {
            LOGO: "img/logo.png",
            LOGO_SAD: "img/logo_triste.png",
            SPINNER: "img/spinner.gif",
            LOCAL_NETWORK_MODE: "img/reseauLocal.png",
            AUTONOMOUS_NETWORK_MODE: "img/reseauAutonome.png",
        };

        return _paths;
    }
}