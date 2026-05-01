#!/bin/bash
set -e

# Stop the running container (if any)
echo "Stopping the running container..."
docker stop simple-python-flask-app || true
