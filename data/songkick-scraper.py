#!/usr/bin/python3

import sys
import requests
from pymongo import MongoClient





def getArtistIDs(artists):
  ids = list()



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
  artistsDB = client.artists
  eventsDB = client.events
  artists = readArtistsFromFile()
  artist_ids = getArtistIDs(artists)



if __name__ == "__main__":
    main()