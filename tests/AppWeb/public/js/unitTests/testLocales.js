// Toutes les chaînes de caractères ne sont pas testées
QUnit.test( "Locales définies", function( assert ) {
    assert.notEqual(Locales.loading.IN_PROGRESS, undefined, `Locales.loading.IN_PROGRESS => ${Locales.loading.IN_PROGRESS}`);
    assert.notEqual(Locales.network.LOCAL, undefined, `Locales.network.LOCAL => ${Locales.network.LOCAL}`);
    assert.notEqual(Locales.buttons.VALIDATE, undefined, `Locales.buttons.VALIDATE => ${Locales.buttons.VALIDATE}`);
}) ;