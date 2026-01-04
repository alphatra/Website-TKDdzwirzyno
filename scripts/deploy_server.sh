#!/bin/bash
set -e

# Configuration
APP_DIR="/var/www/tkd-dzwirzyno"
RELEASES_DIR="${APP_DIR}/releases"
CURRENT_LINK="${APP_DIR}/current"
RELEASE_NAME=$(date +%Y%m%d%H%M%S)
NEW_RELEASE_DIR="${RELEASES_DIR}/${RELEASE_NAME}"

# Ensure directories exist
mkdir -p "$RELEASES_DIR"
mkdir -p "$NEW_RELEASE_DIR"

# extract the tarball passed via stdin to the new release directory
echo "Extracting release to ${NEW_RELEASE_DIR}..."
tar -xzf - -C "$NEW_RELEASE_DIR"

# Symlink persistent storage and configuration
echo "Linking persistent data..."
# Link PocketBase data directory
# Assumes /var/www/tkd-dzwirzyno/storage/pb_data exists
if [ -d "${APP_DIR}/storage/pb_data" ]; then
    mkdir -p "${NEW_RELEASE_DIR}/pocketbase"
    ln -sfn "${APP_DIR}/storage/pb_data" "${NEW_RELEASE_DIR}/pocketbase/pb_data"
fi

# Link .env file
# Assumes /var/www/tkd-dzwirzyno/.env exists
if [ -f "${APP_DIR}/.env" ]; then
    ln -sfn "${APP_DIR}/.env" "${NEW_RELEASE_DIR}/.env"
fi

# Link uploaded assets (if we want to persist them outside of release, 
# but usually static assets are part of the build. 
# PocketBase uploads are in pb_data, so they are covered above.)

# Atomic switch
echo "Switching to new release..."
ln -sfn "$NEW_RELEASE_DIR" "$CURRENT_LINK"

# Restart Service
# Restart or Install Service
echo "Updating service definition..."
# Debug Deno version on server
echo "Server Deno Version:"
/home/deploy/.deno/bin/deno --version || echo "Failed to get Deno version"

SERVICE_NAME="tkd-dzwirzyno"
SERVICE_FILE="${NEW_RELEASE_DIR}/config/systemd/${SERVICE_NAME}.service"

if [ -f "$SERVICE_FILE" ]; then
    echo "Service file found in release. Updating system configuration..."
    sudo cp "$SERVICE_FILE" /etc/systemd/system/
    sudo systemctl daemon-reload
    
    if ! sudo systemctl is-enabled --quiet $SERVICE_NAME; then
        sudo systemctl enable $SERVICE_NAME
    fi
    
    echo "Restarting service..."
    sudo systemctl restart $SERVICE_NAME
else
    echo "Error: Service config file not found in release. Cannot update/install."
    exit 1
fi

# Cleanup old releases (keep last 5)
echo "Cleaning up old releases..."
cd "$RELEASES_DIR"
ls -dt * | tail -n +6 | xargs -r rm -rf

echo "Deployment completed successfully!"
