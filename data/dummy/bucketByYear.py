#!/usr/bin/python3

import pymongo
import json
import sys
from collections import defaultdict


def bucketByYear(events):
  byYear = defaultdict(list)
  for e in events:
    key = e['start']['date']
    key = key.split('-')[0]
    byYear[key].append(e)
  for key in byYear:
    print(str(key) + " # of records: "+ str(len(byYear[key])))
  return byYear

def main():
  filename = sys.argv[1]
  outfile = sys.argv[2]
  if (len(sys.argv) < 3):
    print("Usage: buckeyByYear.py [infile] [outfile]")
    return
  events = list()
  with open(filename, "r") as f:
    for l in f:
      item = json.loads(l)
      events.append(item)
  result = bucketByYear(events)
  formatted = json.dumps(result)
  with open(outfile, "w") as o:
    o.write(formatted)

if __name__ == "__main__":
    main()