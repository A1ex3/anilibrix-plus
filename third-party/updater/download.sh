#!/bin/bash

if [ -z "$1" -o -z "$2" ]; then
  echo "Error: No version specified."
  echo "Usage: $0 <VERSION> $1 <OS_ARCH>"
  exit 1
fi

VERSION=$1
OS_ARCH=$2
URL="https://github.com/A1ex3/anilibrix-plus-updater/releases/download/$VERSION/$OS_ARCH.tar.gz"
TARGET_DIR="third-party/updater/downloads"
TARGET_FILE="$TARGET_DIR/$OS_ARCH.tar.gz"

mkdir -p $TARGET_DIR

curl -L $URL -o $TARGET_FILE

if [ $? -ne 0 ]; then
  echo "Error: Failed to download the file."
  exit 1
else
  echo "File successfully downloaded to $TARGET_FILE"
fi