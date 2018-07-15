#!/bin/bash


name=`echo $1 | cut -d ":" -f 1`
echo $name
title=$2

mkdir -p packDir

echo "
---
Name: \"$name\"
AppId: \"routeTracker\"
Vendor: \"Cisco\"
Version: \"0.1\"
Tag: \"$1\"
Description: \"routeTracker\"

Category: Application

Resource:
  CPU: 256M
  MEMORY: 512M


GUI:
  Integrated:
    Port: 80
    Protocol: http
  " > packDir/spec.yml

cp icon.png packDir/

echo "Creating Docker Image"
docker build -t $1 .
docker save $1 -o image.tar
chown $USER:$USER image.tar
docker rmi $1

echo "Pack DIR has been built, Now creating Docker Image"
mv image.tar packDir/
tar -czvf $name.tar.gz packDir/

echo "Image $name has been built"
