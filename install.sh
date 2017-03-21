#!/usr/bin/env bash

TARGET_DIRECTORY=/opt/wifirst-connect
SERVICE_NAME=wifirst-connect.service

# Create directory if not exists already
mkdir -p $TARGET_DIRECTORY

# Copy everything
cp -r * $TARGET_DIRECTORY

# Copy service file in services directory (systemd only)
cp $SERVICE_NAME /etc/systemd/system/$SERVICE_NAME

# Npm install (dependencies)
npm --prefix $TARGET_DIRECTORY install $TARGET_DIRECTORY

echo "Now, execute this command to start the service (for this session only) : "
echo "[sudo] systemctl start wifirst-connect.service"

echo

echo "To enable it (it will start even after a reboot), execute this : "
echo "[sudo] systemctl enable wifirst-connect.service"