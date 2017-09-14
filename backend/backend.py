from flask import Flask
from cg_scrape import *

app = Flask(__name__)

# TODO: Consider using Flask-RESTful

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/api')
def get_json():
    url = "https://www.recreation.gov/camping/Hodgdon_Meadow/r/campsiteCalendar.do?page=calendar&search=site&contractCode=NRSO&parkId=70929"
    myCampground = Campground("Hodgdon Meadow", url)
    myCampground = get_availability(myCampground, url, datetime(2017, 10, 5).date(), datetime(2017, 10, 27).date())
    return myCampground.jsonify()