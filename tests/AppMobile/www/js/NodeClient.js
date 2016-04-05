
//let port = Robotator.port;
//
//let inter = setInterval(function () {
//    if (typeof jxcore == 'undefined') return;
//    clearInterval(inter);
//    jxcore.isReady(function () {
//        jxcore('app.js').loadMainFile(function (ret, err) {
//            if (err) {
//                let msg;
//                if (!err || err.replace)
//                    msg = err;
//                else
//                    msg = JSON && JSON.stringify ? JSON.stringify(err) : err;
//                alert(msg);
//            } else {
//
//                // Le module Polo de JXCore renvoie l'adresse IP du serveur
//                jxcore('receiveServerIP').register(function (serverIP) {
//
//                    // Condition qui empêche l'IP d'être assignée une seconde fois si elle a déjà été trouvé en mémoire
//                    // ce qui implique que l'application a déjà été lancée avec.
//                    //if (localStorage.getItem("lastIpUsed") == null) {
//                    //
//                    //    // Enregistre l'adresse IP pour gagner du temps la prochaine fois
//                    //    localStorage.setItem("lastIpUsed", serverIP);
//                    //    console.log(`IP from 'Polo' : http://${serverIP}:${port}`);
//                    //
//                    //    cbFunction(`http://${serverIP}:${port}`);
//                    //}
//
//                    localStorage.setItem("lastIpUsed", serverIP);
//                    console.log(`IP from 'Polo' : http://${serverIP}:${port}`);
//
//                    cbFunction(`http://${serverIP}:${port}`);
//
//                });
//            }
//        });
//    });
//}, 5);
"use strict";