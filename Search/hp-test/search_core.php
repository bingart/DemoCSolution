<?php

# api for search post core.

class SearchCore {

	private $_searchUrl;
	private $_defaultPreTag;
	private $_defaultPostTag;
	private $_htmlPreTag;
	private $_htmlPostTag;

	public function __construct() {
		$httpHost = $_SERVER['HTTP_HOST'];
		$pos = strpos($httpHost, ".dev.chn.gbl");
		if ($pos === false) {
			$indexHost = 'http://172.20.123.41:9200';
		} else {
			$indexHost = 'http://172.16.40.150:9203';
		}
		$this->_searchUrl = $indexHost."/hp_post_live/_doc/_search?pretty";
		$this->_defaultPreTag = "<strong>";
		$this->_defaultPostTag = "</strong>";
		$this->_htmlPreTag = "^^^^^^^^^^^^^^^^";
		$this->_htmlPostTag = "$$$$$$$$$$$$$$$$";
	}
	
	public function _pf_log($content) {
		if (false) {
			$filePath = '/data/logs/api/api_post.log';
			$dt = new DateTime("now", new DateTimeZone('Asia/Shanghai'));
			$now = $dt->format('Y-m-d H:i:s');
			$fp = fopen($filePath, 'a');
			$line = $now." ".$content."\n";
			fwrite($fp, $line);
			fclose($fp);
		}
	}

	public function _pf_utf8_ex($value) {
		//return iconv(mb_detect_encoding($value, mb_detect_order(), true), 'UTF-8', $value);
		//return iconv(mb_detect_encoding($value, mb_detect_order(), true), 'UTF-8//TRANSLIT', $value);
		//return mb_convert_encoding($value, "UTF-8");
		if (mb_detect_encoding($value, 'UTF-8', true) === false) { 
			// $value = utf8_encode($value);
			$value = mb_convert_encoding($value, "UTF-8");
		}
		return $value;
	}

	public function _pf_substr($value, $offset, $count) {
		$value = preg_replace('!\s+!', ' ', $value);
	//var_dump($value);
		$len = strlen($value);
	//echo 'value='.$value.'<br />';
	//echo 'len='.$len.'<br />';
		if ($len < $count) {
			return $value;
		} else {
			return substr($value, 0, $count)." ...";
		}
	}

	public function _pf_get_post_query($s, $searchType, $offset, $count) {
		$s = urldecode($s);
		
		if ($searchType == 'random') {
			$query = array (
				"match_all" => array (
					"boost" => 1.2
				)
			);
			$offset = random_int(0, 40);
		} else {
			$query = array(
				'bool' => array(
					'should' => array(
						array(
							'match' => array(
								'keyword' => array(
									'query' => $s,
									"operator" => "or",
									"boost" => 2 
								)
							)
						),
						array(
							'match' => array(
								'title' => array(
									'query' => $s,
									"operator" => "or",
									"boost" => 2 
								)
							)
						),
						array(
							'match' => array(
								'excerpt' => array(
									'query' => $s,
									"operator" => "or",
									"boost" => 1 
								)
							)
						),
						array(
							'match' => array(
								'content' => array(
									'query' => $s,
									"operator" => "or",
									"boost" => 0.5 
								)
							)
						),
					),
				),
			);
			$highlight = array(
				"pre_tags" => array($this->_htmlPreTag),
				"post_tags" => array($this->_htmlPostTag),
				"encoder" => "default",
				"fields" => array(
					"title" => array(
						"force_source" => true,
						"fragmenter" => "span",
						"fragment_size" => 180,
						"no_match_size" => 180,
						"number_of_fragments" => 3,
						"type" => "plain"
					),					
					"excerpt" => array(
						"force_source" => true,
						"fragmenter" => "span",
						"fragment_size" => 180,
						"no_match_size" => 180,
						"number_of_fragments" => 3,
						"type" => "plain"
					),
					"content" => array(
						"force_source" => true,
						"fragmenter" => "span",
						"fragment_size" => 180,
						"no_match_size" => 180,
						"number_of_fragments" => 3,
						"type" => "plain"
					)
				)
			);
		}
		
		$data = array(
			'from' => $offset,
			'size' => $count,
			'query' => $query,
			'highlight' => $highlight,
		);

		$json = json_encode($data);
//echo "json=".$json."<br />";
		return $json;
	}

