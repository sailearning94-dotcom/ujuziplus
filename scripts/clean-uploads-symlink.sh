#!/bin/sh
# Guards against a corrupted public/uploads symlink chain (ELOOP) left over
# from an earlier deploy. If public/uploads is a symlink, remove it and
# replace with a plain directory so Next.js's directory walk can't recurse
# into itself. Safe to run on every boot.

UPLOADS_PATH="public/uploads"

if [ -L "$UPLOADS_PATH" ]; then
  echo "Found symlink at $UPLOADS_PATH, removing to prevent ELOOP..."
  rm -f "$UPLOADS_PATH"
fi

mkdir -p "$UPLOADS_PATH"
echo "public/uploads ready."
