(function () {
	function _log(content) {if(true){console.log(content);}}
	function _injectJs() {
		var temp = document.createElement('script');
		temp.setAttribute('type', 'text/javascript');
		temp.src = "https://www.infosoap.com/wp-includes/js/jquery/jquery.js?ver=1.12.4";
		temp.onload = function() {
			console.log("inject js loaded");
			var temp2 = document.createElement('script');
			temp2.setAttribute('type', 'text/javascript');
			temp2.src = "https://www.infosoap.com/wp-content/plugins/publisher-core/js/inject.js?ver=1.3";
			temp2.onload = function() {
				// remove this when load
				// this.parentNode.removeChild(this);
			};
			document.head.appendChild(temp2);
		};
		document.getElementsByTagName("head")[0].appendChild(temp);
		//document.head.appendChild(temp);		
	}
    jQuery(function($){
		$(document).ready(function(){
			_injectJs();
			_log("inject js");
			console.log("tabs=" + chrome.tabs);
			/*
			chrome.tabs.query(
				{active:true,windowType:"normal", currentWindow: true},
				function(d){
					console.log("tabid=" + d[0].id);
				}
			);
			*/
		});
	});
})();