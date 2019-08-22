#!/bin/bash

site_name=ui
site_url="ui.dev.chn.gbl"
site_title="title of ui"
mysql_root_password="Westwin@2o17"
site_root_path="/data/wp-app"
log_root_path="/data/logs"
db_name="${site_name}"
db_user="wp_admin"
db_password="wpAdmin@2018"
db_host="172.16.40.139"

site_path="${site_root_path}/${site_name}"
echo ${site_path}
if [ -d ${site_path} ]
then
	echo "site path exists"
else
	mkdir ${site_path}
fi
chown nginx:nginx ${site_path}
echo "site path created: ${site_path}"

log_path="${log_root_path}/${site_name}"
echo ${log_path}
if [ -d ${log_path} ]
then
	echo "log path exists"
else
	mkdir ${log_path}
fi
chown nginx:nginx ${log_path}
echo "log path created: ${log_path}"

echo ${db_name}
echo ${db_user}
echo ${db_password}
echo ${db_host}
sql="drop database ${db_name}; create database ${db_name}; GRANT ALL PRIVILEGES ON ${db_name}.* TO '${db_user}'@'${db_host}' IDENTIFIED BY '${db_password}' WITH GRANT OPTION; FLUSH PRIVILEGES;"
echo "sql=${sql}"
#mysql -u root --host="${db_host}" -p -e "${sql}"
echo "mysql user created"

cd ${site_path}
rm -rf ${site_path}/*
wp core download --allow-root
config_options="--dbname=${db_name} --dbuser=${db_user} --dbpass=${db_password} --dbhost=${db_host} --allow-root"
echo "config_options=${config_options}"
wp config create ${config_options}
wp core install --url=${site_url} --title=${site_title} --admin_user=${db_user} --admin_password=${db_password} --admin_email=feisun@westwin.com --allow-root
echo "wp site created"

chmod 777 -R ${site_path}
echo "site path mod changed: ${site_path}"

nginx_path="/etc/nginx/conf.d/site-${site_name}.conf"
rm -f ${nginx_path}
echo "server {" >> ${nginx_path}
echo "    listen       80;" >> ${nginx_path}
echo "    server_name  ${site_url};" >> ${nginx_path}
echo "    root    /data/wp-app/${site_name};" >> ${nginx_path}
printf '\n' >> ${nginx_path}
echo "    # Load configuration files for the default server block." >> ${nginx_path}
echo "    include /etc/nginx/default.d/*.conf;" >> ${nginx_path}
printf '\n' >> ${nginx_path}
echo "    location / {" >> ${nginx_path}
echo "        index index.php index.html index.htm;" >> ${nginx_path}
echo "        if ( -f \$request_filename) {" >> ${nginx_path}
echo "            expires 14d;" >> ${nginx_path}
echo "            break;" >> ${nginx_path}
echo "        }" >> ${nginx_path}
echo "        if ( !-e \$request_filename) {" >> ${nginx_path}
echo "            rewrite ^(.+)$ /index.php?q=$1 last;" >> ${nginx_path}
echo "        }" >> ${nginx_path}
echo "    }" >> ${nginx_path}
echo "}" >> ${nginx_path}
echo "nginx config created"
