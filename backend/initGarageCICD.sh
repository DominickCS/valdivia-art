#!/bin/bash
set -e

docker compose -f compose.yml up -d

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

# If keys are already injected from GitHub secrets, skip creation entirely
if [[ -n "$GARAGE_ACCESS_KEY" && -n "$GARAGE_SECRET_KEY" ]]; then
  echo "Garage keys already present in environment, skipping key creation."
  docker exec valdivia-art-garage-1 /garage bucket allow \
    --read --write --owner artwork \
    --key valdivia-art-key || true
  docker exec valdivia-art-garage-1 /garage bucket website --allow artwork || true

  # Still export so downstream steps see them
  echo "GARAGE_ACCESS_KEY=$GARAGE_ACCESS_KEY" >>$GITHUB_ENV
  echo "GARAGE_SECRET_KEY=$GARAGE_SECRET_KEY" >>$GITHUB_ENV
  exit 0
fi

# First-time deploy: generate keys
echo "No Garage keys found — generating new key..."
KEY_OUTPUT=$(docker exec valdivia-art-garage-1 /garage key create valdivia-art-key 2>&1)

ACCESS_KEY=$(echo "$KEY_OUTPUT" | grep -i "key id" | awk '{print $NF}' | tr -d '\r\n ')
SECRET_KEY=$(echo "$KEY_OUTPUT" | grep -i "secret" | awk '{print $NF}' | tr -d '\r\n ')

[[ -z "$ACCESS_KEY" ]] && {
  echo "ERROR: Could not parse ACCESS_KEY" >&2
  echo "$KEY_OUTPUT" >&2
  exit 1
}
[[ -z "$SECRET_KEY" ]] && {
  echo "ERROR: Could not parse SECRET_KEY" >&2
  echo "$KEY_OUTPUT" >&2
  exit 1
}

docker exec valdivia-art-garage-1 /garage bucket allow \
  --read --write --owner artwork \
  --key valdivia-art-key || true
docker exec valdivia-art-garage-1 /garage bucket website --allow artwork || true

echo "GARAGE_ACCESS_KEY=$ACCESS_KEY" >>$GITHUB_ENV
echo "GARAGE_SECRET_KEY=$SECRET_KEY" >>$GITHUB_ENV

echo ""
echo "========================================="
echo "  FIRST-TIME DEPLOY: Save these keys to GitHub secrets NOW"
echo "  GARAGE_ACCESS_KEY=$ACCESS_KEY"
echo "  GARAGE_SECRET_KEY=$SECRET_KEY"
echo "========================================="
