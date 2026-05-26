#!/bin/bash

# This script can be invoked to mark a release, and it performs all necessary
# steps to bump the version number, etc.

CURRENT_VERSION=$(cat ./package.json | jq -r '.version')
WANTED_VERSION=$1

if test -z "$WANTED_VERSION"; then
    echo "Current version: $CURRENT_VERSION"
    echo "You need to specify a new version."
    exit 1
fi

echo "NOTE: This script bumps the current version ($CURRENT_VERSION) to version $WANTED_VERSION."
echo "It performs the following steps:"
echo ""
echo "1. Bump the package.json to $WANTED_VERSION"
echo "2. Commit the changes"
echo "3. Tag the new commit with that version"
echo "4. Push to origin"
echo ""

read -p "Do you want to do this and update the current version ($CURRENT_VERSION) to $WANTED_VERSION? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Updating version..."
    echo "$(jq --arg ver "$WANTED_VERSION" '.version = $ver' ./package.json)" > ./package.json
    
    echo "Committing change..."
    git add ./package.json
    git commit -m "chore: Bump version to v$WANTED_VERSION"
    git push

    echo "Tagging commit..."
    git tag -a v$WANTED_VERSION -m "Tag release $WANTED_VERSION"

    echo "Pushing to origin..."
    git push origin tag v$WANTED_VERSION

    echo "Done."
else
    echo "Not performing bump."
fi

