//##############################################################################//
//##### Récupère l'adresse IP du serveur et lance l'application principale #####//
//##############################################################################//

class Robotator {

    launchApp(appCallBack) {
        // Si l'utilisateur est sur un navigateur, c'est le serveur qui fournit la page, il suffit donc d'interroger l'API correspondante
        if (Client.isWebApp) {
            this.getIPFromAppWeb(appCallBack);
        } else {
            // Sinon c'est la partie Node du client qui se charge de récupérer l'adresse IP nécessaire
            this.getIpFromNodeServices(appCallBack);
        }
    }

    getIPFromAppWeb(appCallBack) {

        let config = JSON.parse(localStorage.getItem("config"));
        let serverPort = config.port;

        $.ajax({
            method: "POST",
            url: "/getServerIp" // pas besoin d'avoir l'IP puisque c'est le serveur qui fournit la page

        }).done(function (serverIp) {
            config.ip = serverIp;
            localStorage.setItem("config", JSON.stringify(config));

            appCallBack(`http://${serverIp}:${serverPort}`);

        }).fail(function () {
            console.log(`${Locales.network.SERVER_NOT_FOUND}`);

        });
    }

    getIpFromNodeServices(appCallBack) {

        let config = JSON.parse(localStorage.getItem("config"));
        let serverPort = config.port;
        let lastIp = config.ip;
        let autonomousModeIp = config.autonomousModeIp;

        let applicationNotLaunched = true;

        jxcore('nodeServices.js').loadMainFile(function (ret, err) {

            // Demande l'adresse IP du serveur à la partie Node.js pour lancer l'application
            jxcore("ipFromNodeServices").call(
                {
                    "serverPort": serverPort,
                    "ipsToPing": [lastIp, autonomousModeIp]
                },
                function (serverIp) {

                    if (applicationNotLaunched) {
                        config.ip = serverIp;
                        localStorage.setItem("config", JSON.stringify(config));

                        applicationNotLaunched = false; // Empêche de lancer plusieurs fois l'application
                        appCallBack(`http://${serverIp}:${serverPort}`);
                    }
                });
        });
    }
}