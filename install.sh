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

check_os() {
  if ! command -v pacman &>/dev/null; then
    log_error "arch linux not installed"
    exit 1
  else
    return
  fi
}

check_packages() {
  local packages=("python" "npm" "libvirt")
  local missing_packages=()

  for package in "${packages[@]}"; do
    if pacman -Q "$package" &>/dev/null; then
      log_info "$package is installed"
    else
      log_error "$package is not installed"
      missing_packages+=("$package")
    fi
  done

  if [ ${#missing_packages[@]} -gt 0 ]; then
    echo
    log_error "Missing required packages: ${missing_packages[*]}"
    log_info "Install them with: sudo pacman -S ${missing_packages[*]}"
    exit 1
  fi
}

installing_web_dependencies() {
  log_info "installing node.js dependcies"
  cd ./web
  if [ -f "package.json" ]; then
    npm install
    cd ..
  else
    log_error "package.json not found"
    exit 1
  fi
}

create_env() {
  cd ./api
  if [ -d "env" ]; then
    return
  else
    python -m venv env
  fi
}

installing_api_dependencies() {
  log_info "installing python dependcies"
  if [ -d "env" ]; then
    source env/bin/activate
    pip install e .
    deactivate
  else
    log_error "env/bin/active not found"
    exit 1
  fi
}

show_finish() {
  echo
  log_info "project succesfuly installed"
}

main() {
  check_os
  check_packages
  log_info "starting vm-manager installation"
  installing_web_dependencies
  create_env
  installing_api_dependencies
  show_finish
}

main
