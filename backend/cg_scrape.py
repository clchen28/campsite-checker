import mechanicalsoup
import requests
import re
import dotenv
from operator import itemgetter
from datetime import datetime
from datetime import timedelta
from bs4 import BeautifulSoup

# Function that acts as a wrapper:
# - Calls the API - DONE
# - Gets all the URLs - DONE
# - Calls the function that pulls the data from a page given an URL
# - Outputs the data to backend endpoint

# TODO: Maybe add functionality to detect difference between available and walk-up

# Types of dates encountered:
# Sun Oct 01 2017 - For use when POSTing to website for initial date
# Oct 1 2017 - likely format for when scraping data
# datetime.date object - stored in actual campsites attribute

class Campground(object):
    def __init__(self, name, url):
        self.name = name
        self.campsites = {}
        self.url = url
    def add_date(self, campsite, date, reservationUrl):
        # Expect date to come in the following format:
        # Year Month Day
        if campsite not in self.campsites:
            self.campsites[campsite] = []
        curCampsite = {"date": date, "reservationUrl": reservationUrl}
        self.campsites[campsite].append(curCampsite)
        self.campsites[campsite] = sorted(self.campsites[campsite], key=itemgetter('date'))
    def printCampground(self):
        print("Campground")
        print(self.name)
        print(self.campsites)
        print(self.url)
    def jsonify(self):
        """
        Returns JSON representation of this object, as a dict
        """
        campground = {
            "name": self.name,
            "url": self.url,
            "campsites": []
        }
        # Purpose of this is to convert dates into strings
        if (len(self.campsites) > 0):
            campsite_numbers = sorted(self.campsites.keys())
            for number in campsite_numbers:
                if len(self.campsites[number]) == 0:
                    continue
                dates = []
                for date in self.campsites[number]:
                    dates.append({
                        "date": date["date"].strftime("%Y-%m-%d"),
                        "reservationUrl": date["reservationUrl"]
                    })
                curCampsite = {number: dates}
                campground["campsites"].append(curCampsite)
        return campground

class CampgroundList(list):
    """
    Inherits from list, contains several Campground objects.
    Has a method to return a JSON string representation of its Campgrounds.
    """
    def serialize(self):
        if len(self) == 0:
            return {"campgrounds": []}

        result = {"campgrounds": [None] * len(self)}
        for idx,campground in enumerate(self):
            result["campgrounds"][idx] = campground.jsonify()
        return result

def get_availability_from_row(row, campground, first_date, last_date, end_date):
    """
    Takes a row from the calendar table and extracts the availability of all
    days for that campsite within the given two weeks.

    :param row: bs4.element.Tag representing a row in the calendar table
    :param campground: Campground object to modify
    :param first_date: datetime.date object for the first date in the calendar
    :param last_date: datetime.date object for the last date in the calendar
    :param end_date: datetime.date object for check-out date
    """
    campsite = row.find("div", class_="siteListLabel").get_text()
    days = row.find_all("td", class_="status")
    for idx, day in enumerate(days):
        date = first_date + timedelta(days=idx)
        if date > last_date or date >= end_date:
            return
        elif "a" in day.attrs["class"]:
            reservationUrl = "https://www.recreation.gov" + day.find("a").attrs["href"] + "&lengthOfStay=1"
            print(day.find("a").attrs["href"])
            print(reservationUrl)
            campground.add_date(campsite, date, reservationUrl)

