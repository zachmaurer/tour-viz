#!/usr/bin/python3

import songkickScraper


def main():
  songkickScraper.checkArgs()
  songkickScraper.initLogger()
  client = songkickScraper.MongoClient()
  db = client.concert_viz
  names = songkickScraper.readArtistsFromFile()
  #print("here")
  ids = getAllArtists(db, names)
  event_ids = getAllGigographies(db, ids)

if __name__ == "__main__":
    main()

