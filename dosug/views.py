import uuid

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.files.storage import FileSystemStorage
from django.db.models import Max
from django.shortcuts import render, redirect
from django.contrib import messages
from dosug.models import Event, DateTimeData
import json, random
from dosug.forms import EventForm, DateTimeDataForm
from datetime import datetime
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth.hashers import check_password, make_password

# def error_404(request, exception):
#     print("Yes")
#     return render(request, '404.html', status=404)

def home(request):
    event = Event.objects.all()
    popular = Event.objects.order_by("-views")[:6]
    new = Event.objects.order_by("-created_at")[:4]
    count = Event.objects.count()
    return render(request, 'dosug/home.html', {'event': event, 'count': count, 'popular': popular, 'new': new})

def user_register(request):
    if request.user.is_authenticated:return redirect('/')
    username_base = [user.username for user in User.objects.all()]
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        email = request.POST.get("email")
        account_type = request.POST.get("type_field")
        if username in username_base:
            messages.error(request, 'Указанное имя пользователя уже занято')
            return redirect(request.path)
        else:
            user = User.objects.create_user(username, email, password)
            User.objects.filter(id=user.id).update(type=account_type)

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

@login_required(login_url="/login")
def user_logout(request):
    logout(request)
    return redirect('/')

def user_events(request):
    if not request.user.is_authenticated:
        messages.warning(request, "Невозможно получить доступ к этой странице")
        return redirect('/')
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

def profile(request, id, edit = 0):
    user_prof = User.objects.filter(id=id).first()
    if user_prof is None:
        messages.warning(request, "Указанный профиль не найден")
        return redirect('/')
    if request.user.is_authenticated:
        if request.user.id == id:
            edit = 1
            if request.method == "POST":
                old_password = request.POST.get("old_password")
                if old_password is not None or old_password != '':
                    new_password = request.POST.get("new_password")
                    if check_password(old_password, request.user.password):
                        request.user.password = new_password
                        request.user.set_password(request.user.password)
                        request.user.save()
                        user = authenticate(username=request.user.username, password=request.user.password)
                        login(request, user)
                        messages.success(request, "Пароль успешно изменён")
                    else:
                        messages.error(request, "Неверный пароль")
                else:
                    username = request.POST.get("username") #not(User.objects.filter(username=username).exists())
                    password = request.POST.get("password")
                    if not(username == request.user.username):
                        if check_password(password, request.user.password):
                            User.objects.filter(id=request.user.id).update(username=username)
                            messages.success(request, "Имя пользователя успешно изменено")
                        else:
                            messages.error(request, "Неверный пароль")
                return redirect(request.path)
    return render(request, 'dosug/profile.html', {'edit': edit, 'user_prof': user_prof})
def event_list(request, type='all', sort=None):
    query = request.GET.get('search_query')
    max_price = request.GET.get('max_price')
    min_price = request.GET.get('min_price')
    if (max_price is None) or (min_price is None) or (max_price == '') or (min_price == ''):
        max_price = 10000
        min_price = 0
    map_dots = Event.objects.filter(price__gte=min_price, price__lte=max_price)
    if query is not None and sort != "None":
        if type != 'all':
            map_dots = map_dots.filter(type=type)
        if sort is not None and sort != "None":
            map_dots = map_dots.order_by(sort)
        map_dots = [event for event in map_dots if query.lower() in event.title.lower()]
    else:
        if type != 'all':
            map_dots = map_dots.filter(type=type)
        if sort is not None and sort != "None":
            map_dots = map_dots.order_by(sort)
    paginator = Paginator(map_dots, 8)
    count = len(map_dots)
    page_number = request.GET.get('page')
    try:
        map_dots = paginator.page(page_number)
    except PageNotAnInteger:
        map_dots = paginator.page(1)
    except EmptyPage:
        map_dots = paginator.page(paginator.num_pages)
    return render(request, 'dosug/events_list.html', {'map_dots': map_dots,
                                                      'type': type,
                                                      'sort': sort,
                                                      'query': query,
                                                      'count': count,
                                                      'max_price': max_price,
                                                      'min_price': min_price})

def random_event(request):
    event_ids = list(Event.objects.values_list('id', flat=True))
    number = random.choice(event_ids)
    event = Event.objects.get(id=number)
    event.views_add()
    datetime = datetime_view(request, number)
    return redirect(f'/event/{event.id}', {'event': event, 'datetime': datetime})
