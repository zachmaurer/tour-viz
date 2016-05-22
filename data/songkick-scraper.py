#!/usr/bin/python3

import sys
import time
import datetime
import json
import logging
from pprint import pprint 
import requests
from pymongo import MongoClient
import pymongo
from key import API_KEY
from ratelimit import RateLimited

ARTIST_SEARCH_URL = "http://api.songkick.com/api/3.0/search/artists.json"
GIGOGRAPHY_SEARCH_URL = "http://api.songkick.com/api/3.0/artists/{artist_id}/gigography.json?"
REQUESTS = 1.0
SECONDS = 10.0
RATE = REQUESTS/SECONDS

DEBUG = False
LOGGER = logging.getLogger(__name__)

#Function: saveArtist
# Saves a Songkick API artist document as is
def saveArtist(db, data):
  data["_id"] = data["id"]
  artists = db.artists
  try:
    LOGGER.info("Attempting to save artist with id: %s", data["id"])
    if not DEBUG:
      artists.insert_one(data)
      LOGGER.info("Successfully saved artist with id: %s", data["id"])
    else:
      LOGGER.info("DEBUG: Bypassed saving artist with id: %s", data["id"])
  except pymongo.errors.DuplicateKeyError as e:
    LOGGER.error("DuplicateKeyError when saving aritst with id: %s", data["id"])

  

#Function: saveEvent
# Saves a Songkick API event document as is
def saveEvent(db, data):
  data["_id"] = data["id"]
  events = db.events
  try:
    LOGGER.info("Attempting to save event with id: %s", data["id"])
    if not DEBUG:
      events.insert_one(data)
      LOGGER.info("Successfully saved event with id: %s", data["id"])
    else:
      LOGGER.info("DEBUG: Bypassed saving event with id: %s", data["id"])
  except pymongo.errors.DuplicateKeyError as e:
    LOGGER.error("DuplicateKeyError when saving event with id: %s", data["id"])
    

#Function: requestArtist 
# Performs an artist search to return id and related fields.
# Returns false if empty search result
@RateLimited(RATE)
def requestArtist(name):
    LOGGER.info("Requesting Artist for: %s", name)
    payload = {"apikey": API_KEY, "query": name}
    r = requests.get(ARTIST_SEARCH_URL, params=payload)
    j = r.json()
    if j['resultsPage']['results']:
      LOGGER.info("Successfully received Artist data for: %s", name)
      return j['resultsPage']['results']['artist'][0]
    else:
      LOGGER.error("Did not successfully receive artist data for: %s", name)
      LOGGER.error("JSON dump: %s", j)
      return False

#Function: requestArtist 
# Returns one page of an artists gigography
# Returns false if reached last page
@RateLimited(RATE)
def requestGigography(id, page):
    LOGGER.info("Requesting Gigography for: %s with Page: %s", id, page)
    payload = {"apikey": API_KEY, "page": page}
    target = GIGOGRAPHY_SEARCH_URL.format(artist_id=id)
    r = requests.get(target, params=payload)
    j = r.json()
    if j['resultsPage']['results']:
      LOGGER.info("Successfully received Gigography for: %s with Page: %s", id, page)
      return j['resultsPage']['results']['event']
    else:
      LOGGER.error("Did not successfully receive Gigography data for: %s page %s", id, page)
      LOGGER.error("JSON dump: %s", j)
      return False

#Function: getAllArtists
# Takes a list of artist names, searches for artists, saves each entry and returns list of ids
def getAllArtists(db, artists):
  ids = list()
  for x in artists:
    data = requestArtist(x)
    if data:
      ids.append(data['id'])
      saveArtist(db, data)
  LOGGER.info("Finished getting all artist names from Songkick Search API.")
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
  LOGGER.info("Finished getting all gigographies from Songkick Events API.")
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
  if len(sys.argv) is 3:
    global DEBUG 
    DEBUG = True
    print("DEBUG MODE ENABLED")

def initLogger():
  global LOGGER
  LOGGER.setLevel(logging.DEBUG)
  stamp = str(int(time.time()))
  filename = 'log/SONGKICK_API_{}.log'
  handler = logging.FileHandler(filename.format(stamp))
  handler.setLevel(logging.DEBUG)
  formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
  handler.setFormatter(formatter)
  LOGGER.addHandler(handler)


def main():
  checkArgs()
  initLogger()
  client = MongoClient()
  db = client.concert_viz
  names = readArtistsFromFile()
  ids = getAllArtists(db, names)
  event_ids = getAllGigographies(db, ids)


if __name__ == "__main__":
    main()