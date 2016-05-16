#!/usr/bin/python3

import sys
import time

import requests
from pymongo import MongoClient

from key import API_KEY
from ratelimit import RateLimited

@RateLimited(0.2)  # 1 per 10 seconds
def requestArtist(artist_name):
    print(artist_name)

def getArtistIDs(artists):
  for a in artists:
    requestArtist(a)
    
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

def checkArgs():
  if len(sys.argv) < 2:
    print("Error: missing artsts.txt")
    sys.exit()

def main():
  checkArgs()
  client = MongoClient()
  db = client.da_flow
  events = db.events
  artists = db.artists
  artist_ids = getArtistIDs(readArtistsFromFile())



if __name__ == "__main__":
    main()