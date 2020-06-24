<?php

# api for search post view, support phrase.

# Live
# http://htqa.dev.chn.gbl/wp-content/plugins/hp-test/search.view.php?&s=wbc&offset=0&count=6

include ('search_core.phrase.php');

$s = trim($_GET["s"]);
$offset = 0;
$count = 6;
if (isset($_GET["offset"])) {
	$offset = intval($_GET["offset"]);
}
if (isset($_GET["count"])) {
	$count = intval($_GET["count"]);
}

$api = new SearchCore();
$apiResult = $api->invoke($s, $offset, $count);
$posts = $apiResult['posts'];

foreach ($posts as &$post) {
?>
	<style>
		strong {
			color: green;
		}
	</style>
	<h3 data=""><?php echo $post["title"] ?> - <?php echo $post["score"] ?></h3>
	<p><?php echo $post["excerpt"] ?> ... ...</p>
<?php
}
?>

