#!/bin/bash
# Setup symlink for Railway volume to make uploaded files accessible via Next.js public folder
# This script should be run during the build process or in a Railway startup script

if [ -n "$RAILWAY_VOLUME_MOUNT_PATH" ]; then
  echo "Setting up upload symlink for Railway volume..."
  
  # Check if the volume path exists
  if [ -d "$RAILWAY_VOLUME_MOUNT_PATH" ]; then
    # Remove existing symlink or directory if it exists
    if [ -L "public/uploads" ]; then
      echo "Removing existing symlink..."
      rm public/uploads
    elif [ -d "public/uploads" ]; then
      # If it's a directory with content, move it to the volume first
      if [ "$(ls -A public/uploads)" ]; then
        echo "Moving existing uploads to volume..."
        cp -r public/uploads/* "$RAILWAY_VOLUME_MOUNT_PATH/"
      fi
      echo "Removing existing directory..."
      rm -rf public/uploads
    fi
    
    # Create symlink from public/uploads to the volume
    echo "Creating symlink: public/uploads -> $RAILWAY_VOLUME_MOUNT_PATH"
    ln -s "$RAILWAY_VOLUME_MOUNT_PATH" public/uploads
    echo "✅ Symlink created successfully"
  else
    echo "Warning: Railway volume path $RAILWAY_VOLUME_MOUNT_PATH does not exist"
    echo "Falling back to local public/uploads directory"
    mkdir -p public/uploads
  fi
else
  echo "RAILWAY_VOLUME_MOUNT_PATH not set, using local public/uploads directory"
  mkdir -p public/uploads
fi
