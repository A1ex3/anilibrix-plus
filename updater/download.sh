#!/bin/bash

if [ -z "$1" ]; then
  echo "Error: No version specified."
  echo "Usage: $0 <VERSION>"
  exit 1
fi

VERSION=$1
URL="https://github.com/A1ex3/anilibrix-plus-updater/releases/download/$VERSION/updater.tar.gz"
TARGET_DIR="updater"
TARGET_FILE="$TARGET_DIR/updater.tar.gz"

mkdir -p $TARGET_DIR

curl -L $URL -o $TARGET_FILE

if [ $? -ne 0 ]; then
  echo "Error: Failed to download the file."
  exit 1
else
  echo "File successfully downloaded to $TARGET_FILE"
fi