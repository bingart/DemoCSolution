curl http://172.16.40.150:9203/_cat/indices?v

curl -XPUT -H"Content-Type:application/json" http://172.16.40.150:9203/test_tfidf_live --data-binary @mapping.tfidf.json
curl -XDELETE http://172.16.40.150:9203/test_tfidf_live?pretty
curl http://172.16.40.150:9203/test_tfidf_live/_mapping/?pretty
curl -XPUT -H"Content-Type:application/json" http://172.16.40.150:9203/test_tfidf_live/_doc/1?pretty -d "{\"keyword\": \"hello wbc is here\"}"
curl -XPUT -H"Content-Type:application/json" http://172.16.40.150:9203/test_tfidf_live/_doc/1?pretty -d "{\"keyword\": \"wbc,wbc\"}"
curl -XPOST -H"Content-Type:application/json" http://172.16.40.150:9203/test_tfidf_live/_doc/_search --data-binary @search.tfidf.json

curl -XPUT -H"Content-Type:application/json" http://172.16.40.150:9203/test_tf_live --data-binary @mapping.tf.json
curl -XDELETE http://172.16.40.150:9203/test_tf_live?pretty
curl http://172.16.40.150:9203/test_tf_live/_mapping/?pretty
curl -XPUT -H"Content-Type:application/json" http://172.16.40.150:9203/test_tf_live/_doc/1?pretty -d "{\"keyword\": \"hello wbc is here\"}"
curl -XPUT -H"Content-Type:application/json" http://172.16.40.150:9203/test_tf_live/_doc/1?pretty -d "{\"keyword\": \"wbc,wbc\"}"
curl -XPOST -H"Content-Type:application/json" http://172.16.40.150:9203/test_tf_live/_doc/_search --data-binary @search.tfidf.json

curl -XPUT -H"Content-Type:application/json" http://172.16.40.150:9203/test_post_live --data-binary @mapping.post.json
curl -XDELETE http://172.16.40.150:9203/test_post_live?pretty
curl http://172.16.40.150:9203/test_post_live/_mapping/?pretty
curl -XPUT -H"Content-Type:application/json" http://172.16.40.150:9203/test_post_live/_doc/1?pretty -d "{\"keyword\": \"hello wbc is here\"}"
curl -XPUT -H"Content-Type:application/json" http://172.16.40.150:9203/test_post_live/_doc/1?pretty -d "{\"keyword\": \"wbc,wbc\"}"
curl -XPOST -H"Content-Type:application/json" http://172.16.40.150:9203/test_post_live/_doc/_search --data-binary @search.tfidf.json

curl -XPUT -H"Content-Type:application/json" http://172.16.40.150:9203/test_post --data-binary @mapping.post.orig.json
curl -XDELETE http://172.16.40.150:9203/test_post?pretty
curl -XPUT -H"Content-Type:application/json" http://172.16.40.150:9203/test_post/_settings --data-binary @tf.settings.json
{"error":{"root_cause":[{"type":"illegal_argument_exception","reason":"Can't update non dynamic settings [[index.similarity.scripted_tf.script.source, index.similarity.scripted_tf.type]] for open indices [[test_post/WluHNmGmTGysFwnjNWwX9g]]"}],"type":"illegal_argument_exception","reason":"Can't update non dynamic settings [[index.similarity.scripted_tf.script.source, index.similarity.scripted_tf.type]] for open indices [[test_post/WluHNmGmTGysFwnjNWwX9g]]"},"status":400}