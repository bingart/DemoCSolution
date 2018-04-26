from selenium import webdriver
import time

service_args = ['--proxy=127.0.0.1:9350', '--proxy-type=socks5']
service_args += ['--load-images=no'] 

driver = webdriver.PhantomJS('/usr/bin/phantomjs', service_args=service_args)
driver.get('http://www.infosoap.com')
 
html = driver.page_source
print(html)

for i in range(10):
    time.sleep(1)
    print('sleep')

driver.close()
