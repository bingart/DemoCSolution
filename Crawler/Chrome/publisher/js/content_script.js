(function () {
	function _log(content) {if(true){console.log(content);}}
	function _injectJs() {
		var temp = document.createElement('script');
		temp.setAttribute('type', 'text/javascript');
		temp.src = "https://fr.healthtopquestions.com/wp-content/themes/publishable-mag/js/inject.js";
		temp.onload = function() {
			// remove this when load
			// this.parentNode.removeChild(this);
		};
		document.head.appendChild(temp);
	}
    jQuery(function($){
		$(document).ready(function(){
			_injectJs();
			_log("inject js");
		});
	});
})();