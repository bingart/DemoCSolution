"use strict";
var system = require('system');
if (system.args.length === 1) {
    console.log('Try to pass some args when invoking this script!');
} else {
	var arg0 = system.args[0];
    console.log('arg0=' + arg0);
    system.args.forEach(function (arg, i) {
            console.log(i + ': ' + arg);
    });
}
phantom.exit();