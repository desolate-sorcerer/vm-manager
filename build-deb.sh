#!/bin/bash
# build-deb.sh

set -e  # Exit on error

# Configuration
VERSION="1.0.0"
PACKAGE_NAME="vm-manager"
PACKAGE_DIR="${PACKAGE_NAME}-package"
DEB_FILE="${PACKAGE_NAME}_${VERSION}_all.deb"

echo "=== Building VM Manager Debian Package ==="

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf $PACKAGE_DIR $DEB_FILE
mkdir -p $PACKAGE_DIR

# Create package structure
echo "Creating package structure..."
mkdir -p $PACKAGE_DIR/DEBIAN
mkdir -p $PACKAGE_DIR/opt/vm-manager/{api,web}    # Changed from backend/frontend
mkdir -p $PACKAGE_DIR/lib/systemd/system
mkdir -p $PACKAGE_DIR/var/lib/vm-manager
mkdir -p $PACKAGE_DIR/usr/share/doc/vm-manager

# ===== 1. BUILD WEB (React/Vite) =====
echo "Building React web interface..."
cd web

# Clean and build
rm -rf node_modules dist
npm ci --silent
npm run build

if [ ! -d "dist" ]; then
    echo "ERROR: Web build failed - dist folder not created!"
    exit 1
fi

# Copy web files (ONLY dist and package files)
echo "Copying web files..."
cd ..
cp -r web/dist $PACKAGE_DIR/opt/vm-manager/web/
cp web/package.json $PACKAGE_DIR/opt/vm-manager/web/
cp web/package-lock.json $PACKAGE_DIR/opt/vm-manager/web/

# ===== 2. COPY API (Flask) =====
echo "Copying API files..."
rsync -av \
  --exclude='__pycache__' \
  --exclude='*.pyc' \
  --exclude='*.db' \
  --exclude='.env*' \
  --exclude='.git' \
  --exclude='test*.py' \
  api/ $PACKAGE_DIR/opt/vm-manager/api/

# ===== 3. PACKAGE METADATA =====
echo "Adding package metadata..."

# Control file
cat > $PACKAGE_DIR/DEBIAN/control << EOF
Package: $PACKAGE_NAME
Version: $VERSION
Section: admin
Priority: optional
Architecture: all
Depends: python3 (>= 3.8), python3-pip, python3-venv, libvirt-daemon-system, qemu-kvm, bridge-utils, libvirt-clients, nodejs (>= 16), npm
Maintainer: VM Manager <team@example.com>
Description: Web-based Virtual Machine Management System
 Full-stack web interface for managing KVM/QEMU virtual machines.
 Provides API (Flask) and web interface (React).
Installed-Size: 0  # Will be calculated
EOF

# Post-installation script (UPDATED PATHS)
cat > $PACKAGE_DIR/DEBIAN/postinst << 'EOF'
#!/bin/bash
set -e

echo "Installing VM Manager..."

# Install web dependencies
echo "Installing web dependencies..."
cd /opt/vm-manager/web
npm ci --only=production

# Install API dependencies
echo "Installing API dependencies..."
cd /opt/vm-manager/api
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install libvirt-python

# Initialize database
echo "Initializing database..."
python3 -c "
import sys
sys.path.insert(0, '/opt/vm-manager/api')
from app.database.database import DatabaseServices
DatabaseServices.create_tables()
DatabaseServices.addDefaultNetwork()
print('Database initialized')
"

# Set permissions
chown -R :libvirt /opt/vm-manager
chmod 775 /opt/vm-manager/api
chmod 664 /var/lib/vm-manager/vm_manager.db 2>/dev/null || true

# Enable service
systemctl daemon-reload
systemctl enable vm-manager.service

echo "VM Manager installed successfully!"
echo "Start: systemctl start vm-manager"
echo "Access: http://localhost:5000"
EOF
chmod 755 $PACKAGE_DIR/DEBIAN/postinst

# Pre-removal script
cat > $PACKAGE_DIR/DEBIAN/prerm << 'EOF'
#!/bin/bash
set -e
systemctl stop vm-manager.service 2>/dev/null || true
systemctl disable vm-manager.service 2>/dev/null || true
EOF
chmod 755 $PACKAGE_DIR/DEBIAN/prerm

