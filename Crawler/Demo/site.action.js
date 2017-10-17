/*
    wwk crawler with action.
*/

"use strict";
var system = require('system');
var fs = require('fs');

if (system.args.length != 2) {
    console.log('usage: image-file js-file working-path');
	phantom.exit();
}

var getUserAgent = function () {
    var userAgentArr = new Array(
        "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
        "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
        "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
        "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
        "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
        "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
        "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0");
    var index = Math.floor(Math.random() * 33);
    console.log("index=" + index);
    index = index % userAgentArr.length;
    console.log("index=" + index);
    return userAgentArr[index];
}

// Static parameters
var workingPath = system.args[1];
var runCount = 2;
var interDelay = 3000;
var exitCount = 0;
var retry = 1;
var expiredCount = 120000;
var host = "http://www.winwaker.org";
host = "http://localhost:8000/winwaker";
var userAgent = getUserAgent();
var jsFilePath = null;

console.log("#################### PhantomJS started #####################");
console.log("runCount=" + runCount);
console.log("interDelay=" + interDelay);
console.log("retry=" + retry);
console.log("expiredCount=" + expiredCount);
console.log("host=" + host);

var getJs = function () {
    var server = host + "/data/download/do.js";
    console.log('get js, ... ... ' + server);
    var page = require('webpage').create();
    page.open(server, function (status) {
        if (status !== 'success') {
            console.log('get js error, exit ... ...');
            phantom.exit();
        } else {
            try {
                var js = page.plainText;
                console.log('get js ok, js=' + js);
                jsFilePath = workingPath + "/do.js";
                fs.write(jsFilePath, js, 'w');
                console.log('get js ok, jsFilePath=' + jsFilePath);
                checkExit();
            } catch (e) {
                console.log('get js error, exit ... ...');
                phantom.exit();
            }
        }
    });
}

var getTask = function () {
    var server = host + "/data/t/get.php?token=winwaker";
    console.log('get task, ... ... ' + server);
    var page = require('webpage').create();
    page.open(server, function (status) {
        if (status !== 'success') {
            console.log('get task error, waiting ... ...');
            checkExit();
        } else {
            try {
                var json = page.plainText;
                console.log('get task ok, json=' + json);
                var taskResponse = JSON.parse(json);
                if (taskResponse.errorCode === "OK") {
                    var task = taskResponse.task;
                    console.log('get task ok, task.id=' + task.id);
                    fetchTask(task);
                } else {
                    console.log('get task error, erroCode=' + taskResponse.errorCode);
                    checkExit();
                }
            } catch (e) {
                console.log('get task error, ex=' + e);
                checkExit();
            }
        }
    });
}

var fetchTask = function (task) {

    console.log('task.url=' + task.url);
    console.log('task.delay=' + task.delay);
    console.log('task.actions=' + task.actions.length);
    console.log('retry=' + retry);
    console.log('fetch task, ... ...');

    var delay = task.delay;
    if (delay <= 5) {
        delay = 5;
    }

    var settings = {
        operation: "GET",
        headers: {
            "userAgent": userAgent,
        },
        resourceTimeout: 10000, // 10 seconds
        javascriptEnabled: true,
        loadImages: true,
        localToRemoteUrlAccessEnabled: true,
    }
    var page = require('webpage').create();
    page.viewportSize = { width: 1200, height: 800 };
    page.open(task.url, settings, function (status) {
	    if (status !== 'success') {
	        retry--;
	        if (retry > 0) {
	            console.log('fetch error, retry ' + retry + ' ... ...');
	            window.setTimeout(function () {
	                fetchTask(task);
	            }, 3000);
	        } else {
	            console.log('retry exceeded, exit !!!');
	            checkExit();
	        }
	    } else {
	        console.log('fetch ok !!!');
	        console.log('load js, ... ...' + jsFilePath);
	        if (page.injectJs(jsFilePath)) {
	            console.log('load js ok !!!');
	            var pos = 0;
	            var intervalHandle = window.setInterval(function () {
	                console.log('delay=' + delay);
	                delay--;
	                if (delay > 0) {
	                    pos += 400;
	                    console.log('scroll pos=' + pos);
	                    page.scrollPosition = { top: pos, left: 0 };
	                } else {
	                    window.clearInterval(intervalHandle);
	                    var title = page.evaluate(function () {
	                        return document.title;
	                    });
	                    console.log("page title=" + title);
	                    console.log("page url=" + page.url);
	                    page.scrollPosition = { top: 0, left: 0 };

	                    // continue next
	                    var content = page.content;
	                    console.log("page content.length=" + content.length);
	                    // checkExit();
	                    actionTask(task, page);
	                }
	            }, 1000);
	        } else {
	            console.log('load js error, exit !!!');
	            checkExit();
	        }
		}
	});
}

var actionTask = function (task, page) {
    if (task.actions == null || task.actions.length == 0) {
        checkExit();
    } else {
        var action = task.actions[0];
        task.actions.splice(0, 1);
        var key = action.key;
        // delay, js
        if (action.key == 'delay') {
            var delay = parseInt(action.value, 10);
            console.log("action => delay " + delay);
            window.setTimeout(function () {
                actionTask(task, page);
            }, delay * 1000);
        } else if (action.key == "js") {
            var script = action.value;
            console.log("action => js " + script);
            page.evaluateJavaScript(script);
            actionTask(task, page);
        } else {
            checkExit();
        }
    }
}

var checkExit = function () {
    runCount--;
    exitCount = 0;
    console.log("###################### check exit, runCount=" + runCount);
    if (runCount <= 0) {
        phantom.exit();
    } else {
        window.setTimeout(function () {
            getTask();
        }, interDelay);
    }
}

var checkExpired = function () {
    exitCount += 10000;
    console.log("============ check expired, exitCount=" + exitCount + ", expiredCount=" + expiredCount);
    if (exitCount >= expiredCount) {
        phantom.exit();
    } else {
        window.setTimeout(function () {
            checkExpired();
        }, 10000);
    }
}

getJs();
checkExpired();
