#!/bin/bash

scp -r web/* mydocker:/var/www/html/docker-$USER-web/iot
echo -e "\n \e[32m web/* --> /var/www/html/docker-$USER-web/iot kopiert \e[0m \n"

scp -r home/* mydocker:~/iot/
echo -e "\n \e[32m home/* --> /home/docker-$USER/iot/ kopiert \e[0m \n"

echo "https://informatik.hs-bremerhaven.de/docker-$USER-web/iot/"
