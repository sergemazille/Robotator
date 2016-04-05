// A tester sur le serveur RasPi

// paramétrages
let testIp = null;
function testRobotator(receivedIP){
    testIp = receivedIP;
}
new Robotator().launchApp(testRobotator);

// Tests
QUnit.test("Le serveur retourne bien une adresse IP", function( assert ) {
    assert.notEqual(testIp, null);
});