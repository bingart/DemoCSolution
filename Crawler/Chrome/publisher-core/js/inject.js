(function () {
	function _log(content) {if(true){console.log(content);}}
	function _invoke() {
		_log("injected");
		setTimeout(function() { 
			if (typeof jQuery == 'undefined') {
				_log("jquery undefined");
			} else {
				jQuery(function($) {
					var len = $("div").length;
					_log("div length=" + len);
				});
			}
		}, 10000);
	}
	_invoke();
})();