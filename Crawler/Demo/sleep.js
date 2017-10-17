url = "http://www.baidu.com";
interDelay = 1000;
step = 120;
console.log('url=' + url);
console.log('delay=' + interDelay);
console.log('step=' + step);

var page = null;
var render = function () {
    page = require('webpage').create();
    page.viewportSize = { width: 1200, height: 800 };
    page.settings.userAgent = "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0";
    page.settings.resourceTimeout = 10000; // 10 seconds
    page.open(url, function (status) {
        if (status !== 'success') {
            console.log('load timeout, exit !!!');
            phantom.exit();
        } else {
            console.log('load ok !!!');
            window.setInterval(function () {
                if (step > 0) {
                    step--;
                    console.log('step=' + step);
                } else {
                    phantom.exit();
                }
            }, interDelay);
        }
    });
}

render();