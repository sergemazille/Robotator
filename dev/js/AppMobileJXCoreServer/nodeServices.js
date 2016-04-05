// destination : 'Robotator\AppMobile\www\jxcore'

//##############################################################//
//##### Services requérant Node.js côté application mobile #####//
//##############################################################//

Mobile("ipFromJX").registerAsync(function(callback){
    var polo = require('polo');
    var services = polo();
    services.on('up', function (name, service) {
        var serverIP = services.get(name).host;
        //Mobile('receiveServerIP').call(serverIP);
        callback(serverIP);
    });
});

//apps.on('up', function (name, service) {
//    var serverIP = apps.get(name).host;
//    //Mobile('receiveServerIP').call(serverIP);
//    Mobile('msg').call(serverIP);
//});
//
//
//var tcpp = require('tcp-ping');
//
//tcpp.probe('192.168.0.45', 8888, function (err, available) {
//    Mobile('msg').call("JXprobe" + available);
//});
//
//tcpp.ping({address: '192.168.0.45'}, function (err, data) {
//    Mobile('msg').call(data);
//});
//
//Mobile('getLocalStorage').call("Data");
//


//Mobile('msg').call(localStorage.getItem('myFirstKey'));
