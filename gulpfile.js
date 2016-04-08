'use strict';

//###################//
//### DÉPENDANCES ###//
//###################//

const gulp = require('gulp');
const watch = require('gulp-watch');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const changed = require('gulp-changed'); // évite de copier des fichiers qui n'ont pas été modifiés
const inject = require('gulp-inject'); // injecte les styles et scripts dans un template
const fileinclude = require('gulp-file-include'); // permet d'injecter les partials
const eslint = require('gulp-eslint'); // vérification du style

// Note : indiquer le nom de la tâche précédente en second paramètre d'une autre permet de les chaîner et d'indiquer qu'il faut attendre qu'elle soit terminée.

//#####################//
//### BUILD APP WEB ###//
//#####################//

// Copie les fichiers de ressources (images et audio)
gulp.task('AppWeb_resources', function () {
    return gulp.src('dev/resources/application/**/*')
        .pipe(changed('AppWeb/public'))
        .pipe(gulp.dest('AppWeb/public'))
});

// Minifie et copie les fichiers de style (css)
gulp.task('AppWeb_css', ['AppWeb_resources'], function () {
    return gulp.src('dev/css/**/*')
        .pipe(cleanCSS())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('AppWeb/public/css'));
});

// Copie, 'babelise' et agrège les scripts (js) pour l'app Web
gulp.task('AppWeb_scripts', ['AppWeb_css'], function () {

    // l'ordre est important
    return gulp.src([
            'dev/js/vendor/jquery.js',
            'dev/js/vendor/vex.js',
            'dev/js/services/**/*',
            'dev/js/scripts/**/*'
        ])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('application.js'))
        .pipe(uglify())
        .pipe(gulp.dest('AppWeb/public/js'));
});

// Copie, et change l'extension du fichier index.html (en .ejs) pour l'app Web
gulp.task('AppWeb_index', ['AppWeb_scripts'], function () {
    return gulp.src('./dev/htmlTemplates/indexTemplate.html')
        .pipe(fileinclude({
            context: {
                app: "appWeb",
                test: false
            }
        }))
        .pipe(concat('index.ejs')) // modifie simplement l'extension
        .pipe(gulp.dest('AppWeb/public'));
});

// Injecte la balise de script
gulp.task('AppWeb_injectScripts', ['AppWeb_index'], function () {

    let jsFile = gulp.src('AppWeb/public/js/application.js', {read: false});

    return gulp.src('AppWeb/public/index.ejs')
        .pipe(inject(jsFile, {relative: true}))
        .pipe(gulp.dest('AppWeb/public'));
});

// Copie et 'babelise' le fichier server.js correspondant au serveur RasPi
gulp.task('AppWeb_serverScript', function () {

    return gulp.src('dev/js/AppWebRasPiServer/server.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('AppWeb'));
});

// Copie simplement les fichiers 'package.json' et 'serverConfig.json' correspondant au serveur RasPi
gulp.task('AppWeb_serverNpmConfig', function () {
    return gulp.src(['dev/configFiles/AppWeb/package.json', 'dev/configFiles/general/serverConfig.json'])
        .pipe(changed('AppWeb'))
        .pipe(gulp.dest('AppWeb'));
});

//########################//
//### BUILD APP MOBILE ###//
//########################//

// Copie les fichiers d'images
gulp.task('AppMobile_resources', function () {
    return gulp.src('dev/resources/application/**/*')
        .pipe(changed('AppMobile/www'))
        .pipe(gulp.dest('AppMobile/www'));
});

// Copie les fichiers d'icones
gulp.task('AppMobile_icons', ['AppMobile_resources'], function () {
    return gulp.src('dev/resources/project/icons/*')
        .pipe(changed('AppMobile/resources/android'))
        .pipe(gulp.dest('AppMobile/resources/android'))
});

// Minifie et copie les fichiers de style (css)
gulp.task('AppMobile_css', ['AppMobile_icons'], function () {
    return gulp.src('dev/css/**/*')
        .pipe(cleanCSS())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('AppMobile/www/css'));
});

// Copie, 'babelise' et agrège les scripts (js) pour l'app Web
gulp.task('AppMobile_scripts', ['AppMobile_css'], function () {

    // l'ordre est important
    return gulp.src([
            'dev/js/vendor/jquery.js',
            'dev/js/vendor/vex.js',
            'dev/js/services/**/*',
            'dev/js/scripts/BootstrapApplication.js',
            'dev/js/scripts/application.js',
        ])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('application.js'))
        .pipe(uglify())
        .pipe(gulp.dest('AppMobile/www/js'));
});

// Copie, et ajoute les bonnes balises au fichier index.html pour l'app Mobile
gulp.task('AppMobile_index', ['AppMobile_scripts'], function () {
    return gulp.src('./dev/htmlTemplates/indexTemplate.html')
        .pipe(fileinclude({
            context: {
                app: "appMobile",
                test: false
            }
        }))
        .pipe(concat('index.html'))
        .pipe(gulp.dest('AppMobile/www'));
});

