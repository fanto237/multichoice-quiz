#!/bin/bash
source /etc/bash.bashrc.hbv

redis-cli subscribe spielerliste &

while read line; do 
	redis-cli publish spielerliste "$line"  

done