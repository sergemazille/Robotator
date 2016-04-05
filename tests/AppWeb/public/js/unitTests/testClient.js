// Tests
QUnit.test( "Objet Client défini", function( assert ) {
    assert.notEqual(Client.isMobileDevice, undefined || null, `(Client.isMobileDevice)   =>   ${Client.isMobileDevice}`);
    assert.notEqual(Client.isMobileApp,  undefined, `(Client.isMobileApp)   =>   ${Client.isMobileApp}`);
    assert.notEqual(Client.isWebApp, undefined, `(Client.isWebApp)   =>   ${Client.isWebApp}`);
    assert.notEqual(Client.language, undefined, `(Client.language)   =>   ${Client.language}`);
});