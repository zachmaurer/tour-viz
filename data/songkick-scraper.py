#!/usr/bin/python3

import sys
import time

import requests
from pymongo import MongoClient

from key import API_KEY


#Rate limiting from http://blog.gregburek.com/2011/12/05/Rate-limiting-with-decorators/
def RateLimited(maxPerSecond):
    minInterval = 1.0 / float(maxPerSecond)
    def decorate(func):
        lastTimeCalled = [0.0]
        def rateLimitedFunction(*args,**kargs):
            elapsed = time.clock() - lastTimeCalled[0]
            leftToWait = minInterval - elapsed
            if leftToWait>0:
                time.sleep(leftToWait)
            ret = func(*args,**kargs)
            lastTimeCalled[0] = time.clock()
            return ret
        return rateLimitedFunction
    return decorate

@RateLimited(0.1)  # 1 per 10 seconds
def requestArtist(artist_name):
    print(num)



def getArtistIDs(artists):
  for a in artists:
    PrintNumber(a)




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