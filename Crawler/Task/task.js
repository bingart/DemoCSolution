/*
	Task implementation.
    Created by Fei Sun.
*/

"use strict";
var system = require('system');

if (system.args.length != 7) {
    console.log('usage: exe-file js-file config-host jsEnabled run-count inter-delay-ms retry-count expired-count-ms');
	phantom.exit();
}

// Static parameters
var configHost = system.args[1];
var dispatcherHost = null;
var jsEnabled = system.args[2];
var runCount = system.args[3];
var interDelay = system.args[4];
var exitCount = 0;
var retry = system.args[5];
var expiredCount = system.args[6];
var whiteList = null;

console.log("#################### Started #####################");
console.log("configHost=" + configHost);
console.log("jsEnabled=" + jsEnabled);
console.log("runCount=" + runCount);
console.log("interDelay=" + interDelay);
console.log("retry=" + retry);
console.log("expiredCount=" + expiredCount);

var getConfig = function () {
    console.log('###################### get config, ... ...');
    var page = require('webpage').create();
    var server = configHost + "/WebApi/Config2";
    var settings = {
        operation: "POST",
        encoding: "utf8",
        headers: {
            "Content-type": "application/json"
        },
        data: JSON.stringify({
            uid: "PS_0",
            capacity: "DYNAMIC"
        })
    };
    page.open(server, settings, function (status) {
        if (status !== 'success') {
            console.log('get config error, exit ... ...');
            phantom.exit();
        } else {
            try {
                var json = page.plainText;
                console.log('get config ok, json=' + json);
                var configResponse = JSON.parse(json);
                if (configResponse.errorCode === "OK") {
                    var config = configResponse.config;
                    dispatcherHost = config.dispatcherHost;
                    whiteList = config.whiteList;
                    checkExit();
                } else {
                    console.log('get config error, erroCode=' + taskResponse.errorCode);
                    phantom.exit();
                }
            } catch (e) {
                console.log('get config error, ex=' + e);
                phantom.exit();
            }
        }
    });
}

var getTask = function () {
    console.log('get task, ... ...');
    var page = require('webpage').create();
    var server = dispatcherHost + "/WebApi/Task2";
    var settings = {
        operation: "POST",
        encoding: "utf8",
        headers: {
            "Content-type": "application/json"
        },
        data: JSON.stringify({
            uid: "NET_0",
            whiteList: whiteList
        })
    };
    page.open(server, settings, function (status) {
        if (status !== 'success') {
            console.log('get task error, waiting ... ...');
            checkExit();
        } else {
            try {
                var json = page.plainText;
                console.log('get task ok, json=' + json);
                var taskResponse = JSON.parse(json);
                if (taskResponse.errorCode === "OK") {
                    var task = taskResponse.taskList[0];
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
    console.log('task.id=' + task.id);
    console.log('task.url=' + task.url);
    console.log('task.jsEnabled=' + task.jsEnabled);
    console.log('task.jsLoadTime=' + task.jsLoadTime);
    console.log('task.robotRule=' + task.robotRule.value);
    console.log('task.dataCenter=' + task.dataCenter);
    console.log('retry=' + retry);
    console.log('fetch task, ... ...');

    var jsLoadTime = task.jsLoadTime;
    if (jsLoadTime <= 3) {
        jsLoadTime = 3;
    }

    var settings = {
        operation: "GET",
        headers: {
            "userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
        },
        resourceTimeout: 10000, // 10 seconds
        javascriptEnabled: jsEnabled,
        loadImages: false,
        localToRemoteUrlAccessEnabled: true,
    }
    var page = require('webpage').create();
    page.viewportSize = { width: 1200, height: 800 };
    page.open(task.url, settings, function (status) {
		/*
		page.includeJs("http://stjs.s-9in.com/jquery-1.10.2.min.js", function() {
		page.evaluate(function() {
			$("button").click();
		});
		*/
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
	        console.log('load ok !!!');
	        var pos = 0;           
	        var intervalHandle = window.setInterval(function () {
	            console.log('jsLoadTime=' + jsLoadTime);
	            jsLoadTime--;
	            if (jsLoadTime > 0) {
					pos += 400;
					console.log('scroll pos=' + pos);
					page.scrollPosition = { top: pos, left: 0 };
					/*
					page.evaluate(function(pos) {
						window.document.body.scrollTop = pos;
					});
					*/
	            } else {
	                window.clearInterval(intervalHandle);
					var title = page.evaluate(function() {
						return document.title;
					});
					console.log("page title=" + title);
					console.log("page url=" + page.url);
					page.scrollPosition = { top: 0, left: 0 };

	                // send page
					var content = page.content;
					console.log("page content.length=" + content.length);
					sendPage(task, page.url, content);
                }
			}, 1000);
		}
	});
}

var sendPage = function (task, redirectUrl, content) {
    console.log('send page ... ...');
    var page = require('webpage').create();
    var server = task.dataCenter + "WebApi/Page2";
    //server = "http://datacenter.tlvstream.com/WebApi/Page2";
    //server = "http://default.datacenter.9in.com/WebApi/Page2"
    console.log('send page, server=' + server);

    var settings = {
        operation: "POST",
        encoding: "utf8",
        headers: {
            "Accept": "*/*",
            "Content-type": "application/json"
        },
        data: JSON.stringify({
            uid: "NET_0",
            task: task,
            redirectUrl: redirectUrl,
            page: {
                encoding: "UTF8",
                type: "HTML",
                content: null,
                html: content,
            },
        })
    };
    page.open(server, settings, function (status) {
        if (status !== 'success') {
            console.log('send page error, task.id=' + task.id);
            checkExit();
        } else {
            try {
                var json = page.plainText;
                console.log('send page ok, json=' + json);
                var pageResponse = JSON.parse(json);
                if (pageResponse.errorCode === "OK") {
                    console.log('send page ok, task.id=' + task.id);
                    completeTask(task);
                } else {
                    console.log('send page error, erroCode=' + pageResponse.errorCode);
                    console.log(rsp);
                    checkExit();
                }
            } catch (e) {
                console.log('send page error, ex=' + e);
                checkExit();
            }
        }
    });
}

var completeTask = function (task) {
    console.log('complete task ... ...');
    var page = require('webpage').create();
    var server = dispatcherHost + "/WebApi/Complete2";
    var settings = {
        operation: "POST",
        encoding: "utf8",
        headers: {
            "Content-type": "application/json"
        },
        data: JSON.stringify({
            uid: "NET_0",
            task: task,
        })
    };
    page.open(server, settings, function (status) {
        if (status !== 'success') {
            console.log('complete task error, task.id=' + task.id);
        } else {
            try {
                var json = page.plainText;
                console.log('complete task ok, json=' + json);
                var completeResponse = JSON.parse(json);
                if (completeResponse.errorCode === "OK") {
                    console.log('complete task ok, task.id=' + task.id);
                } else {
                    console.log('complete task error, task.id=' + task.id);
                    console.log(rsp);
                }
            } catch (e) {
                console.log('complete task error, ex=' + e);
            }
        }
        checkExit();
    });
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

getConfig();
checkExpired();
