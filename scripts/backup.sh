#!/bin/bash

# MedSynth Backup Script
# Usage: ./backup.sh [backup_dir]

BACKUP_PARENT=${1:-"./backups"}
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="$BACKUP_PARENT/backup_$TIMESTAMP"

echo "Starting MedSynth production backup..."
mkdir -p "$BACKUP_DIR"

# Backup Uploads
if [ -d "./backend/uploads" ]; then
    echo "Archiving uploaded clinical datasets..."
    tar -czf "$BACKUP_DIR/uploads.tar.gz" -C ./backend uploads
fi

# Backup Generated Data
if [ -d "./backend/generated" ]; then
    echo "Archiving generated synthetic cohorts..."
    tar -czf "$BACKUP_DIR/generated.tar.gz" -C ./backend generated
fi

# Summary
echo "Backup completed successfully at $BACKUP_DIR"
ls -lh "$BACKUP_DIR"
