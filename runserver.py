#!/usr/bin/python3

import sys
import pymongo
import sys
from ujson import dumps
from flask import Flask
from flask import request

app = Flask(__name__)
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
  #Get all events for an artist
  events = db.events.find({ "performance": {"$elemMatch": {"artist.id": artist_id}}})
  return dumps(events)

# Method: cityEvents
# ---------
# Gets all the events that occurred in a given city.
@app.route("/api/events/city")
def cityEvents():
  # Get city name
  city_name = request.args['city']
  #Find all events that occur in this city
  events = db.events.find({"location.city": city_name})
  return dumps(events)


if __name__ == "__main__":
    app.run(debug=True)