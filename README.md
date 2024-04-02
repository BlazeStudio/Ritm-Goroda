# Ritm Goroda

Ritm Goroda is a website dedicated to leisure in Moscow with support for Yandex Maps and automatic filling of the map from the database. Backend made on Django, frontend - HTML, CSS, JavaScript.

## Target
This website is targeted to simplify the search for leisure activities for young people and not only. Any interested registered user can add their own event to the site, specifying the relevant data (including the location on the map).

There are two registration options:
1. `User` has the ability to evaluate events and add them to bookmarks
2. `Organization` is able to create individual events that will be viewed in its profile. It is able to change its own events, put likes, add bookmarks.

There is also an administrator role on the site, but it does not have a separate registration form. You can add a separate administrator through the Django Admin Panel or through the SQLite database editor.
The `Administrator` can do all of the above. He can also edit and delete all events on the site.

## Guide
### Event
Each added event contains the following data: name, description, date, type, number, address, and more. There is a form on the site that automatically checks for correctness and, if successful, records the created event in the database. There are different types of event filtering to simplify the search.

Each event can contain a cover image that is uploaded to the site with a uuid-name. When the image is changed during editing, the old file is deleted and replaced with a new one.
![Map example with filters](https://i.imgur.com/P4NGDJ3l.png)

### Maps
The site contains three different views of Yandex maps.


1. **Add-event map** - a map that is in the form of adding an event. Features:
   * It is impossible to select a point further than Moscow and the Moscow region (it has latitude and longitude restrictions)
   * It has three input fields - latitude, longitude and address. Latitude and longitude can be entered manually, but you will not be able to circumvent the restriction. The entered data automatically sets a new point graphically on the map
   * The data that has been verified and sent to the server will be recorded in the database so that the specified point can be retrieved on the map again
2. **General Map** - a map that contains all the events contained on the site. Features:
   * The coordinates recorded in the database are structurally recorded in a JSON file, and then parsed using JS code, which is responsible for filling the Yandex map
   * Each type of event has a unique cluster to make it easier to navigate the map.
   * The `<dropdown> menu` is integrated into the map, which contains all possible types of events. If you disable a certain type, the clusters of the corresponding type will disappear from the map
![Map example with filters](https://i.imgur.com/WVJ95io.png)
3. **Event map** - a map that contains a single point - the coordinates of a certain event. Features:
   * The map is centered specifically on the coordinates of the point.
   * The balloon contains an address founded by coordinates
   * For each event, the nearest metro station is automatically calculated relative to the point located. If the coordinates are changed, the nearest metro station will change automatically

### Few words about GUI
The entire site is wrapped in a preloader linked directly to the div page. He is waiting for the page to load fully, including all images and maps. Almost all sections, containers, headings, paragraphs and pictures have some kind of specific effect due to [wow.js](https://wowjs.uk/) therefore, the preloader helps to avoid premature site loading.
![Map example with filters](https://i.imgur.com/UfaXHU6.png)

### Statistical graphics
Each event contains several graphs containing some statistical indicators. The graphs reflect the number of visits, likes and bookmarks over the entire period of the event's existence. Intermediate data (views, likes and bookmarks) are recorded in the database, and a certain function (using datetime and the date of creation of the event) calculates the number of days when the event was created.
```python
    def days_since_creation(self):
        current_datetime = datetime.now()
        time_difference = current_datetime - self.created_at
        return time_difference.days
```

There are 4 graphs: general, a graph of views, likes and bookmarks
![Graphic image](https://i.imgur.com/9Dfto0D.png)
## Installation


After cloning the repository, install the necessary libraries from the `requirements.txt`

```bash
pip install -r requirements.txt
```
or just
```python
pip install Django==4.2.6
```
After successful installation, run the server

```bash
python manage.py runserver
```

## P.S.

This project was written as my student work, I decided to get to know django and test the Yandex API

I'm just learning, so I apologize for the quality of the code if it makes your eyes fall out😇