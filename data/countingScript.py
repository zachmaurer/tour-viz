#!/usr/bin/python3
OUTFILE = open("NAMES_ORDERED_DEDUPED.txt", "w")
deduped = set()
with open("./NAMES_ORDERED.txt", "r") as f:
  for l in f:
    l = l.rstrip('\n')
    deduped.add(l)
for x in deduped:
  OUTFILE.write(x +'\n')
