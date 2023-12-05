#!/bin/bash
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <number>"
    exit 1
fi

number=$1

mkdir -p "day$number"
touch "day$number/example"
touch "day$number/input"

printf "const input = await Bun.file('example').text();" \
  > "day$number/index.ts"

git add .
