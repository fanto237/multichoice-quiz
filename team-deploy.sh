#!/bin/bash
echo ""
rm -rf /home/iot-2021-teamf/group/$USER-tmp
mkdir /home/iot-2021-teamf/group/$USER-tmp

#web
echo -e "\e[32mWeb:\e[0m"
cp -r web/* /home/iot-2021-teamf/group/$USER-tmp/.
sudo -i -u iot-2021-teamf scp -r /home/iot-2021-teamf/group/$USER-tmp/* mydocker:/var/www/html/docker-iot-2021-teamf-web/.
rm -rf /home/iot-2021-teamf/group/$USER-tmp/*

#home
echo -e "\e[32mHome:\e[0m"
cp -r home/* /home/iot-2021-teamf/group/$USER-tmp/.
sudo -i -u iot-2021-teamf scp -r /home/iot-2021-teamf/group/$USER-tmp/* mydocker:/home/docker-iot-2021-teamf/.
rm -rf /home/iot-2021-teamf/group/$USER-tmp/*

echo "https://informatik.hs-bremerhaven.de/docker-iot-2021-teamf-web/"
