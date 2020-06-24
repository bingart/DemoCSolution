<?php

require_once("aes_cipher.php");

function search($key) {
	$keyEncoded = urlencode($key);
	$keyEncoded = str_replace("+", "%20", $keyEncoded);
	$url = "https://api-r04.healthpage.com/search/list/".$key."?tid=".uniqid();
echo "url=".$url."<br />";
	$body = file_get_contents($url);
	$etag = null;
	$key = null;
	//var_export($http_response_header);
	//echo "<br /><br /><br /><br />";
	//var_export($body);
	//echo "<br /><br /><br /><br />";
	foreach ($http_response_header as &$header) {
		//echo $header;
		//echo "<br /><br /><br /><br />";
		if (strpos($header, "Tag:") > 0) {
			$etag = substr($header, 6);
			$key = "PalBfHNjEoJ9Ie0m".substr($etag, 6, 16);
			//echo "etag=".$etag;
			//echo "<br /><br /><br /><br />";
			//echo "key=".$key;
			//echo "<br /><br /><br /><br />";
			break;
		}
	}
	if ($key == null) {
		return null;
	}
	$aesCipher = new AesCipher($key);
	$res = $aesCipher->_decrypt($body);
	//echo "res=".$res."<br /><br /><br />";
	$pos = strrpos($res, "}}");
	$res2 = substr($res, 0, $pos + 2);
	//echo "res2=".$res2."<br />";
	$result = json_decode($res2, true);
	$posts = $result["content"]["data"];
	//print_r($posts);
	return $posts;
}

$s = $_GET["s"];
$s = urldecode($s);
$posts = null;
if ($s != null && strlen($s) > 0) {
	$posts = search($s);
}

?>

<div class="search">
	<form>
		<input class="" name="s" id="s" value="<?php echo $s; ?>" size="80" />
		<input type="submit" />
	</form>
</div>

<hr />
<h1>API-R04: Result for: <?php echo $s; ?></h1>
<?php
	if ($posts != null) {
		//print_r($posts);
		foreach ($posts as &$post) {
			$type = $post["type"];
			if ($type == "article") {
				$url = "https://www.healthpage.com/news/".$post["slug"];
			} else if ($type == "quiz" || $type == "discuss") {
				$url = "https://www.healthpage.com/community/".$post["slug"];
			} else {
				$url = "https://www.healthpage.com".$post["slug"];
			}
?>	
	<h3 data=""><?php echo $post["title"] ?> - <?php echo $post["score"] ?> - <a href="<?php echo $url; ?>" class="view" target="_blank">View</a>
	</h3>
	<p><?php echo $post["excerpt"] ?> ... ...</p>
<?php
			//break;
		}
	}
?>
