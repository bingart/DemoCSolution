function _adLog(content) {if(true){console.log(content);}}

var ggSlotIndex = 0;
function _adGoogleAdsCode(config) {
	ggSlotIndex++;
	var slot = "" + config.slotID + "-" + ggSlotIndex;
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
	ggSlotIndex++;
	var slotID = "" + config.slotID + "-" + ggSlotIndex;
	return "<div id=\"" + slotID + "\">" +
		"<scr" + "ipt type=\"text/javascript\">" +
			"try {" +
				"window._mNHandle.queue.push(function (){" +
					"window._mNDetails.loadTag(\"" + slotID + "\", \"" + config.width + "x" + config.height + "\", \"" + slotID + "\");" +
				"});" +
			"} catch (error) {}" +
		"</scr" + "ipt>" +
	"</div>";
}
function _adGetCode(siteId, posId) {
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