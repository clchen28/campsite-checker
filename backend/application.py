from flask import Flask
from flask_restful import Resource, Api, reqparse
from datetime import datetime
from cg_scrape import *

application = Flask(__name__)
api = Api(application)

class Campgrounds(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('location',
            type=str, required=True, location='json')
        parser.add_argument('radius',
            type=int, required=True, location='json')

        # These need to be converted to datetime.date objects
        parser.add_argument('start_date',
            type=str, required=True, location='json')
        parser.add_argument('end_date',
            type=str, required=True, location='json')

        args = parser.parse_args(strict=True)

        try:
            lat,lon = geocode_location(args['location'])
        except CantAccessAPI as e:
            print(e)
            # Redirect to previous page with error
            return
        except CantFindLocation as e:
            print(e)
            # Redirect to previous page with error
            return

        print("Latitude: ",lat)
        print("Longitude: ",lon)

        campgrounds = get_campgrounds_from_API(lat, lon, args['radius'])
        start_date = datetime.strptime(args['start_date'], "%m/%d/%Y").date()
        end_date = datetime.strptime(args['end_date'], "%m/%d/%Y").date()

        result = get_all_campsite_availability(campgrounds, start_date, end_date)
        print(result)
        return result

api.add_resource(Campgrounds, '/api')
if __name__ == "__main__":
    application.run()