// Injecte la balise de script
gulp.task('AppMobile_injectScripts', ['AppMobile_index'], function () {

    let jsFile = gulp.src('AppMobile/www/js/application.js', {read: false});

    return gulp.src('AppMobile/www/index.html')
        .pipe(inject(jsFile, {relative: true}))
        .pipe(gulp.dest('AppMobile/www'));
});

// Copie, 'babelise' et minifie le fichier nodeServices.js correspondant aux services Node.js pour l'application mobile
gulp.task('AppMobile_serverScript', function () {

    return gulp.src('dev/js/AppMobileJXCoreServer/nodeServices.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('AppMobile/www/jxcore'));
});

// Copie simplement les fichiers 'package.json' et 'serverConfig.json' correspondant au serveur Node de l'app mobile
gulp.task('AppMobile_serverNpmConfig', function () {
    return gulp.src(['dev/configFiles/AppMobile/package.json', 'dev/configFiles/general/serverConfig.json'])
        .pipe(gulp.dest('AppMobile/www/jxcore'));
});

// Copie simplement le fichier 'config.xml' correspondant à la config des plugins de Cordova
gulp.task('AppMobile_serverNpmConfig2', function () {
    return gulp.src('dev/configFiles/AppMobile/config.xml')
        .pipe(gulp.dest('AppMobile'));
});

//###########################//
//### BUILD TESTS APP WEB ###//
//###########################//

// Copie les fichiers de ressources (images et audio)
gulp.task('AppWebTests_resources', function () {
    return gulp.src('dev/resources/application/**/*')
        .pipe(changed('tests/AppWeb/public'))
        .pipe(gulp.dest('tests/AppWeb/public'))
});

// Minifie et copie les fichiers de style (css)
gulp.task('AppWebTests_css', ['AppWebTests_resources'], function () {
    return gulp.src('dev/css/**/*')
        .pipe(cleanCSS())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('tests/AppWeb/public/css'));
});

// Copie et 'babelise' les scripts (js) pour l'app Web
gulp.task('AppWebTests_scripts', ['AppWebTests_css'], function () {

    // l'ordre n'est pas important
    return gulp.src([
            'dev/js/scripts/*.js',
            'dev/js/services/*.js'
        ])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('tests/AppWeb/public/js'));
});

// Copie simplement les scripts vendor pour l'app Web
gulp.task('AppWebTests_vendorScripts', ['AppWebTests_scripts'], function () {

    // l'ordre n'est pas important
    return gulp.src('dev/js/vendor/**/*.js')
        .pipe(changed('tests/AppWeb/public/js'))
        .pipe(gulp.dest('tests/AppWeb/public/js'));
});

// Copie les scripts de test pour l'app Web
gulp.task('AppWebTests_unitTestsScripts', ['AppWebTests_vendorScripts'], function () {

    // l'ordre n'est pas important
    return gulp.src('tests/unitTests/**/*')
        .pipe(changed('tests/AppWeb/public/js/unitTests'))
        .pipe(gulp.dest('tests/AppWeb/public/js/unitTests'));
});

// Copie, ajoute les DIVs de Qunit et change l'extension du fichier index.html (en .ejs) pour l'app Web
gulp.task('AppWebTests_index', ['AppWebTests_unitTestsScripts'], function () {
    return gulp.src('./dev/htmlTemplates/indexTemplate.html')
        .pipe(fileinclude({
            context: {
                app: "appWeb",
                test: true
            }
        }))
        .pipe(concat('index.ejs')) // modifie simplement l'extension
        .pipe(gulp.dest('tests/AppWeb/public'));
});

// Injecte les balises de script
gulp.task('AppWebTests_injectScripts', ['AppWebTests_index'], function () {

    // l'ordre est important
    let jsFiles = gulp.src([
            'tests/AppWeb/public/js/jquery.js',
            'tests/AppWeb/public/js/vex.js',
            'tests/AppWeb/public/js/Client.js',
            'tests/AppWeb/public/js/Paths.js',
            'tests/AppWeb/public/js/Robotator.js',
            'tests/AppWeb/public/js/Locales.js',
            'tests/AppWeb/public/js/MessageBox.js',
            'tests/AppWeb/public/js/application.js',
            'tests/AppWeb/public/js/BootstrapApplication.js',
            'tests/AppWeb/public/js/qunit.js',
            'tests/AppWeb/public/js/unitTests/**/*'
        ],
        {read: false}
    );

    return gulp.src('tests/AppWeb/public/index.ejs')
        .pipe(inject(jsFiles, {relative: true}))
        .pipe(gulp.dest('tests/AppWeb/public'));
});


//##############################//
//### BUILD TESTS APP MOBILE ###//
//##############################//

