#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

cleanup() {
  echo "Cleaning up..."
  kill $(jobs -p) 2>/dev/null
  echo "Done"
}

trap cleanup EXIT

run_web() {
  cd ./web
  if [ -d "node_modules" ]; then
    npm run dev >/dev/null 2>&1 &
    log_info "web started"
    cd ..
  else
    log_error "Missing node.js dependecies"
    exit 1
  fi
}

run_api() {
  cd ./api
  if [ -d "env" ]; then
    source env/bin/activate
    python __main__.py >/dev/null 2>&1 &
    log_info "api started"
  else
    log_error "missing env/"
    exit 1
  fi
}

show_finish() {
  echo
  log_info "app started succesfuly"
  log_info "web server: http://localhost:5173/"
  log_info "api server http://localhost:5000/"
}

main() {
  run_web
  run_api
  show_finish

  wait
}

main
