#!/bin/bash

# Open a new Git Bash window and run emu.sh
start "" bash -c "./emu.sh; exec bash"

# Open another Git Bash window and run npm start
start "" bash -c "npm start; exec bash"