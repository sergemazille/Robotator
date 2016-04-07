//#######################################################################################################//
//##### Fournit les infos sur le serveur, récupère son adresse IP et lance l'application principale #####//
//#######################################################################################################//

class Robotator {

    constructor() {
        this.PORT = 8888; // TODO : Récupérer dans les préférences de l'utilisateur
        this.VIDEO_STREAM_PORT = 1234; // configuré par le serveur UV4L
        this.LAST_IP = localStorage.getItem("lastIp");
        this.AUTONOMOUS_MODE_IP = "10.0.0.1";
    }

    launchApp(cbFunction) {

        // Si l'utilisateur est sur un navigateur, c'est le serveur qui fournit la page, il suffit donc d'interroger l'API correspondante
        if (Client.isWebApp) {
            this.getIPFromAppWeb(cbFunction);
        } else {
            // Sinon c'est la partie Node du client qui se charge de récupérer l'adresse IP nécessaire
            this.getIpFromNodeServices(cbFunction);
        }
    }

    getIPFromAppWeb(cbFunction) {

        let serverPort = this.PORT;

        $.ajax({
            method: "POST",
            url: "/getServerIP" // pas besoin d'avoir l'IP puisque c'est le serveur qui fournit la page

        }).done(function (serverIp) {

            cbFunction(`http://${serverIp}:${serverPort}`);

        }).fail(function () {
            console.log(`${Locales.network.SERVER_NOT_FOUND}`);

        });
    }

    getIpFromNodeServices(cbFunction) {

        let serverPort = this.PORT;
        let lastIp = this.LAST_IP;
        let autonomousModeIp = this.AUTONOMOUS_MODE_IP;

        let applicationNotLaunched = true;

        //JXCore loading stuff...
        let inter = setInterval(function () {

            if (typeof jxcore == 'undefined') return;
            clearInterval(inter);
            jxcore.isReady(function () {

                jxcore('nodeServices.js').loadMainFile(function (ret, err) {
                    if (err) {
                        let msg;
                        if (!err || err.replace)
                            msg = err;
                        else
                            msg = JSON && JSON.stringify ? JSON.stringify(err) : err;
                        alert(msg);
                    } else {

                        // Debugging
                        jxcore("displayMsg").register(function(msg){
                            console.log(msg);
                        });

                        jxcore("ipFromNodeServices").call(
                            {
                                "serverPort": serverPort,
                                "ipsToPing": [lastIp, autonomousModeIp]
                            },
                            function (serverIp) {
                                if (applicationNotLaunched) {
                                    localStorage.setItem("lastIp", serverIp); // Enregistre l'IP utilisée pour accélérer la prochaine connection
                                    applicationNotLaunched = false; // Empêche de lancer plusieurs fois l'application
                                    cbFunction(`http://${serverIp}:${serverPort}`);
                                }
                            });
                    }
                });
            });
        }, 5);
    }

    // getters
    get port() {
        return this.PORT;
    }

    get videoStreamPort() {
        return this.VIDEO_STREAM_PORT;
    }

    get autonomousModeIP() {
        return this.AUTONOMOUS_MODE_IP;
    }
}