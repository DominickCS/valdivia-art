#!/bin/zsh

# Node creation and space allocation of 10GB
docker exec -it valdivia-art-garage-1 /garage layout assign -z main -c 10G e126c5fa301dad75

# Apply changes to persist
docker exec -it valdivia-art-garage-1 /garage layout apply --version 1

# Create the artwork bucket
docker exec -it valdivia-art-garage-1 /garage bucket create artwork

# Create an access key -> Make sure to copy the key secret into .env vars
docker exec -it valdivia-art-garage-1 /garage key create valdivia-art-key

# Allow access to artwork bucket via provisioned access key -> Make sure to copy the access key into .env vars
docker exec -it valdivia-art-garage-1 /garage bucket allow \             
  --public-website \
  --read \
  --write \
  --owner \
  artwork \         
  --key valdivia-art-key

# Allow public read URL
docker exec -it valdivia-art-garage-1 /garage bucket website --allow artwork
