function _adLog(content) {if(true){console.log(content);}}
function _adGoogleAdsCode(config) {
	if(config) {
		var style = config.style||"display:inline-block;";
		var containerStyle = 'margin-left:auto; margin-right: auto;';
		if(config.width) {
			style = style + 'width:' + width + 'px;height:' + height + 'px';
			containerStyle = containerStyle + 'width:' + width + 'px;height:' + height + 'px';
		}
		var format = "";
		if(config.format) {
			format = 'data-ad-format="'+config.format+'"';
		}
		var layout = "";
		if(config.layout) {
			layout = 'data-ad-layout="'+config.layout+'"';
		}
		var layoukey = "";
		if(config.layoukey) {
			layoukey = 'data-ad-layout-key="'+config.layoukey+'"';
		}
		var fullResponsive = ""
		if(config.fullResponsive) {
			fullResponsive = 'data-full-width-responsive="true"';
		}
		var theHtml = '<!--'+ config.commentID +'--><ins class="adsbygoogle" style="' + style + '"'+ format + layout + layoukey + fullResponsive  +' data-ad-client="'+config.pubID+'"data-ad-slot="' + config.slotID + '"></ins><scri'+'pt>(adsbygoogle=window.adsbygoogle||[]).push({});</scri'+'pt>';
		var allHtml = '<div class="gadc" style="'+ containerStyle+ '">' + theHtml + '</div>';
		return allHtml;
	}
	return '';	
}

var ggSlotIndex = 0;
function _adGoogleAdsCode(config) {
	var slot = "" + config.slotID + "-" + ggSlotIndex;
	ggSlotIndex++;
	return "<scri"+"pt>googletag.cmd.push(function(){googletag.defineSlot('" + config.commentID + "',[" + config.width + "," + config.height + "],'" + slot + "').addService(googletag.pubads());googletag.pubads().enableSingleRequest();googletag.enableServices()});</scri"+"pt><!--" + config.commentID + "--><div id='" + slot + "'style='height:" + config.height + "px; width:" + config.width + "px;'><scri"+"pt>googletag.cmd.push(function(){googletag.display('" + slot + "')});</scri"+"pt></div>";
}
function _adMediaCode(config) {
	/*
	<div id="374803257">
		<script type="text/javascript">
			try {
				window._mNHandle.queue.push(function (){
					window._mNDetails.loadTag("374803257", "728x90", "374803257");
				});
			}
			catch (error) {}
		</script>
	</div>
	*/
	var slotID = "" + config.slotID;
	return "<div id=\"" + slotID + "\"> +
		"<scr" + "ipt type=\"text/javascript\">" +
			"try {" +
				"window._mNHandle.queue.push(function (){" +
					"window._mNDetails.loadTag(\"" + slotID + "\", \"" + config.width + "x" + config.height + "\", \"" + slotID + "\");" +
				"});" +
			"} catch (error) {}" +
		"</scr" + "ipt>";
	"</div>;";
}
function _adGetAdCode(siteId, posId) {
	if (ADM[siteId] === undefined) {
		return "";
	}
	if (ADM[siteId][posId] === undefined) {
		return "";
	}
	var config = ADM[siteId][posId];
	if (config != null && config != undefined) {
		var html = "";
		if (config.provider == "ads") {
			html = _adGoogleAdxCode(config);
		} else if (config.provider == "mdn") {
			html = _adMediaCode(config);
		} else {
			_adLog("invalid provider: " + config.provider);
			return "";
		}
		return html;
	} else {
		return "";
	}
}