def add_event(request):
    eventform = DateTimeDataForm()
    if request.method == "POST":
        latitude_str = request.POST.get("latitude")
        longitude_str = request.POST.get("longitude")
        if latitude_str and longitude_str:
            try:
                latitude = float(latitude_str)
                longitude = float(longitude_str)
            except ValueError:
                messages.warning(request, "Не удалось прочитать координаты")
                return redirect(request.path)
        if not(latitude >= 55.503749 and latitude <= 56.009657 and longitude >= 37.345276 and longitude  <= 37.967190):
            messages.warning(request, "Координаты не соответсвуют г. Москве.")
            return redirect(request.path)
        title = request.POST.get("title")
        type = request.POST.get("type")
        short_description = request.POST.get("description")
        description = request.POST.get("description2")
        phone = request.POST.get("phone")
        link = request.POST.get("url")
        price = request.POST.get("price_paid")
        if price == None or price == '':
            price = 0
        else:
            price = int(price)
        coordinates = str(latitude) + ',' + str(longitude)
        address = request.POST.get("address")
        image = request.FILES.get('photo')
        if image == None:
            filename = "default.jpg"
        else:
            filename = str(uuid.uuid4()) + '.' + image.name.split('.')[-1]
            fs = FileSystemStorage()
            saved_filename = fs.save(filename, image)
            # image_path = fs.url(saved_filename)
        check = datetime_add(request)
        if check is False:
            messages.error(request, 'Событие не добавлено! Неверный формат даты!')
            return redirect(request.path)
        elif check == "Wrong":
            messages.error(request, 'Событие не добавлено! Устаревшая дата!')
            return redirect(request.path)
        new_event = Event.objects.create(title=title,
                                         type=type,
                                         tiny_description=short_description,
                                         description=description,
                                         coordinates=coordinates,
                                         address=address,
                                         price=price,
                                         phone=phone,
                                         link=link,
                                         image=filename)
        messages.success(request, 'Событие было успешно добавлено на сайт!')
        return redirect(request.path)
    return render(request, 'dosug/add_event.html', {'form': eventform})

