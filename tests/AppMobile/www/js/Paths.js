"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/************************************************************************/
/* ***** Contient les chemin vers les ressources de l'application ***** */
/************************************************************************/

var Paths = function () {
    function Paths() {
        _classCallCheck(this, Paths);
    }

    _createClass(Paths, null, [{
        key: "images",
        get: function get() {

            var _paths = {
                LOGO: "img/logo.png",
                LOGO_SAD: "img/logo_triste.png",
                SPINNER: "img/spinner.gif"
            };

            return _paths;
        }
    }]);

    return Paths;
}();