#!/bin/bash

sudo mkdir /svc/www/uhealthformula.com
sudo mkdir /svc/logs/nginx/uhealthformula.com
sudo chown nginx:nginx /svc/www/uhealthformula.com
sudo chown nginx:nginx /svc/logs/nginx/uhealthformula.com

drop database uhealthformula;
create database uhealthformula;
GRANT ALL PRIVILEGES ON uhealthformula.* TO 'wp_admin'@'172.20.33.146' IDENTIFIED BY 'wpAdmin@2018' WITH GRANT OPTION;
FLUSH PRIVILEGES;

sudo cd /svc/www/uhealthformula;
sudo wp core download --allow-root
sudo wp config create --dbname=uhealthformula --dbuser=wp_admin --dbpass=wpAdmin@2018 --dbhost=172.20.33.146 --allow-root
sudo wp core install --url=uhealthformula.com --title=uhealthformula --admin_user=wp_admin --admin_password=wpAdmin@2018 --admin_email=feisun@westwin.com --allow-root