def edit_event(request, id, edit=1):
    event = Event.objects.filter(id = id).first()
    if (not request.user.is_superuser) and (request.user.id != event.author):
        messages.warning(request, "Невозможно получить доступ к странице")
        return redirect('/')
    latitude, longitude = event.coordinates.split(',')
    eventform = EventForm()
    if request.method == "POST":
        latitude_str = request.POST.get("latitude")
        longitude_str = request.POST.get("longitude")
        if latitude_str and longitude_str:
            try:
                latitude = float(latitude_str)
                longitude = float(longitude_str)
            except ValueError:
                messages.warning(request, "Не удалось прочитать координаты")
                return redirect(request.path)
        if not(latitude >= 55.503749 and latitude <= 56.009657 and longitude >= 37.345276 and longitude  <= 37.967190):
            messages.warning(request, "Координаты не соответсвуют г. Москве.")
            return redirect(request.path)
        title = request.POST.get("title")
        type = request.POST.get("type")
        short_description = request.POST.get("description")
        description = request.POST.get("description2")
        DateTimeData.objects.filter(event_id=id).delete()
        check = datetime_add(request, id)
        if check is False:
            messages.error(request, 'Событие не добавлено! Неверный формат даты!')
            return redirect(request.path)
        elif check == "Wrong":
            messages.error(request, 'Событие не добавлено! Устаревшая дата!')
            return redirect(request.path)
        phone = request.POST.get("phone")
        link = request.POST.get("url")
        price = request.POST.get("price_paid")
        if price == "": price = 0
        coordinates = str(latitude) + ',' + str(longitude)
        address = request.POST.get("address")
        image = request.FILES.get('photo')
        new_event = Event.objects.filter(id=id).update(title=title,
                                         type=type,
                                         tiny_description=short_description,
                                         description=description,
                                         coordinates=coordinates,
                                         address=address,
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
    return render(request, 'dosug/add_event.html', {'form': eventform,
                                                    'latitude': latitude,
                                                    'longitude':longitude,
                                                    'event': event,
                                                    'edit': edit})

def datetime_add(request, edit = 0):
    if edit == 0: max_id = Event.objects.aggregate(Max('id'))['id__max'] + 1
    else:
        max_id = edit
    datetime_try = request.POST.get("datetime")
    if datetime_try != "":
        datetime_real = datetime.strptime(datetime_try, "%Y-%m-%dT%H:%M")
        if datetime_real < datetime.now():return "Wrong"
        return DateTimeData.objects.create(event_id=max_id, datetime=datetime_real)

    date_range_from = request.POST.get("date_range_from")
    if date_range_from != "":
        date_range_to = request.POST.get("date_range_to")
        date_range_from_real = datetime.strptime(date_range_from, "%Y-%m-%d")
        date_range_to_real = datetime.strptime(date_range_to, "%Y-%m-%d")
        if date_range_from_real >= date_range_to_real: return False
        if date_range_to_real < datetime.now(): return "Wrong"
        return DateTimeData.objects.create(event_id=max_id, date_range_from=date_range_from_real,
                                           date_range_to=date_range_to_real)

    datetime_from_date = request.POST.get("datetime_from_date")
    if datetime_from_date != "":
        datetime_from_time = request.POST.get("datetime_from_time")
        datetime_to_date = request.POST.get("datetime_to_date")
        datetime_to_time = request.POST.get("datetime_to_time")
        datetime_from_date_real = datetime.strptime(datetime_from_date, "%Y-%m-%d")
        datetime_to_date_real = datetime.strptime(datetime_to_date, "%Y-%m-%d")
        datetime_from_time_real = datetime.strptime(datetime_from_time, "%H:%M")
        datetime_to_time_real = datetime.strptime(datetime_to_time, "%H:%M")
        if datetime_from_date >= datetime_to_date: return False
        if datetime_to_date < datetime.now(): return "Wrong"
        return DateTimeData.objects.create(event_id=max_id,
                                           datetime_from_date=datetime_from_date_real,
                                           datetime_to_date=datetime_to_date_real,
                                           datetime_from_time=datetime_from_time_real,
                                           datetime_to_time=datetime_to_time_real)
    every_day = request.POST.get("daily_fields")
    if every_day != "":
        return DateTimeData.objects.create(event_id=max_id, every_day=every_day)
    return 0

def datetime_view(request, id):
    months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября",
              "ноября", "декабря"]
    date_output = "Не указана"
    date_base = DateTimeData.objects.filter(event_id=id).first()
    if date_base is None: pass
    elif date_base.datetime is not None:
        dt_object = datetime.strptime(str(date_base.datetime), "%Y-%m-%d %H:%M:%S")
        date_output = dt_object.strftime("%d") + " " + months[dt_object.month - 1] + " " + str(dt_object.year) + ", " + dt_object.strftime("%H:%M")
    elif date_base.date_range_from is not None:
        dt_object = datetime.strptime(str(date_base.date_range_from), "%Y-%m-%d")
        dt_object2 = datetime.strptime(str(date_base.date_range_to), "%Y-%m-%d")
        date_output = f'От {dt_object.strftime("%d")} {months[dt_object.month - 1]} {str(dt_object.year)} ' \
                      f'до {dt_object2.strftime("%d")} {months[dt_object2.month - 1]} {str(dt_object2.year)}'
    elif date_base.datetime_from_date is not None:
        dt_object = datetime.strptime(str(date_base.datetime_from_date), "%Y-%m-%d")
        dt_object2 = datetime.strptime(str(date_base.datetime_to_date), "%Y-%m-%d")
        dt_object3 = datetime.strptime(str(date_base.datetime_from_time), "%H:%M:%S")
        dt_object4 = datetime.strptime(str(date_base.datetime_to_time), "%H:%M:%S")
        date_output = f'От {dt_object.strftime("%d")} {months[dt_object.month - 1]} {str(dt_object.year)} ' \
                      f'до {dt_object2.strftime("%d")} {months[dt_object2.month - 1]} {str(dt_object2.year)}, ' \
                      f'{dt_object3.strftime("%H:%M")} - {dt_object4.strftime("%H:%M")}'
    elif date_base.every_day is not None:
        date_output = "Ежедневно"
    return date_output

def delete_event(request, id):
    event = Event.objects.filter(id=id).first()
    if (request.user.is_superuser) or (request.user.id == event.author):
        Event.objects.filter(id=id).delete()
        messages.success(request, 'Событие было успешно удалено')
    else:
        messages.warning(request, 'Не удалось удалить событие')
        return redirect('/')
    return redirect(f'/user_events')


def map(request):
    map_dots = Event.objects.all()
    data = list(map_dots.values())
    file_path = 'static\js\data2.json'
    for item in data:
        item['created_at'] = item['created_at'].strftime("%Y-%m-%d %H:%M:%S")
    new_data = {"features": data}
    with open(file_path, 'w', encoding='utf-8') as json_file:
        json.dump(new_data, json_file, ensure_ascii=False, indent=2)
        return render(request, 'dosug/map.html')

def event_detail(request, id):
    try:
        event = Event.objects.get(id=id)
        event.views_add()
        datetime = datetime_view(request, id)
        return render(request, 'dosug/event.html', {'event': event, 'datetime': datetime})
    except Event.DoesNotExist:
        messages.warning(request, "Событие не найдено")
        return redirect('/')