# Systemd service (UPDATED PATHS)
cat > $PACKAGE_DIR/lib/systemd/system/vm-manager.service << 'EOF'
[Unit]
Description=VM Manager Web Interface
After=network.target libvirtd.service
Wants=libvirtd.service

[Service]
Type=simple
User=root
Group=libvirt
WorkingDirectory=/opt/vm-manager/api
Environment="PATH=/opt/vm-manager/api/venv/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
Environment="PYTHONPATH=/opt/vm-manager/api"
ExecStart=/opt/vm-manager/api/venv/bin/python /opt/vm-manager/api/main.py
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF

# Documentation
cat > $PACKAGE_DIR/usr/share/doc/vm-manager/README.Debian << 'EOF'
VM Manager - Virtual Machine Management System
==============================================

This package installs:
- API: Flask backend in /opt/vm-manager/api
- Web: React frontend in /opt/vm-manager/web

Quick Start:
1. Start: sudo systemctl start vm-manager
2. Access: http://localhost:5000
3. Check logs: sudo journalctl -u vm-manager -f

Files:
- Database: /var/lib/vm-manager/vm_manager.db
- Config: Edit /opt/vm-manager/api/config.py if needed
EOF

# ===== 4. FIX MAIN.PY FOR PRODUCTION =====
# Update Flask app to serve React from /opt/vm-manager/web/dist
cat > $PACKAGE_DIR/opt/vm-manager/api/production.py << 'EOF'
import os

class ProductionConfig:
    # Database
    SQLALCHEMY_DATABASE_URI = 'sqlite:////var/lib/vm-manager/vm_manager.db'
    
    # Paths
    WEB_BUILD_PATH = '/opt/vm-manager/web/dist'
    
    # Security
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'change-in-production'
    
    # CORS
    CORS_ORIGINS = ["http://localhost:5000"]
EOF

# Update main.py to use production config
if [ -f "$PACKAGE_DIR/opt/vm-manager/api/main.py" ]; then
    # Add at the top of main.py
    sed -i '1iimport os\nfrom production import ProductionConfig' \
        $PACKAGE_DIR/opt/vm-manager/api/main.py
        
    # Find app creation and add config
    sed -i "/app = Flask/ a app.config.from_object(ProductionConfig)" \
        $PACKAGE_DIR/opt/vm-manager/api/main.py
        
    # Add route to serve React (if not exists)
    if ! grep -q "@app.route('/'," "$PACKAGE_DIR/opt/vm-manager/api/main.py"; then
        cat >> $PACKAGE_DIR/opt/vm-manager/api/main.py << 'EOF'

# Serve React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.config['WEB_BUILD_PATH'], path)):
        return send_from_directory(app.config['WEB_BUILD_PATH'], path)
    return send_from_directory(app.config['WEB_BUILD_PATH'], 'index.html')
EOF
    fi
fi

# ===== 5. CALCULATE SIZE & BUILD =====
echo "Calculating package size..."
INSTALLED_SIZE=$(du -sk $PACKAGE_DIR/opt $PACKAGE_DIR/lib $PACKAGE_DIR/usr $PACKAGE_DIR/var 2>/dev/null | awk '{sum+=$1} END {print int(sum)}')
sed -i "s/^Installed-Size:.*/Installed-Size: $INSTALLED_SIZE/" $PACKAGE_DIR/DEBIAN/control

echo "Setting permissions..."
find $PACKAGE_DIR -type f -exec chmod 644 {} \;
find $PACKAGE_DIR -type d -exec chmod 755 {} \;
chmod 755 $PACKAGE_DIR/DEBIAN/*

echo "Building Debian package..."
dpkg-deb --build $PACKAGE_DIR $DEB_FILE

# ===== 6. VERIFY =====
echo ""
echo "=== Package Created ==="
echo "File: $DEB_FILE"
echo "Size: $(du -h $DEB_FILE | cut -f1)"
echo ""
echo "Contents:"
dpkg -c $DEB_FILE | head -20
echo "..."
echo ""
echo "To install:"
echo "  sudo dpkg -i $DEB_FILE"
echo "  sudo apt install -f  # Fix dependencies"
echo ""
echo "To test:"
echo "  sudo systemctl start vm-manager"
echo "  curl http://localhost:5000"