// Copie les fichiers d'images
gulp.task('AppMobileTests_resources', function () {
    return gulp.src('dev/resources/application/**/*')
        .pipe(changed('tests/AppMobile/www'))
        .pipe(gulp.dest('tests/AppMobile/www'));
});

// Minifie et copie les fichiers de style (css)
gulp.task('AppMobileTests_css', ['AppMobileTests_resources'], function () {
    return gulp.src('dev/css/**/*')
        .pipe(cleanCSS())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('tests/AppMobile/www/css'));
});

// Copie et 'babelise' les scripts
gulp.task('AppMobileTests_scripts', ['AppMobileTests_css'], function () {

    // l'ordre n'est pas important
    return gulp.src([
            'dev/js/scripts/**/*',
            'dev/js/services/**/*'
        ])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('tests/AppMobile/www/js'));
});

// Copie les scripts vendor (sans les 'babeliser')
gulp.task('AppMobileTests_vendorScripts', ['AppMobileTests_scripts'], function () {

    // l'ordre n'est pas important
    return gulp.src('dev/js/vendor/**/*')
        .pipe(changed('tests/AppMobile/www/js'))
        .pipe(gulp.dest('tests/AppMobile/www/js'));
});

// Copie les scripts de test pour l'app Mobile
gulp.task('AppMobileTests_unitTestsScripts', ['AppWebTests_vendorScripts'], function () {

    // l'ordre n'est pas important
    return gulp.src('tests/unitTests/**/*')
        .pipe(changed('tests/AppMobile/www/js/unitTests'))
        .pipe(gulp.dest('tests/AppMobile/www/js/unitTests'));
});

// Copie, et ajoute les bonnes balises au fichier index.html pour l'app Mobile
gulp.task('AppMobileTests_index', ['AppMobileTests_unitTestsScripts'], function () {
    return gulp.src('./dev/htmlTemplates/indexTemplate.html')
        .pipe(fileinclude({
            context: {
                app: "appMobile",
                test: true
            }
        }))
        .pipe(concat('index.html')) // renomme simplement le fichier
        .pipe(gulp.dest('tests/AppMobile/www'));
});

// Injecte les balises de script
gulp.task('AppMobileTests_injectScripts', ['AppMobileTests_index'], function () {

    // l'ordre est important
    let jsFiles = gulp.src([
            'tests/AppMobile/www/js/jquery.js',
            'tests/AppMobile/www/js/vex.js',
            'tests/AppMobile/www/js/Client.js',
            'tests/AppMobile/www/js/Paths.js',
            'tests/AppMobile/www/js/Robotator.js',
            'tests/AppMobile/www/js/Locales.js',
            'tests/AppMobile/www/js/MessageBox.js',
            'tests/AppMobile/www/js/BootstrapApplication.js',
            'tests/AppMobile/www/js/application.js',
            'tests/AppMobile/www/js/qunit.js',
            'tests/AppMobile/www/js/unitTests/**/*'
        ],
        {read: false}
    );

    return gulp.src('tests/AppMobile/www/index.html')
        .pipe(inject(jsFiles, {relative: true}))
        .pipe(gulp.dest('tests/AppMobile/www'));
});

//#########################//
//### TÂCHES A EXÉCUTER ###//
//#########################//

gulp.task('AppWeb', [
    'AppWeb_resources',
    'AppWeb_css',
    'AppWeb_scripts',
    'AppWeb_index',
    'AppWeb_injectScripts',
    'AppWeb_serverScript',
    'AppWeb_serverNpmConfig',
]);
gulp.task('AppWebTests', [
    'AppWebTests_resources',
    'AppWebTests_css',
    'AppWebTests_scripts',
    'AppWebTests_vendorScripts',
    'AppWebTests_unitTestsScripts',
    'AppWebTests_index',
    'AppWebTests_injectScripts'
]);

gulp.task('AppMobile', [
    'AppMobile_resources',
    'AppMobile_icons',
    'AppMobile_css',
    'AppMobile_scripts',
    'AppMobile_index',
    'AppMobile_injectScripts',
    'AppMobile_serverScript',
    'AppMobile_serverNpmConfig',
    'AppMobile_serverNpmConfig2',
]);
gulp.task('AppMobileTests', [
    'AppMobileTests_resources',
    'AppMobileTests_css',
    'AppMobileTests_scripts',
    'AppMobileTests_vendorScripts',
    'AppMobileTests_unitTestsScripts',
    'AppMobileTests_index',
    'AppMobileTests_injectScripts'
]);

let tasksList = ['AppWeb', 'AppMobile'];
gulp.watch('dev/**/*', tasksList);

let testTasksList = ['AppWebTests', 'AppMobileTests'];
gulp.watch(['dev/**/*', 'tests/unitTests/**/*'], testTasksList);

gulp.task('default', ['AppWeb', 'AppWebTests', 'AppMobile', 'AppMobileTests']);
