#! /bin/sh
docker image rm barais/grade-scope-istic-front
docker build -f src/main/docker/Dockerfile -t barais/grade-scope-istic-front .
