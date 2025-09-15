#!/bin/bash

check_port() {
  if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null; then
    echo "port $1 is in use"
    exit 1
  fi
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

cleanup() {
  echo "stoping services"
  kill $(lsof -t -i:5000)
  exit 0
}

trap cleanup INT TERM EXIT

main() {
  echo "starting vm-manager"

  check_port 3000
  check_port 5000
  check_port 5173

  if ! command_exists python3; then
    echo "python3 is not installed"
    exit 1
  fi

  if ! command_exists node; then
    echo "node is not installed"
    exit 1
  fi

  echo "starting python"
  cd python/
  if [ ! -d "venv" ]; then
    python3 -m venv venv
  fi

  source venv/bin/activate
  pip install -r requirements.txt
  flask --app api.py run >/dev/null 2>&1 &

  deactivate
  cd ..

  echo "starting node js"
  cd api/
  if [ ! -d "node_modules" ]; then
    echo "installing node js dependencies..."
    npm install
  fi
  npm start >/dev/null 2>&1 &
  cd ..

  echo "starting react"
  cd web/
  if [ ! -d "node_modules" ]; then
    echo "installing react dependencies"
    npm install
  fi
  npm run dev >/dev/null 2>&1 &
  cd ..

  echo "all services are running"

  wait
}

main
