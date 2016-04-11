// A tester sur le serveur RasPi

// paramétrages
let testIp = null;
function testConnection(receivedIP){
    testIp = receivedIP;
}
new Connection(testConnection);

// Tests
QUnit.test("Le serveur retourne bien une adresse IP", function( assert ) {
    assert.notEqual(testIp, null);
});