def get_availability(campground, url, start_date, end_date):
    """
    Gets availability for all campsites for a given campground. Takes in a
    campground object and populates it with campsite availability.

    :param campground: Campground object which will be populated with availability
    :param url: URL of the campground's calendar page
    :param start_date: datetime.date object of the first date to search
    :param end_date: datetime.date object of the last desired date for reservation checking
    """
    br = mechanicalsoup.StatefulBrowser()

    br.session.headers.update({'User-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'})
    br.open(url)

    # First, submit form with given arrival date
    br.select_form("form[name=unifSearchForm]")
    # Assume that start_date and end_date are datetime.date objects
    br['arrivalDate'] = start_date.strftime("%a %b %d %Y")
    br['departureDate'] = end_date.strftime("%a %b %d %Y")
    response = br.submit_selected()

    # Navigate to calendar. Now, first date in calendar will be start_date
    text = response.text
    soup = BeautifulSoup(text, "html.parser")
    calendar_url = soup.find("a", id="campCalendar")["href"]
    response = br.open("https://www.recreation.gov" + calendar_url)

    last_date_reached = False
    last_campsite_reached = False
    while not last_date_reached:
        last_date_reached = False
        last_campsite_reached = False
        while not last_campsite_reached:
            text = response.text
            soup = BeautifulSoup(text, "html.parser")
            calendar = soup.find("table", id="calendar")

            # If calendar is not found, could be due to reservations not available before a
            # certain date. In this situation, just return campground with no availability
            # TODO: For Trumbull Lake, online reservations are not available before
            # a certain date. Try adding a check for this, and seeing if the date output by
            # the error is within the start and end date. If so, re-submit form to check for
            # availability, as opposed to just returning
            if not calendar:
                return campground

            calendar_header = calendar.find("thead")
            cur_month_year = calendar_header.find("td", class_="weeknav month").get_text()

            # cur_month_year might have two months, like so: Oct-Nov 2017
            # cur_month should be Oct in this case
            cur_month = cur_month_year[0:3]

            # If going across years, need to dock one off the year
            # e.g., Dec-Jan 2018 is Dec 2017 - Jan 2018
            if cur_month_year[0:7] == "Dec-Jan":
                cur_year = str(int(cur_month_year[-4:]) - 1)
            else:
                cur_year = cur_month_year[-4:]

            day1_date = calendar_header.find("div", id="day01date").get_text()
            day1_week = calendar_header.find("div", id="day01week").get_text()

            first_date = datetime.strptime(cur_month + " " + day1_date + " "
                + cur_year, "%b %d %Y").date()
            last_date = first_date + timedelta(days=14)

            # Separators have a separator class
            # Rows which contain data for campsites do not have class attribute
            calendar_body = calendar.find("tbody")
            calendar_body_rows = calendar_body.find_all("tr", class_=None)

            # For each row in current 2 weeks, get availability
            for row in calendar_body_rows:
                get_availability_from_row(row, campground, first_date,
                    last_date, end_date)

            # Check to see if this is the last campsite
            next_link = calendar.find("tfoot").find("a",
                id=re.compile("resultNext"))
            if ('class' in next_link.attrs.keys()
                and "disabled" in next_link['class']
                ):
                last_campsite_reached = True
            else:
                # Finds link to next set of campsites, making sure to not select
                # the link for the next 2 weeks
                response = br.follow_link(next_link)
        # Check to see if this is the last date
        if end_date <= last_date:
            last_date_reached = True
        else:
            # Instead of following the link directly, get the href of the 2 weeks link and just follow it
            # Then, append &startIdx=0 to the end of the url
            next_week_element = calendar_header.find("a", id="nextWeek")
            next_week_link = "https://www.recreation.gov"
            next_week_link += next_week_element["href"]
            next_week_link += "&startIdx=0"
            response = br.open(next_week_link)
    return campground

class CantAccessAPI(Exception):
    """Raise if request to Recreation.gov API fails for any reason"""
    pass

class CantFindLocation(Exception):
    """Raise if request to Google Maps API finds location to be invalid"""
    pass

def get_campgrounds_from_API(latitude, longitude, radius):
    """
    Calls Recreation.gov API with a location and search radius, and returns URLs and campground names
    Returns a list of dicts, with two key-value pairs: campground name and URL
    Returns an empty list if no campgrounds found

    :param latitude: Latitude of coordinate to center the search around
    :param longitude: Longitude of coordinate to center the search around
    :param radius: Radius to search around
    """
    dotenv.load()
    API_KEY = dotenv.get('REC_API_KEY')

    api_url = "https://ridb.recreation.gov/api/v1/facilities.json?apikey="
    api_url += API_KEY
    api_url += "&activity=9"
    api_url += "&latitude=" + str(latitude)
    api_url += "&longitude=" + str(longitude)
    api_url += "&radius=" + str(radius)
    
    # Gets campgrounds from RIDB API
    res = requests.get(api_url)
    if not res.ok:
        raise CantAccessAPI("Unable to access RIDB API. Check your connection and API key")

    res_list = res.json()["RECDATA"]

    # Constructs list of Campgrounds
    results = CampgroundList()
    base_url = "https://www.recreation.gov/camping/"
    base_url_suffix = "/r/campgroundDetails.do?contractCode=NRSO&parkId="

    print(res.json())

    for idx,campsite in enumerate(res_list):
        facility_name = campsite['FacilityName'].lower().replace(" ", "-")
        if campsite['LegacyFacilityID']:
            facilityID = str(int(campsite['LegacyFacilityID']))
            campground_url = base_url + facility_name + base_url_suffix + facilityID
            name = " ".join(
                w.capitalize() for w in res_list[idx]['FacilityName'].split())
            results.append(Campground(name, campground_url))
    return results

def get_all_campsite_availability(campgrounds, start_date, end_date):
    for campground in campgrounds:
        print("Campground: ",campground.url)
        get_availability(campground, campground.url, start_date, end_date)
    return campgrounds.serialize()

def geocode_location(location):
    """
    Returns lat and lon based on an input string representing location
    
    :param location: String representing location to geocode
    :returns: Tuple (lat,lon) of geocoded location
    """
    api_base_url = "https://maps.googleapis.com/maps/api/geocode/json?"
    dotenv.load()
    API_KEY = dotenv.get('GOOG_API_KEY')
    api_base_url += "address=" + str(location)
    api_base_url += "&key=" + API_KEY

    res = requests.get(api_base_url)
    if not res.ok:
        raise CantAccessAPI("Unable to access Google Maps API. Check your connection and API key")

    res_obj = res.json()
    if res_obj["status"] != "OK":
        raise CandFindLocation("Location is invalid")
    else:
        lat = res_obj["results"][0]["geometry"]["location"]["lat"]
        lon = res_obj["results"][0]["geometry"]["location"]["lng"]
        return (lat, lon)