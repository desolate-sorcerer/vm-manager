#!/bin/bash
# build.sh - COMPLETE package builder

set -e

echo "=== Building VM Manager Debian Package ==="

# 1. Clean up
rm -rf vm-manager-package vm-manager.deb 2>/dev/null || true

# 2. Create directory structure
mkdir -p vm-manager-package/DEBIAN
mkdir -p vm-manager-package/opt/vm-manager/{api,web}
mkdir -p vm-manager-package/lib/systemd/system
mkdir -p vm-manager-package/var/lib/vm-manager

# 3. Copy your source files
echo "Copying files..."
cp -r api/* vm-manager-package/opt/vm-manager/api/ 2>/dev/null || true

# 4. Build React app
echo "Building React app..."
cd web
npm ci --silent
npm run build --silent
cd ..
cp -r web/dist vm-manager-package/opt/vm-manager/web/

# 5. Create ALL package files HERE in build.sh:

# 5a. Create control file
cat > vm-manager-package/DEBIAN/control << 'EOF'
Package: vm-manager
Version: 1.0.0
Section: admin
Priority: optional
Architecture: all
Depends: python3, python3-pip, libvirt-daemon-system, qemu-kvm, bridge-utils
Maintainer: Your Name <you@example.com>
Description: Web-based Virtual Machine Manager
 A complete VM management system with Flask API and React web interface.
Installed-Size: 50
EOF

# 5b. Create postinst (installation script)
cat > vm-manager-package/DEBIAN/postinst << 'EOF'
#!/bin/bash
set -e

echo "Setting up VM Manager..."

# Setup Python
cd /opt/vm-manager/api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Initialize database
python3 -c "
import sys
sys.path.insert(0, '/opt/vm-manager/api')
from app.database.database import DatabaseServices
DatabaseServices.create_tables()
DatabaseServices.addDefaultNetwork()
"

# Enable service
systemctl daemon-reload
systemctl enable vm-manager.service

echo "✓ VM Manager installed!"
echo "Run: sudo systemctl start vm-manager"
echo "Access: http://localhost:5000"
EOF
chmod 755 vm-manager-package/DEBIAN/postinst

# 5c. Create systemd service
cat > vm-manager-package/lib/systemd/system/vm-manager.service << 'EOF'
[Unit]
Description=VM Manager
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/vm-manager/api
ExecStart=/opt/vm-manager/api/venv/bin/python main.py
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# 6. Build the .deb package
echo "Creating .deb package..."
dpkg-deb --build vm-manager-package vm-manager.deb

echo ""
echo "=== SUCCESS ==="
echo "Package: vm-manager.deb"
echo ""
echo "To install:"
echo "  sudo dpkg -i vm-manager.deb"
echo "  sudo apt install -f"
