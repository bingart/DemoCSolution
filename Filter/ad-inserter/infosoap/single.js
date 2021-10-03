<!-- single -->
<script>
(function () {
    jQuery(function($){
		function insertAds() {
			_adLog("insertAds");
			var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
			if (isMobile) {
				var html = _adGetCode("infosoap", "single-mobile");
				$("article.post.type-post").first().before(html);
			} else {
				var html = _adGetCode("infosoap", "single-pc");
				$("article.post.type-post").first().before(html);
			}
		}		
		$(document).ready(function(){
			insertAds();
		});
	});
})();
</script>