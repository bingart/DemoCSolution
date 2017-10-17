/*
	The fetch.
*/

"use strict";
var system = require('system');
var fs = require('fs');

if (system.args.length != 7) {
    console.log('usage: phantomjs.exe url png-file-name scroll delay-time step retry-count');
	phantom.exit();
}

// Static parameters
var url = system.args[1];
var filePath = system.args[2];
var scroll = parseInt(system.args[3]);
var delay = parseInt(system.args[4]);
var step = parseInt(system.args[5]);
var retry = parseInt(system.args[6]);
console.log('url=' + url);
console.log('filePath=' + filePath);
console.log('scroll=' + scroll);
console.log('delay=' + delay);
console.log('step=' + step);
console.log('retry=' + retry);

// Runtime parameters
var page = null;
var pos = 0;
var currentScroll = 0;

var render = function () {
	page = require('webpage').create();
	page.viewportSize = { width: 1200, height: 800 };
	page.settings.userAgent = "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0";
	page.settings.resourceTimeout = 10000; // 10 seconds
	page.onLoadFinished = function (status) {
	    console.log('Status: ' + status);
	    // Do other things here...
	};
	page.open(url, function(status) {
        page.includeJs(            
            'http://stjs.s-9in.com/jquery-1.10.2.min.js',
            function () {
                console.log("included");
            }
        );

	    if (status !== 'success') {
	        if (retry > 0) {
	            retry--;
	            console.log('load error, retry ' + retry + ' ... ...');
	            window.setTimeout(function () {
	                render();
	            }, 3000);
	        } else {
	            console.log('retry exceeded, exit !!!');
	            phantom.exit();
	        }
		} else {
	        console.log('load ok !!!');
	        pos = 0;
	        currentScroll = scroll;
	        window.setInterval(function () {
	            if (currentScroll > 0) {
	                currentScroll--;
					pos += step;
					console.log('scroll pos=' + pos);
					page.scrollPosition = { top: pos, left: 0 };
					/*
					page.evaluate(function(pos) {
						window.document.body.scrollTop = pos;
					});
					*/
				} else {
					var title = page.evaluate(function() {
						return document.title;
					});
					console.log(title);

	                // CSS selector
					fetch(page);
	                // XPath
					fetchByXPath(page);

					console.log(page.title); // get page Title
                    page.scrollPosition = { top: 0, left: 0 };
					page.render(filePath);
					console.log('render ok, filePath=' + filePath);

					phantom.exit();
				}
			}, delay);
		}
	});
}

var fetch = function (page) {
    var content = page.evaluate(function () {
        var anchors = $("a");
        var c = "";
        for (var i = 0; i < anchors.length; i++) {
            var a = anchors[i];
            c += a.getAttribute("href");
            c += "\r\n";
        }
        return c;
    });
    var path = 'D:/fetch.txt';
    fs.write(path, content, 'w');
    console.log('write ok, filePath=' + path);
}

var fetchByXPath = function (page) {
    var content = page.evaluate(function () {
        var c = "";
        var anchors = document.evaluate("//A[@class='nav-item-name']", document, null, XPathResult.ANY_TYPE, null);
        var theA = anchors.iterateNext();
        while (theA) {
            c += theA.getAttribute("href");
            c += "\r\n";
            theA = anchors.iterateNext();
        }
        return c;
    });
    var path = 'D:/fetchXPath.txt';
    fs.write(path, content, 'w');
    console.log('write ok, filePath=' + path);
}

render();

