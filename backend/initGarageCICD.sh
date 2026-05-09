#!/bin/bash
set -e

# Start the full stack
docker compose -f compose.yml up -d

# Wait for Garage to be ready
echo "Waiting for Garage to be ready..."
sleep 5

NODE_ID=$(docker exec valdivia-art-garage-1 /garage status | awk '/HEALTHY/ {getline; getline; print $1}' | tr -d '\r\n ')
[[ -z "$NODE_ID" ]] && {
  echo "ERROR: Could not parse NODE_ID" >&2
  exit 1
}

docker exec valdivia-art-garage-1 /garage layout assign -z main -c 10G $NODE_ID
docker exec valdivia-art-garage-1 /garage layout apply --version 1 || true
docker exec valdivia-art-garage-1 /garage bucket create artwork || true

# Create access key, fall back to fetching existing if already created
KEY_OUTPUT=$(docker exec valdivia-art-garage-1 /garage key create valdivia-art-key 2>&1)
if echo "$KEY_OUTPUT" | grep -q "matching keys\|already exists"; then
  echo "Key already exists, fetching info..."
  KEY_OUTPUT=$(docker exec valdivia-art-garage-1 /garage key info valdivia-art-key)
fi

SECRET_KEY=$(echo "$KEY_OUTPUT" | grep -i "secret" | awk '{print $NF}' | tr -d '\r\n ')
ACCESS_KEY=$(echo "$KEY_OUTPUT" | grep -i "key id\|Key ID" | awk '{print $NF}' | tr -d '\r\n ')

[[ -z "$SECRET_KEY" ]] && {
  echo "ERROR: Could not parse SECRET_KEY" >&2
  exit 1
}
[[ -z "$ACCESS_KEY" ]] && {
  echo "ERROR: Could not parse ACCESS_KEY" >&2
  exit 1
}

docker exec valdivia-art-garage-1 /garage bucket allow \
  --read --write --owner artwork \
  --key valdivia-art-key || true

docker exec valdivia-art-garage-1 /garage bucket website --allow artwork || true

echo "GARAGE_SECRET_KEY=$SECRET_KEY" >>$GITHUB_ENV
echo "GARAGE_ACCESS_KEY=$ACCESS_KEY" >>$GITHUB_ENV
