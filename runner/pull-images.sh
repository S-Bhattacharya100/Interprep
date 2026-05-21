#!/bin/bash

# Pull all required Docker images for Interprep runner service
# Run this script once to download all language runtimes

echo "Pulling Docker images for Interprep code execution service..."
echo ""

images=(
    "node:18-alpine"
    "python:3.11-alpine"
    "openjdk:11-jdk-alpine"
    "gcc:11-alpine"
)

for image in "${images[@]}"; do
    echo "Pulling $image..."
    docker pull "$image"
    if [ $? -eq 0 ]; then
        echo "✓ Successfully pulled $image"
    else
        echo "✗ Failed to pull $image"
        exit 1
    fi
    echo ""
done

echo "All Docker images pulled successfully!"
echo ""
echo "Pulled images:"
docker images --filter "reference=node:18-alpine" --filter "reference=python:3.11-alpine" --filter "reference=openjdk:11-jdk-alpine" --filter "reference=gcc:11-alpine" --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
