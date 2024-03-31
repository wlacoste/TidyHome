#!/bin/bash

# Run npx expo prebuild
npx expo prebuild

# Navigate to the android folder
cd android

# Run gradlew assembleRelease
./gradlew assembleRelease

# Copy the apk file to the desired location
cp ./app/build/outputs/apk/release/app-release.apk ../../ShareFolder

cd ..

#cd ~/AppData/Local/Android/Sdk/emulator && ./emulator -avd MP