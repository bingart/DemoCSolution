(function () {
	function _pf_log(content) {if(true){console.log(content);}}
	var hrefList = [];
    jQuery(function($){
		$(document).ready(function(){
			loadMore();
		});
		function loadMore() {
			var len = $('ul.sb_pagF li a').length;
			_pf_log('len=' + len);
			if (len > 0) {
				for (var i = 0; i < len; i++) {
					var href = $('ul.sb_pagF li a')[i].getAttribute("href");
					if (href != null) {
						hrefList.push(href);
						_pf_log('href=' + href);
						// Load second page, only for test
						break;
					} else {
						_pf_log('href=null');
					}
				}
			}
			loadPage();
		}
		function loadPage() {
			if (hrefList.length > 0) {
				var href = hrefList.shift();
				$.get(href, function(data) {
					_pf_log('loadPage, url=' + href + ', size=' + data.length);
					parsePage(href, data);
				});
			} else {
				return;
			}
		}
		function parsePage(url, innerHtml) {
			_pf_log('parsePage, url=' + url + ', size=' + innerHtml.length);
			var el = $('<div></div>');
			el.html(innerHtml);
			var results = $('#b_results li.b_algo', el);
			var len = results.len;
			_pf_log('parse: len=' + len);
			results.each(function() {
				var h = $(this)[0].outerHTML;
				_pf_log('parse: html=' + h);
			});
			loadPage();
		}
	});
})();