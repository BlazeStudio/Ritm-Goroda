from django.shortcuts import render, redirect
from django.contrib import messages
from dosug.models import Event
import json, random
from dosug.forms import EventForm
from datetime import datetime

def home(request):
    event = Event.objects.all()
    count = Event.objects.count()
    return render(request, 'dosug/home.html', {'event': event, 'count': count})

def music(request, type='all', sort=None):
    if type == 'all':
        map_dots = Event.objects.all()
    elif ((type == 'all') and (sort != None)):
        map_dots = Event.objects.all().order_by('-' + sort)
    elif sort != None:
        map_dots = Event.objects.filter(type=type).order_by('-'+sort)
    else:
        map_dots = Event.objects.filter(type=type)
    return render(request, 'dosug/events_list.html', {'map_dots': map_dots, 'type': type})

def music2(request, type=None, sort=None):
    map_dots = Event.objects.all().order_by('-' + sort)
    return render(request, 'dosug/events_list.html', {'map_dots': map_dots, 'type': type})

def random_event(request):
    count = Event.objects.count()
    event = Event.objects.get(id=random.randint(1, count))
    return redirect(f'/event/{event.id}', {'event': event})
def add_event(request):
    eventform = EventForm()
    if request.method == "POST":
        title = request.POST.get("title")
        type = request.POST.get("type")
        short_description = request.POST.get("description")
        description = request.POST.get("description2")
        latitude = request.POST.get("latitude")
        longitude = request.POST.get("longitude")
        date = request.POST.get("datetime")
        date_time_obj = datetime.strptime(date, "%Y-%m-%dT%H:%M")
        coordinates = latitude + ',' + longitude
        address = request.POST.get("address")
        new_event = Event.objects.create(title=title, type=type, tiny_description=short_description, description=description, coordinates=coordinates, address=address, datetime=date_time_obj)
        messages.success(request, 'Событие было успешно добавлено на сайт!')
    return render(request, 'dosug/add_event.html', {'form': eventform})

def map(request):
    map_dots = Event.objects.all()
    data = list(map_dots.values())
    file_path = 'static\js\data2.json'
    new_data = {"features": data}
    with open(file_path, 'w', encoding='utf-8') as json_file:
        json.dump(new_data, json_file, ensure_ascii=False, indent=2)
        return render(request, 'dosug/map.html')

def test(request):
    posts = Event.objects.all
    return render(request, 'dosug/test.html', {'posts': posts})

def event_detail(request, id):
    event = Event.objects.get(id=id)
    event.views_add()
    return render(request, 'dosug/event.html', {'event': event})