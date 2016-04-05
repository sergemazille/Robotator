"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/***************************************************************************************************/
/* ***** Vérifie le moyen de connexion du client (navigateur (mobile/desktop) ou app mobile) ***** */
/***************************************************************************************************/

var Client = function () {
    function Client() {
        _classCallCheck(this, Client);
    }

    _createClass(Client, null, [{
        key: "isMobileDevice",


        // L'idéal serait de détecter le support des touch events mais c'est plus compliqué qu'il n'y paraît :http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
        get: function get() {
            var isMobile = {
                Android: function Android() {
                    return navigator.userAgent.match(/Android/i);
                },
                BlackBerry: function BlackBerry() {
                    return navigator.userAgent.match(/BlackBerry/i);
                },
                iOS: function iOS() {
                    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                },
                Opera: function Opera() {
                    return navigator.userAgent.match(/Opera Mini/i);
                },
                Windows: function Windows() {
                    return navigator.userAgent.match(/IEMobile/i);
                },
                any: function any() {
                    return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
                }
            };

            if (null === isMobile.any()) {
                return false;
            }
            return isMobile.any();
        }
    }, {
        key: "isWebApp",
        get: function get() {

            return null != document.getElementById("webApp");
        }
    }, {
        key: "isMobileApp",
        get: function get() {
            return !this.isWebApp; // s'il s'agit de l'application mobile c'est qu'il ne s'agit pas de l'application web...
        }
    }, {
        key: "language",
        get: function get() {
            return window.navigator.userLanguage || window.navigator.language;
        }
    }]);

    return Client;
}();