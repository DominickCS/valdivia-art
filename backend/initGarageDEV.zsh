#!/bin/zsh

# Get Node ID (no -t to avoid carriage returns)
NODE_ID=$(docker exec -i valdivia-art-garage-1 /garage status | awk '/HEALTHY/ {getline; getline; print $1}' | tr -d '\r\n ')

# Node creation and space allocation of 10GB
docker exec -i valdivia-art-garage-1 /garage layout assign -z main -c 10G $NODE_ID

# Apply changes to persist (ignore version conflict on re-runs)
docker exec -i valdivia-art-garage-1 /garage layout apply --version 1 || true

# Create artwork bucket (ignore if already exists)
docker exec -i valdivia-art-garage-1 /garage bucket create artwork || true

# Create access key, fall back to fetching existing if already created
KEY_OUTPUT=$(docker exec -i valdivia-art-garage-1 /garage key create valdivia-art-key 2>&1)
if echo "$KEY_OUTPUT" | grep -q "matching keys\|already exists"; then
  echo "Key already exists, fetching info..."
  KEY_OUTPUT=$(docker exec -i valdivia-art-garage-1 /garage key info valdivia-art-key)
fi

SECRET_KEY=$(echo "$KEY_OUTPUT" | grep -i "secret" | awk '{print $NF}' | tr -d '\r\n ')
ACCESS_KEY=$(echo "$KEY_OUTPUT" | grep -i "key id\|Key ID" | awk '{print $NF}' | tr -d '\r\n ')

# Allow access to artwork bucket via provisioned key
docker exec -i valdivia-art-garage-1 /garage bucket allow \
  --read --write --owner artwork --key valdivia-art-key || true

# Allow public read
docker exec -i valdivia-art-garage-1 /garage bucket website --allow artwork || true

echo "GARAGE_SECRET_KEY=$SECRET_KEY" >> ../.env
echo "GARAGE_ACCESS_KEY=$ACCESS_KEY" >> ../.env
