#!/bin/bash

# This script initializes a Git repository for your project and pushes it to your GitHub account.
# Before running:
# 1. Make sure you have Git installed on your system.
# 2. Make sure you are logged into GitHub in your terminal (you can test with `gh auth status`).

# Stop the script if any command fails to execute properly.
set -e

# --- SCRIPT START ---

echo ">> Initializing new Git repository..."
git init

echo ">> Adding all project files to the first commit..."
git add .

echo ">> Creating the first commit with a message..."
git commit -m "Initial commit of EstateFlow project"

echo ">> Adding your GitHub repository as the remote 'origin'..."
# We remove any existing remote just in case this script is run more than once.
git remote rm origin 2>/dev/null || true
git remote add origin https://github.com/vermadhav800-dot/4.git

echo ">> Pushing your code to GitHub..."
# This command pushes your 'master' or 'main' branch to the 'origin' remote.
# If your default branch is 'main', you may need to change 'master' to 'main'.
git push -u origin master

echo ""
echo "✅ Success! Your project has been published to your GitHub repository."
echo "You can view it at: https://github.com/vermadhav800-dot/4"
