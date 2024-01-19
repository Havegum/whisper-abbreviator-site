#!/bin/sh
source .env

TARGET=whisper-abbreviator

echo "rsync -a --progress -e ssh dist/ $USERNAME@$HOSTNAME:${BASE_PATH}${TARGET}"
rsync -a --progress -e ssh dist/ $USERNAME@$HOSTNAME:${BASE_PATH}${TARGET}