	public function _pf_source2type($source, $score, $highlight, $searchType) {
		if (array_key_exists('postType', $source)) {
			$post = array(
				'ID' => $source['id'],
				'postType' => $source['postType'],
				'title' => $this->_pf_utf8_ex($this->_pf_substr(strip_tags($source['title']), 0, 200)),
				'excerpt' => $this->_pf_utf8_ex($this->_pf_substr(strip_tags($source['excerpt']), 0, 200)),
				'searchType' => $searchType,
				'score' => $score,
			);
			if ($highlight != null) {
				if (array_key_exists("title", $highlight)) {
					$title = str_replace($this->_htmlPreTag, $this->_defaultPreTag, $highlight["title"][0]);
					$title = str_replace($this->_htmlPostTag, $this->_defaultPostTag, $title);
					$post["title"] = $title;
//echo "title=".$title."<br /><br /><br />";
				}
				$excerptUpdated = false;
				if (array_key_exists("excerpt", $highlight)) {
					$excerpt = str_replace($this->_htmlPreTag, $this->_defaultPreTag, $highlight["excerpt"][0]);
					$excerpt = str_replace($this->_htmlPostTag, $this->_defaultPostTag, $excerpt);
					$post["excerpt"] = $excerpt;
					$excerptUpdated = true;
//echo "excerpt=".$excerpt."<br /><br /><br />";
				}
				$excerptUpdated = true;
				if ($excerptUpdated == false && array_key_exists("content", $highlight)) {
					$highlightContent = $highlight["content"][0];
					$newExcerpt = str_replace($this->_htmlPreTag, $this->_defaultPreTag, $highlightContent);
					$newExcerpt = str_replace($this->_htmlPostTag, $this->_defaultPostTag, $newExcerpt);
				}
			}
			return $post;
		} else {
			return null;
		}
	}
	
	public function _pf_search($s, $searchType, $offset, $count) {
		try {
			$posts = array();
			
			$json = $this->_pf_get_post_query($s, $searchType, $offset, $count);
//echo "json=".$json."<br />";
			
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $this->_searchUrl);
			curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Content-Length: ' . strlen($json)));
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
			curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 1);
			curl_setopt($ch, CURLOPT_TIMEOUT, 5);
			$rsp = curl_exec($ch);
			curl_close($ch);
//echo "rsp=".$rsp."<br /><br /><br /><br /><br />";

			$rsp = json_decode($rsp, true);
			$hits = $rsp["hits"]["hits"];
			if (sizeof($hits) > 0) {
				foreach ($hits as &$hit) {
					$source = $hit["_source"];
					$score = $hit["_score"];
					$highlight = $hit["highlight"];
					$post = $this->_pf_source2type($source, $score, $highlight, $searchType);
					if ($post != null) {
						array_push($posts, $post);
					}
					if (sizeof($posts) >= $count) {
						break;
					}
				}
			}

			return array(
				'errorCode' => "OK",
				'offset' => $postOffset,
				'count' => $postCount,
				'posts' => $posts,
			);
		} catch (Exception $e) {
			return array(
				'errorCode' => "ERROR",
				'offset' => $postOffset,
				'count' => $postCount,
				'posts' => array(),
			);
		}
	}

	public function invoke($s, $offset, $count) {
		try {
			$posts = array();
			
			$searchResult = $this->_pf_search($s, 'internal', $offset, $count);
			if ($searchResult['errorCode'] == 'OK') {
				foreach ($searchResult['posts'] as &$post) { array_push($posts, $post); }
			}

			if ($count > sizeof($posts)) {
				$searchResult = $this->_pf_search($s, 'random', $offset, $count - sizeof($posts));
				if ($searchResult['errorCode'] == 'OK') {
					foreach ($searchResult['posts'] as &$post) { array_push($posts, $post); }
				}
			}

			$result = array(
				'errorCode' => "OK",
				's' => $s,
				'offset' => $offset,
				'count' => $count,
				'posts' => $posts,
			);
			return $result;
		} catch (Exception $e) {
			$result = array(
				'errorCode' => "ERROR",
				's' => $s,
				'offset' => $offset,
				'count' => $count,
				'posts' => array(),
			);
			return $result;
		}
	}
}
?>
