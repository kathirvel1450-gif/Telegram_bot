#!/bin/bash
# Install backend dependencies
pip install -r backend/requirements.txt

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Move frontend build to backend static folder
rm -rf backend/static
mkdir -p backend/static
cp -r frontend/dist/* backend/static/
