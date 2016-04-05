'use strict';

// Initialisation de Cordova
var app = {
    initialize: function initialize() {
        this.bindEvents();
    },
    bindEvents: function bindEvents() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function onDeviceReady() {
        var robot = new Robotator();
        robot.launchApp(application);
    }
};
app.initialize();