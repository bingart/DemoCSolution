var page = require('webpage').create();
page.open('http://www.baidu.com/', function() {
  page.render('D:/baidu.png');
  phantom.exit();
});