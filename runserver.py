#!/usr/bin/python3

import sys
import pymongo
import sys
from collections import defaultdict
from ujson import dumps
from flask import Flask
from flask import request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
db = pymongo.MongoClient().concert_viz

@app.route("/")
def index():
  return("API server is running!")

# Method: artistEvents
# -------
# Gets all the events that an artist particpated in.
@app.route("/api/events/artist")
def artistEvents():
  #Get artist id from request args
  artist_id = int(request.args['id'])
  artist_name = str(request.args['name'])
  #Get all events for an artist
  events = db.events.find({ "performance": {"$elemMatch": {"artist.id": artist_id}}})
  performance_list = list()
  for e in events:     
    for p in e['performance']:
      r = dict()
      r['name'] = p['displayName'].rstrip('\n')
      r['billingIndex'] = p['billingIndex']
      r['startDate'] = e['start']['date']
      r['id'] = p['id']
      r['lat'] = e['location']['lat']
      r['lng'] = e['location']['lng']
      r['city'] = e['location']['city']
      if r['name'] == artist_name.rstrip():
        r['isSubject'] = 1
      else:
        r['isSubject'] = 0
      performance_list.append(r)
  return dumps(performance_list)

# Method: cityEvents
# ---------
# Gets all the events that occurred in a given city.
@app.route("/api/events/city")
def cityEvents():
  # Get city name
  city_name = request.args['city']
  events = db.events.find({"location.city": city_name})
  venue_data = defaultdict(list)
  artist_data = defaultdict(list)
  for e in events:
    venue_name = e['venue']['displayName']
    venue_data[venue_name].append(e['start']['date'])
    for p in e['performance']:
      artist_name = p['displayName'].rstrip('\n')
      artist_data[artist_name].append(e['start']['date'])
  
  artist_data_as_list = list()
  for name, dates in artist_data.items():
    y = dict()
    y['name'] = name
    y['total'] = len(dates)
    y['events'] = dates
    artist_data_as_list.append(y)
    
  venue_data_as_list = list()
  for name, dates in venue_data.items():
    y = dict()
    y['name'] = name
    y['total'] = len(dates)
    y['events'] = dates
    venue_data_as_list.append(y)


  x = dict()
  x['venue_data'] = venue_data_as_list
  x['artist_data'] = artist_data_as_list
  return dumps(x)
  

@app.route("/api/events/all")
def allEvents():
  events = db.events.find()
  concerts = list()
  for e in events:
    x = dict()
    x['lat'] = e['location']['lat']
    x['lng'] = e['location']['lng']
    x['date'] = e['start']['date'] 
    concerts.append(x)
  return dumps(concerts)

# Method: associatedArtists
# ---------
# Gets all the events that occurred in a given city.
@app.route("/api/associated/artist")
def associatedArtists():
  #Get artist id from request args
  artist_id = int(request.args['id'])
  artist_name = str(request.args['name'])
  events = db.events.find({ "performance": {"$elemMatch": {"artist.id":artist_id}}})

  associated_artists = defaultdict(list)
  for e in events:
    date = e['start']['date']
    for p in e['performance']:
      performer = p['displayName'].rstrip('\n')
      associated_artists[performer].append(date)
      
  associated_artists_as_list = list()
  for name, events in associated_artists.items():
    x = dict()
    x['name'] = name
    x['events'] = events
    x['count'] = len(events)
    x['isSubject'] = 1 if artist_name == name else 0
    associated_artists_as_list.append(x)
  return dumps(associated_artists_as_list)


if __name__ == "__main__":
    app.run(debug=False)