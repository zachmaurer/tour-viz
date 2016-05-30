#!/usr/bin/python3

import sys
import pymongo
import json
import sys
from collections import defaultdict 



def getAssociatedActs(artist_name):
  OUTFILE = ("{}_bubble.json").format(artist_name)
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
    output_list = list()
    for year, performances in events_by_year.items():
      for name, count in performances.items():
        r = dict()
        r['isSubject'] = 1 if name == artist_name else 0
        r['year'] = year
        r['name'] = name
        r['count'] = count
        output_list.append(r)
    f.write(json.dumps(output_list))
        

def main():
  if not sys.argv[1]:
    print("Usage: [Artist name]")
  getAssociatedActs(sys.argv[1])

if __name__ == "__main__":
  main()