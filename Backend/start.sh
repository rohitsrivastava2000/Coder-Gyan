#!/bin/bash

echo "Installing dependencies..."
npm install

echo "Building Docker images..."
docker build -f Dockerfiles/Dockerfile.cpp -t code-runner-cpp .
docker build -f Dockerfiles/Dockerfile.java -t code-runner-java .
docker build -f Dockerfiles/Dockerfile.python -t code-runner-python .
docker build -f Dockerfiles/Dockerfile.js -t code-runner-javascript .

echo "Starting server..."
node server.js
