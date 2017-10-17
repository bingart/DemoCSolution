/*
	Cookie generator.
    Created by Fei Sun.
*/

"use strict";
var system = require('system');

console.log("#################### Started #####################");

var fetchRevolveCom = function () {

    var url = "http://www.revolve.com/lime-crime-velvetine-/dp/LIMR-WU14/";
    var jsLoadTime = 5;
    var settings = {
        operation: "GET",
        headers: {
            "userAgent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
        },
        resourceTimeout: 10000, // 10 seconds
        javascriptEnabled: true,
        loadImages: false,
        localToRemoteUrlAccessEnabled: true,
    }
    var page = require('webpage').create();
    page.viewportSize = { width: 1200, height: 800 };
    page.open(url, settings, function (status) {
	    if (status !== 'success') {
		} else {
	        console.log('load ok !!!');
	        var pos = 0;           
	        var intervalHandle = window.setInterval(function () {
	            jsLoadTime--;
	            if (jsLoadTime > 0) {
					pos += 400;
					console.log('scroll pos=' + pos);
					page.scrollPosition = { top: pos, left: 0 };
	            } else {
	                window.clearInterval(intervalHandle);
					var title = page.evaluate(function() {
						return document.title;
					});
					console.log("page title=" + title);
					page.scrollPosition = { top: 0, left: 0 };
					console.log("Please set cookie: userLanguagePref=en !!!!!");
					console.log("Please restart and verify the title !!!!!");
					phantom.exit();
                }
			}, 1000);
		}
	});
}

fetchRevolveCom();