.PHONY: all clean build install test

all: build

build:
	@echo "Building VM Manager..."
	@./build-deb.sh

clean:
	@echo "Cleaning..."
	@rm -rf vm-manager-package vm-manager_*.deb
	@rm -rf web/node_modules web/dist
	@rm -rf api/__pycache__

install: build
	@echo "Installing..."
	@sudo dpkg -i vm-manager_*.deb || true
	@sudo apt install -f -y

test:
	@echo "Testing..."
	@sudo systemctl status vm-manager --no-pager || true
	@curl -s http://localhost:5000 >/dev/null && echo "Web interface is running" || echo "Web interface not responding"

.PHONY: web api
web:
	@cd web && npm run dev

api:
	@cd api && python main.py
