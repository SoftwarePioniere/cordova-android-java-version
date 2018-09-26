const PLUGIN_NAME = "cordova-android-java-version";
const V6 = "cordova-android@6";
const V7 = "cordova-android@7";
const JAVA_VERSION_PATTERN = /(JavaVersion.VERSION_1_6)"/g;

var FILE_PATHS = {};
FILE_PATHS[V6] = {
    "build.gradle": "platforms/android/build.gradle"
};
FILE_PATHS[V7] = {
    "build.gradle": "platforms/android/app/build.gradle"
};

var deferral, fs, path, parser, platformVersion;


function log(message) {
    console.log(PLUGIN_NAME + ": " + message);
}

function onError(error) {
    log("ERROR: " + error);
    deferral.resolve();
}

function getCordovaAndroidVersion() {
    var cordovaVersion = require(path.resolve(process.cwd(), 'platforms/android/cordova/version'));
    return parseInt(cordovaVersion.version) === 7 ? V7 : V6;
}


function run() {
    try {
        fs = require('fs');
        path = require('path');
        parser = require('xml2js');
    } catch (e) {
        throw ("Failed to load dependencies. If using cordova@6 CLI, ensure this plugin is installed with the --fetch option: " + e.toString());
    }

    platformVersion = getCordovaAndroidVersion();
    log("Android platform: " + platformVersion);

    // build.gradle
    var buildGradlePath = path.resolve(process.cwd(), FILE_PATHS[platformVersion]["build.gradle"]);
    var contents = fs.readFileSync(buildGradlePath).toString();
   // fs.writeFileSync(buildGradlePath, contents.replace(JAVA_VERSION_PATTERN, "$1" + version + '"'), 'utf8');

    fs.writeFileSync(buildGradlePath, contents.replace("JavaVersion.VERSION_1_6", "JavaVersion.VERSION_1_7"), 'utf8');
    fs.writeFileSync(buildGradlePath, contents.replace("JavaVersion.VERSION_1_6", "JavaVersion.VERSION_1_7"), 'utf8');
    log("Wrote java JavaVersion.VERSION_1_7 to " + buildGradlePath);

    deferral.resolve();

}

function attempt(fn) {
    return function () {
        try {
            fn.apply(this, arguments);
        } catch (e) {
            onError("EXCEPTION: " + e.toString());
        }
    }
}

module.exports = function (ctx) {
    deferral = ctx.requireCordovaModule('q').defer();
    attempt(run)();
    return deferral.promise;
};
