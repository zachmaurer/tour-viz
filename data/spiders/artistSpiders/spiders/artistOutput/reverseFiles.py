#!/usr/bin/python3

outfile = open("NAMES_ORDERED.txt", "w")

filenames = list()
with open("NAME_FILES.txt", "r") as f:
  for x in f:
    filenames.insert(0, x)

for x in filenames:
  print(x)
  with open('.'+x[12:].rstrip(), "r") as names:
      for n in names:
        outfile.write(n)


