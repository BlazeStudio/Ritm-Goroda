import os
import uuid

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.files.storage import FileSystemStorage
from django.shortcuts import render, redirect
from django.contrib import messages
from dosug.models import Event
import json, random
from dosug.forms import EventForm
from datetime import datetime
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

def home(request):
    event = Event.objects.all()
    count = Event.objects.count()
    return render(request, 'dosug/home.html', {'event': event, 'count': count})

def user_register(request):
    if request.user.is_authenticated:return redirect('/')
    username_base = [user.username for user in User.objects.all()]
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        email = request.POST.get("email")
        if username in username_base:
            messages.error(request, 'Указанное имя пользователя уже занято')
            return redirect(request.path)
        else:
            user = User.objects.create_user(username, email, password)
            login(request, user)
            messages.success(request, 'Вы успешно зарегистрированы')
            return redirect('/')
    return render(request, 'dosug/register.html')


def user_login(request):
    if request.user.is_authenticated: return redirect('/')
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, 'Вы успешно вошли на сайт')
            return redirect('/')
        else:
            messages.error(request, 'Неверный логин или пароль')
            return redirect(request.path)
    return render(request, 'dosug/login.html')

#Для теста - потом убрать
@login_required(login_url="/login")
def user_logout(request):
    logout(request)
    return redirect('/')

def user_events(request):
    if not request.user.is_authenticated: return redirect('/')
    if request.user.is_superuser:
        events = Event.objects.all()
    else:
        events = Event.objects.filter(author=request.user.id)
    query = request.GET.get('search_query')
    if query:
        events = [event for event in events if query.lower() in event.title.lower()]
    paginator = Paginator(events, 10)

    page_number = request.GET.get('page')
    try:
        events = paginator.page(page_number)
    except PageNotAnInteger:
        events = paginator.page(1)
    except EmptyPage:
        events = paginator.page(paginator.num_pages)
    return render(request, 'dosug/user_events.html', {'events': events, 'query': query})

# def profile(request, id):
#     if request.user.is_authenticated:
#         if request.user.id == id:
#         print("yes")
#     return render(request, 'dosug/user_events.html')
def event_list(request, type='all', sort=None, query = None):
    query = request.GET.get('search_query')
    map_dots = Event.objects.all()
    if query is not None and sort != "None":
        if type != 'all':
            map_dots = map_dots.filter(type=type)
        if sort is not None and sort != "None":
            map_dots = map_dots.order_by(sort)
        map_dots = [event for event in map_dots if query.lower() in event.title.lower()]
    else:
        map_dots = Event.objects.all()
        if type != 'all':
            map_dots = map_dots.filter(type=type)
        if sort is not None and sort != "None":
            map_dots = map_dots.order_by(sort)
    paginator = Paginator(map_dots, 8)

    page_number = request.GET.get('page')
    try:
        map_dots = paginator.page(page_number)
    except PageNotAnInteger:
        map_dots = paginator.page(1)
    except EmptyPage:
        map_dots = paginator.page(paginator.num_pages)
    count = len(map_dots)
    return render(request, 'dosug/events_list.html', {'map_dots': map_dots, 'type': type, 'sort': sort, 'query': query, 'count': count})

def random_event(request):
    event_ids = list(Event.objects.values_list('id', flat=True))
    event = Event.objects.get(id=random.choice(event_ids))
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
        phone = request.POST.get("phone")
        link = request.POST.get("url")
        coordinates = latitude + ',' + longitude
        address = request.POST.get("address")
        image = request.FILES.get('photo')
        if image == None:
            filename = "default.jpg"
        else:
            filename = str(uuid.uuid4()) + '.' + image.name.split('.')[-1]
            fs = FileSystemStorage()
            saved_filename = fs.save(filename, image)
            # image_path = fs.url(saved_filename)
        new_event = Event.objects.create(title=title,
                                         type=type,
                                         tiny_description=short_description,
                                         description=description,
                                         coordinates=coordinates,
                                         address=address,
                                         datetime=date_time_obj,
                                         phone=phone,
                                         link=link,
                                         image=filename)
        messages.success(request, 'Событие было успешно добавлено на сайт!')
        return redirect(request.path)
    return render(request, 'dosug/add_event.html', {'form': eventform})

def edit_event(request, id):
    event = Event.objects.filter(id = id).first()
    if (not request.user.is_superuser) and (request.user.id != event.author):
        redirect(request.path)
    latitude, longitude = event.coordinates.split(',')
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
        phone = request.POST.get("phone")
        link = request.POST.get("url")
        coordinates = latitude + ',' + longitude
        address = request.POST.get("address")
        image = request.FILES.get('photo')
        new_event = Event.objects.filter(id=id).update(title=title,
                                         type=type,
                                         tiny_description=short_description,
                                         description=description,
                                         coordinates=coordinates,
                                         address=address,
                                         datetime=date_time_obj,
                                         phone=phone,
                                         link=link)
        if image == None:
            pass
        else:
            fs = FileSystemStorage()
            if (event.image != "default.jpg"):
                filename = str(event.image)
                fs.delete(filename)
            filename = str(uuid.uuid4()) + '.' + image.name.split('.')[-1]
            saved_filename = fs.save(filename, image)
            # image_path = fs.url(saved_filename)
            new_event = Event.objects.filter(id=id).update(image=filename)
        messages.success(request, 'Событие было успешно обновлено')
        return redirect(request.path)
    return render(request, 'dosug/edit_event.html', {'form': eventform, 'latitude': latitude, 'longitude':longitude, 'event': event})

def map(request):
    map_dots = Event.objects.all()
    data = list(map_dots.values())
    file_path = 'static\js\data2.json'
    for item in data:
        item['datetime'] = item['datetime'].strftime("%Y-%m-%d %H:%M:%S")
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