#!/bin/bash

# MedSynth Restore Script
# Usage: ./restore.sh <backup_archive_dir>

BACKUP_DIR=$1

if [ -z "$BACKUP_DIR" ]; then
    echo "Error: No backup directory specified."
    echo "Usage: ./restore.sh <backup_archive_dir>"
    exit 1
fi

if [ ! -d "$BACKUP_DIR" ]; then
    echo "Error: Backup directory $BACKUP_DIR not found."
    exit 1
fi

echo "Starting MedSynth production restore from $BACKUP_DIR..."

# Restore Uploads
if [ -f "$BACKUP_DIR/uploads.tar.gz" ]; then
    echo "Restoring clinical uploads..."
    tar -xzf "$BACKUP_DIR/uploads.tar.gz" -C ./backend
fi

# Restore Generated Data
if [ -f "$BACKUP_DIR/generated.tar.gz" ]; then
    echo "Restoring synthetic cohorts..."
    tar -xzf "$BACKUP_DIR/generated.tar.gz" -C ./backend
fi

echo "Restore operation completed."
