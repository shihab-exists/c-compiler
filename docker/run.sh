#!/bin/sh
set -e

cd /sandbox

# Compile
if ! gcc main.c -o main -Wall -O2 2> compile_errors.txt; then
    cat compile_errors.txt
    exit 1
fi

# Run with optional input
if [ -f input.txt ]; then
    ./main < input.txt
else
    ./main
fi
