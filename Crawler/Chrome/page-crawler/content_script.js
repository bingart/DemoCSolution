(function () {
	function _pf_log(content) {if(true){console.log(content);}}

	function fetchHtml() {
		var theHtml = document.documentElement.outerHTML;
		_pf_log('html length=' + theHtml.length);
	}
	
	function fetchImage() {
		if ($('#info-wf .valcode img').length == 1) {
			var url = $('#info-wf .valcode img').last().attr('src');
			_pf_log('captcha=' + url);
			$.get(url, function( data ) {
				_pf_log('data.length=' + data.length);
				/*
				$.post( "http://127.0.0.1:5000/image", function( data ) {
					_pf_log('post image ok');
				});
				*/
				var obj = { img: data, tid: '1000' };
				$.ajax({
					url: 'http://127.0.0.1:5000/image',
					type: 'POST',
					data: JSON.stringify(obj),
					contentType: 'application/json; charset=utf-8',
					dataType: 'json',
					async: false,
					success: function(rsp) {
						_pf_log('post image ok, rsp' + rsp);
					}
				});
			});
		} else {
			_pf_log('fetchImage skip, len=' + $('#info-wf .valcode img').length);
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
		setTimeout(function() {
			fetchImage();
		}, 5000);
	};
})();
