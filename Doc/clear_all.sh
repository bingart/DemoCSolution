#!/bin/bash
# clear backup files before 7 days
get_date()
{
	#D=$(date -d "$1" +%d)
	D=$(date +%Y%m%d -d "$1 day ago")
	echo $D
}

####################################################

arr=()
for i in {1..7}
do
	d=$(get_date $i)
	#echo $d
	filePath="/data/backup/wp-app.$d.tar.gz"
	arr+=("$filePath")
	filePath="/data/backup/wp-app-c06.$d.tar.gz"
	arr+=("$filePath")
	filePath="/data/backup/letsencrypt.$d.tar.gz"
	arr+=("$filePath")
done
for i in "${arr[@]}"
do
    echo "target ==> $i"
done

####################################################

cur=()
search_dir=/data/backup
for entry in "$search_dir"/*.tar.gz
do
	if [ -f "$entry" ];then
		cur+=("$entry")
	fi
done
for i in "${cur[@]}"
do
	echo "cur ==> $i"
	if [[ ! -z $(printf '%s\n' "${arr[@]}" | grep -w $i) ]]; then
		echo "cur exists in target";
	else
		echo "cur NOT exists in target";
		rm -f $i
	fi
done

