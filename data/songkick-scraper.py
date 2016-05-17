#!/usr/bin/python3

import sys
import time
import json
from pprint import pprint 
import requests
from pymongo import MongoClient
from key import API_KEY
from ratelimit import RateLimited
#from awesome_print import ap

ARTIST_SEARCH_URL = "http://api.songkick.com/api/3.0/search/artists.json"
GIGOGRAPHY_SEARCH_URL = "http://api.songkick.com/api/3.0/artists/{artist_id}/gigography.json?"
REQUESTS = 1.0
SECONDS = 10.0
RATE = REQUESTS/SECONDS

#Function: saveArtist
# Saves a Songkick API artist document as is
def saveArtist(db, data):
  data["_id"] = data["id"]
  artists = db.artists
  print("Saving artist with id:", data["id"])
  artists.insert_one(data)

#Function: saveEvent
# Saves a Songkick API event document as is
def saveEvent(db, data):
  data["_id"] = data["id"]
  events = db.events
  print("Saving event with id:", data["id"])
  events.insert_one(data)

#Function: requestArtist 
# Performs an artist search to return id and related fields.
# Returns false if empty search result
@RateLimited(RATE)
def requestArtist(name):
    print("Requesting Artist for:", name)
    payload = {"apikey": API_KEY, "query": name}
    r = requests.get(ARTIST_SEARCH_URL, params=payload)
    j = r.json()
    # status = j['resultsPage']['status']
    # if status is not 'ok':
    #   print("Returned not ok:", status, '\n',j)
    #   return False
    if j['resultsPage']['results']:
      return j['resultsPage']['results']['artist'][0]
    else:
      return False

#Function: requestArtist 
# Returns one page of an artists gigography
# Returns false if reached last page
@RateLimited(RATE)
def requestGigography(id, page):
    print("Requesting Gigography for:", id, "with Page:", page)
    payload = {"apikey": API_KEY, "page": page}
    target = GIGOGRAPHY_SEARCH_URL.format(artist_id=id)
    r = requests.get(target, params=payload)
    j = r.json()
    # status = j['resultsPage']['status']
    # if status is not "ok":
    #   print("Returned not ok:", status, '\n',j)
    #   return False
    if j['resultsPage']['results']:
      return j['resultsPage']['results']['event']
    else:
      return False

#Function: getAllArtists
# Takes a list of artist names, searches for artists, saves each entry and returns list of ids
def getAllArtists(db, artists):
  ids = list()
  for x in artists:
    data = requestArtist(x)
    ids.append(data['id'])
    saveArtist(db, data)
  return ids

#Function: getAllGigographies
#Iterates over a list of artist ids, gets all gigographies by iterating thru pages and saving each event
def getAllGigographies(db, artist_ids):
  event_ids = list()
  for x in artist_ids:
    page = 1  
    while True:
      data = requestGigography(x, page)
      if not data:
        break
      for e in data:
        saveEvent(db, e)
        event_ids.append(e['id'])
      page += 1
  return event_ids

#Function: readArtistsFromFile
# Reads in .txt file from command line.
# Creates array of strings that are used to perform the artist lookup.
def readArtistsFromFile():
  artists = list()
  filename = sys.argv[1]
  with open(filename, 'r') as f:
    for artist in f:
      artist = artist.rstrip()
      artists.append(artist)
  return artists

#Function: checkArgs
# Checks for textfile with artists names.
def checkArgs():
  if len(sys.argv) < 2:
    print("Error: missing artsts.txt")
    sys.exit()

def main():
  checkArgs()
  client = MongoClient()
  db = client.concert_viz
  names = readArtistsFromFile()
  ids = getAllArtists(db, names)
  event_ids = getAllGigographies(db, ids)


if __name__ == "__main__":
    main()