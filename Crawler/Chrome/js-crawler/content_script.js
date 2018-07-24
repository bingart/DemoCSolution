(function () {
	function _pf_log(content) {if(true){console.log(content);}}

	
	function createIFrame() {
		var target = document.getElementsByTagName("body")[0];
		var url = 'http://local.9in.com/Crawler/JFini';
		var str = '<iframe id="dframe" style="height:100px; width:100%; position:fixed; bottom:0; left:0; z-index: 10000;" frameborder="0" src="' + url + '#' + Math.random() + '" scrolling="no"></iframe>';
		var div = document.createElement('div');
		div.innerHTML = str;
		target.appendChild(div);
		_pf_log("create IFrame");
	}
	
	window.onload = function(e){
		_pf_log("window.onload");
		if (window.location.host == 'local.9in.com') {
			_pf_log('JSCrawler site, ignored');
			return;
		}
		window.addEventListener("message", function(event) {
			_pf_log(event);
			if (event.data.fn == 'queryPage') {
				_pf_log('queryPage');
				var frame = document.getElementById('dframe');
				if (frame != null) {
					var theHtml = document.documentElement.outerHTML;
					_pf_log('html length=' + theHtml.length);
					frame.contentWindow.postMessage({ html: theHtml, finalUrl: window.location.href, fn: "sendPage" }, '*');
				}
			} else if (event.data.fn == 'nextTask') {
				var redirectUrl = event.data.redirectUrl;
				_pf_log('nextTask, redirectUrl=' + redirectUrl);
				window.location.href = redirectUrl;
			}
		});
		_pf_log("window.onload add message handler");
		createIFrame();
	};
})();
