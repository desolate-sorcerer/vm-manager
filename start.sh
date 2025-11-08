#!/bin/bash

#start db
docker run -d \
  --name vm-db \
  -e POSTGRES_DB=vm-db \
  -e POSTGRES_USER=nik \
  -e POSTGRES_PASSWORD=pass123 \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql \
  postgres:latest
