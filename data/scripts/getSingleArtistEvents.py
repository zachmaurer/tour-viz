#!/usr/bin/python3

import sys
import pymongo
import json
import sys

def queryArtist(artist_name):
  OUTFILE = ("{}.txt").format(sys.argv[1])
  with open(OUTFILE, 'w') as f:
    client = pymongo.MongoClient()
    db = client.concert_viz
    artist_id = db.artists.find_one({"displayName": artist_name})['id']
    events = db.events.find({ "performance": {"$elemMatch": {"artist.id":artist_id}}})
    record_list = list()
    for e in events:     
      for p in e['performance']:
        r = dict()
        r['name'] = p['displayName'].rstrip('\n')
        r['billingIndex'] = p['billingIndex']
        r['startDate'] = e['start']['date']
        r['id'] = p['id']
        if r['name'] == artist_name.rstrip():
          r['isSubject'] = 1
        else:
          r['isSubject'] = 0
        record_list.append(r)
    formatted = json.dumps(record_list)
    f.write(formatted)



def main():
  if not sys.argv[1]:
    print("Usage: [Artist name]")
  queryArtist(sys.argv[1])

if __name__ == "__main__":
  main()

#formatted = json.dumps(result)
