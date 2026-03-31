#!/bin/bash
set -e

NODE_ID=$(docker exec valdivia-art-garage-1 /garage status | awk '/HEALTHY/ {getline; getline; print $1}')
[[ -z "$NODE_ID" ]] && {
  echo "ERROR: Could not parse NODE_ID" >&2
  exit 1
}

docker exec valdivia-art-garage-1 /garage layout assign -z main -c 10G $NODE_ID
docker exec valdivia-art-garage-1 /garage layout apply --version 1
docker exec valdivia-art-garage-1 /garage bucket create artwork

SECRET_KEY=$(docker exec valdivia-art-garage-1 /garage key create valdivia-art-key | grep "Secret" | awk '{print $3}')
[[ -z "$SECRET_KEY" ]] && {
  echo "ERROR: Could not parse SECRET_KEY" >&2
  exit 1
}

ACCESS_KEY=$(docker exec valdivia-art-garage-1 /garage bucket allow \
  --read --write --owner artwork \
  --key valdivia-art-key | grep "RWO" | awk '{print $2}')
[[ -z "$ACCESS_KEY" ]] && {
  echo "ERROR: Could not parse ACCESS_KEY" >&2
  exit 1
}

docker exec valdivia-art-garage-1 /garage bucket website --allow artwork

echo "GARAGE_SECRET_KEY=$SECRET_KEY" >>$GITHUB_ENV
echo "GARAGE_ACCESS_KEY=$ACCESS_KEY" >>$GITHUB_ENV
