(function () {
	function _pf_log(content) {if(true){console.log(content);}}

function arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

	function fetchHtml() {
		var theHtml = document.documentElement.outerHTML;
		_pf_log('html length=' + theHtml.length);
	}
	
	function postImage(base64Image) {
		var obj = { captcha: base64Image, tid: '1000' };
		$.ajax({
			url: 'http://127.0.0.1:5000/captcha',
			type: 'POST',
			data: JSON.stringify(obj),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(rsp) {
				_pf_log('post image ok, rsp' + rsp);
			}
		});
	}
	
	function getImage(url) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = "arraybuffer";
		xhr.onload = function(e) {
			if (this.status == 200) {
				// get binary data as a response
				console.log("2> "+ xhr.response);
				postImage(arrayBufferToBase64(this.response));
			}
		};	 
		xhr.send();
	}

	function fetchImage() {
		if ($('#info-wf .valcode img').length == 1) {
			var url = $('#info-wf .valcode img').last().attr('src');
			_pf_log('captcha=' + url);
			if (true) {
				getImage(url);
			}
			return true;
		} else {
			_pf_log('fetchImage skip, len=' + $('#info-wf .valcode img').length);
			return false;
		}
	}
	
	function setCaptchaFocus() {
		if ($('#info-wf input[name=captcha]').length == 1) {
			$('#info-wf input[name=captcha]').focus();
			_pf_log('set focus ok')
		} else {
			_pf_log('set focus skip, len=' + $('#info-wf input[name=captcha]').length);
		}
	}
	
	window.onload = function(e){
		_pf_log("pcrawler: window.onload");
		setCaptchaFocus();
		var timerId = setInterval(function() {
			var result = fetchImage();
			if (result) {
				clearInterval(timerId);
			} else {
				_pf_log('fetchImage fail, next ...');
			}
		}, 2000);
	};
})();
