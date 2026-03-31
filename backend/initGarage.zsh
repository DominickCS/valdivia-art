#!/bin/zsh

# Get Node ID
NODE_ID=$(docker exec -it valdivia-art-garage-1 /garage status | awk '/HEALTHY/ {getline; getline; print $1}')

# Node creation and space allocation of 10GB
docker exec -it valdivia-art-garage-1 /garage layout assign -z main -c 10G $NODE_ID

# Apply changes to persist
docker exec -it valdivia-art-garage-1 /garage layout apply --version 1

# Create the artwork bucket
docker exec -it valdivia-art-garage-1 /garage bucket create artwork

# Create an access key -> Make sure to copy the key secret into .env vars
SECRET_KEY=$(docker exec -it valdivia-art-garage-1 /garage key create valdivia-art-key | grep "Secret" | awk '{print $3}')

# Allow access to artwork bucket via provisioned access key -> Make sure to copy the access key into .env vars
ACCESS_KEY=$(docker exec -it valdivia-art-garage-1 /garage bucket allow \
  --read \
  --write \
  --owner \
  artwork \
  --key valdivia-art-key | grep "RWO" | awk '{print $2}')

# Allow public read URL
docker exec -it valdivia-art-garage-1 /garage bucket website --allow artwork

echo "GARAGE_SECRET_KEY=$SECRET_KEY" >> ../.env
echo "GARAGE_ACCESS_KEY=$ACCESS_KEY" >> ../.env
