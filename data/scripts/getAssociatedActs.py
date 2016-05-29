#!/usr/bin/python3

import sys
import pymongo
import json
import sys
from collections import defaultdict 



def getAssociatedActs(artist_name):
  OUTFILE = ("{}_bubble.csv").format(artist_name)
  events_by_year = defaultdict(lambda : defaultdict(int))
  client = pymongo.MongoClient()
  db = client.concert_viz
  artist_id = db.artists.find_one({"displayName": artist_name})['id']
  events = db.events.find({ "performance": {"$elemMatch": {"artist.id":artist_id}}})
  for e in events:
    year = e['start']['date'].split('-')[0]
    for p in e['performance']:
      performer = p['displayName'].rstrip('\n')
      events_by_year[year][performer] += 1
  with open(OUTFILE, 'w') as f:
    f.write("name,year,numShows,isSubject\n")
    for year, performances in events_by_year.items():
      for name, count in performances.items():
        isSubject = 1 if name is artist_name else 0
        f.write("{},{},{},{}\n".format(name, str(year), str(count), str(isSubject)))

def main():
  if not sys.argv[1]:
    print("Usage: [Artist name]")
  getAssociatedActs(sys.argv[1])

if __name__ == "__main__":
  main()