/*
	The url2image push solution.
*/

"use strict";
var system = require('system');

if (system.args.length != 6) {
    console.log('usage: phantomjs.exe url png-file-name scroll delay-time step');
	phantom.exit();
}

var url = system.args[1];
var filePath = system.args[2];
var scroll = parseInt(system.args[3]);
var delay = parseInt(system.args[4]);
var step = parseInt(system.args[5]);
var pos = 0;
console.log('url=' + url);
console.log('filePath=' + filePath);
console.log('scroll=' + scroll);
console.log('delay=' + delay);
console.log('step=' + step);

var page = null;
var render = function() {
	page = require('webpage').create();
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
			console.log('load timeout, exit !!!');
			phantom.exit();
		} else {
			console.log('load ok !!!');
			window.setTimeout(function () {
				console.log('timeout');
			}, 200);
			window.setInterval(function () {
				if (scroll > 0) {
					scroll--;
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
					page.scrollPosition = { top: 0, left: 0 };
					page.render(filePath);
					console.log('render ok, filePath=' + filePath);
					phantom.exit();
				}
			}, delay);
		}
	});
}

render();

