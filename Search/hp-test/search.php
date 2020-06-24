<?php

# api for search post.

# Live
# http://htqa.dev.chn.gbl/wp-content/plugins/hp-test/search.php?&s=how%20to&offset=0&count=6

include ('search_core.php');

$s = trim($_GET["s"]);
$offset = 0;
$count = 6;
if (isset($_GET["offset"])) {
	$offset = intval($_GET["offset"]);
}
if (isset($_GET["count"])) {
	$count = intval($_GET["count"]);
}

try {
	$api = new SearchCore();
	$apiResult = $api->invoke($s, $offset, $count);
	$result = array(
		'errorCode' => "OK",
		's' => $s,
		'offset' => $offset,
		'count' => $count,
		'posts' => $apiResult['posts'],
	);
} catch (Exception $e) {
	$result = array(
		'errorCode' => "ERROR",
		's' => $s,
		'offset' => $offset,
		'count' => $count,
		'posts' => array(),
	);
}
$json = json_encode($result);
if (strlen($json) <= 0) {
	$result = array(
		'errorCode' => "EXCEPTION",
		's' => $s,
		'offset' => $postOffset,
		'count' => $postCount,
		'posts' => array(),
	);
	$json = json_encode($result);
}
echo str_replace("\\/", "/", $json);
?>