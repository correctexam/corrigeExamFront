#! /bin/sh
sudo docker image rm barais/grade-scope-istic-front
sudo docker build -f src/main/docker/Dockerfile -t barais/grade-scope-istic-front .
