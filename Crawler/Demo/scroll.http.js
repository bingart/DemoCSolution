/*
	The url2image push solution.
*/

"use strict";
var system = require('system');

if (system.args.length != 2) {
    console.log('usage: phantomjs.exe js-file run-count');
	phantom.exit();
}

// Static parameters
var runCount = system.args[1];
var rootPath = "E:/NutchData/Pages/";
var rootUrl = "http://url2image.9in.com/images";

var render = function (tid, url, scroll, delay, step, retry) {

    console.log('tid=' + tid);
    console.log('url=' + url);
    console.log('scroll=' + scroll);
    console.log('delay=' + delay);
    console.log('step=' + step);
    console.log('retry=' + retry);

    var page = require('webpage').create();
	page.viewportSize = { width: 1200, height: 800 };
	page.settings.userAgent = "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0";
	page.settings.resourceTimeout = 10000; // 10 seconds
	page.open(url, function(status) {
		/*
		page.includeJs("http://stjs.s-9in.com/jquery-1.10.2.min.js", function() {
		page.evaluate(function() {
			$("button").click();
		});
		*/
	    if (status !== 'success') {
	        retry--;
	        if (retry > 0) {
	            console.log('load error, retry ' + retry + ' ... ...');
	            window.setTimeout(function () {
	                render();
	            }, 3000);
	        } else {
	            console.log('retry exceeded, exit !!!');
	            checkExit();
	        }
		} else {
	        console.log('load ok !!!');
	        var pos = 0;           
	        var intervalHandle = window.setInterval(function () {
	            console.log('scroll=' + scroll);
	            scroll--;
	            if (scroll > 0) {
					pos += step;
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
					page.scrollPosition = { top: 0, left: 0 };
					var fileName = tid + ".png";

	                // Check and create working folder
					var now = new Date();
					var dateStr =
                        now.getFullYear() +
					    ("0" + (now.getMonth() + 1)).slice(-2) +
                        ("0" + now.getDate()).slice(-2);
					var workingPath = rootPath + dateStr;
					var fs = require('fs');
					if (!fs.exists(workingPath)) {
					    if (!fs.makeDirectory(workingPath)) {
					        console.log("fatal error !!!, working folder created error, path=" + workingPath);
					        phantom.exit();
					    } else {
					        console.log("create working folder" + workingPath);
					    }
					}

                    // Render and complete task
					var filePath = workingPath + "/" + fileName;
					page.render(filePath);
					console.log('render ok, filePath=' + filePath);
					var fileUrl = rootUrl + "/" + dateStr + "/" + fileName;
					taskComplete(tid, fileUrl);
                }
			}, delay);
		}
	});
}

var taskGet = function () {
    console.log('get task, ... ...');
    var page = require('webpage').create(),
        server = 'http://url2image.9in.com/Task/Get?accessToken=111111',
        data = 'universe=expanding&answer=42';
    page.open(server, 'get', function (status) {
        if (status !== 'success') {
            console.log('get task error, waiting ... ...');
            window.setTimeout(function () {
                checkExit();
            }, 1000);
        } else {
            var json = page.plainText;
            console.log('get task ok, json=' + json);
            var t = JSON.parse(json);
            if (t.tid != null) {
                console.log('get task ok, tid=' + t.tid);
                render(t.tid, t.url, t.scroll, t.delay, t.step, 1);
            } else {
                console.log('get task error, tid=' + t.tid);
                window.setTimeout(function () {
                    checkExit();
                }, 1000);
            }
        }
    });
}

var taskComplete = function(tid, fileUrl) {
    console.log('complete task ... ...');
    var uri = "http://url2image.9in.com/Task/Complete?accessToken=111111&tid=" + tid + "&imageFileUrl=" + fileUrl;
    var page = require('webpage').create(), server = uri;
    page.open(server, 'get', function (status) {
        if (status !== 'success') {
            console.log('complete task error, tid=' + tid);
        } else {
            var rsp = page.plainText;
            if (rsp == "OK") {
                console.log('complete task ok, tid=' + tid);
            } else {
                console.log('complete task error, tid=' + tid + ", rsp=" + rsp);
                console.log(rsp);
            }
        }
        checkExit();
    });
}

var checkExit = function () {
    runCount--;
    console.log("check exit, runCount=" + runCount);
    if (runCount <= 0) {
        phantom.exit();
    } else {
        window.setTimeout(function () {
            taskGet();
        }, 1000);
    }
}

taskGet();

