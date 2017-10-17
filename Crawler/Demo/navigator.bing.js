"use strict";
// 测试证明修改userAgentn可以同时影响js navigator的属性
var page = require('webpage').create();
page.viewportSize = { width: 1200, height: 800 };
page.settings.userAgent = "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0";
var url = "http://www.bing.com";
page.open(url, function(status) {
    if (status !== 'success') {
        console.log('Unable to access network');
    } else {
        var ua = page.evaluate(function () {
            var userAgent = navigator.userAgent;
            var appCodeName = navigator.appCodeName;
            var appName = navigator.appName;
            var appVersion = navigator.appVersion;
            return userAgent + "---" + appCodeName + "---" + appName + "---" + appVersion;
        });
        console.log(ua);
    }
    phantom.exit();
});