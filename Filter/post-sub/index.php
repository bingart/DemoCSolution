<?php
/*
Plugin Name:  Post Substitution
Description:  Post Substitution
Version:      20191231
Author:       Westwin
Author URI:   https://westwin.com
License:      GPL2
License URI:  https://www.gnu.org/licenses/gpl-2.0.html
*/
$__PLUGIN_VERSION__ = '1.0.0';

function _ps_log($content) {
	if (true) {
		$filePath = '/var/log/post-sub.log';
		$dt = new DateTime("now", new DateTimeZone('Asia/Shanghai'));
		$now = $dt->format('Y-m-d H:i:s');
		$fp = fopen($filePath, 'a');
		$line = $now." ".$content."\n";
		fwrite($fp, $line);
		fclose($fp);
	}
}

// The posts_orderby filter
function my_posts_results_filter( $posts ) {
	if ( is_admin() ) return $posts;
	$filtered_posts = array();
	$r = print_r( $posts, true );
	_ps_log("r=".$r);
	/*
	foreach ( $posts as $post ) {
		if ( false === strpos($post->post_title, 'selfie')) {
			// safe to add non-selfie title post to array
			$filtered_posts[] = $post;
		}
	}
	*/
	if (is_search()) {
		_ps_log("is search\n");
		//if (is_main_query()) {
		if (true) {
			_ps_log("is main query\n");
			$p = (object) array(
				'ID' => 92,
				'post_author' => 1,
				'post_title' => 'fake title',
				'post_content' => 'fake content',
				'post_name' => 'fake-post-name',
				'guid' => 'http://ui.dev.chn.gbl/?p=92',
				'filter' => 'raw',
			);
			$post = new WP_Post($p);
			$filtered_posts[] = $post;
			$p = (object) array(
				'ID' => 87,
				'post_author' => 1,
				'post_title' => 'real title',
				'post_content' => 'real content',
				'post_name' => 'real-post-name',
				'guid' => 'http://ui.dev.chn.gbl/?p=87',
				'filter' => 'raw',
			);
			$post = new WP_Post($p);
			$filtered_posts[] = $post;
		}
	}
	return $filtered_posts ;
}
add_filter( 'posts_results', 'my_posts_results_filter' );

function my_posts_where( $where ) {
	/*
	if (is_search()) {
		if ( is_admin() ) return $where;
		if (is_main_query()) {
			$where = " FALSE ";
		}
		_ps_log("is search\n");
		_ps_log("where=".$where."\n");
	}
	*/
	return $where;
}
add_filter( 'posts_where' , 'my_posts_where' );
?>
