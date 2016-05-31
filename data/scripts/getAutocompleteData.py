#!/usr/bin/python3

import sys
import pymongo
import json
import sys
from collections import defaultdict 


def getArtistList():
  artists = list()
  client = pymongo.MongoClient()
  db = client.concert_viz.artists
  records = db.find()
  for r in records:
    name = r['displayName']
    id = r['id']
    artists.append({
      "name": name,
      "id": id
    })
  formatted = json.dumps(artists)
  with open("artists_list.json", "w") as f:
    f.write(formatted)



def getCityList():
  cities = set()
  client = pymongo.MongoClient()
  db = client.concert_viz.events
  records = db.find()
  for r in records:
    name = r['location']['city']
    lat = r['location']['lat']
    lng = r['location']['lng']
    x = (name, lat, lng)
    cities.add(x)
  city_list = list()
  for c in cities:
    x = {
      "name": c[0],
      "lat": c[1],
      "lng": c[2],
    }
    city_list.append(x)
  formatted = json.dumps(city_list)
  with open("city_list.json", "w") as f:
    f.write(formatted)  





def main():
  getArtistList()
  getCityList()

if __name__ == "__main__":
  main()