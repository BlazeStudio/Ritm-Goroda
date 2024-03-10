from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),
    path('events', views.event_list),
    path('events/<str:type>', views.event_list),
    path('events/<str:type>/<str:sort>', views.event_list),
    path('map', views.map),
    path('test', views.test),
    path('add_event', views.add_event),
    path('event/<int:id>', views.event_detail),
    path('random_event', views.random_event),
    path('login', views.user_login),
    path('logout', views.user_logout),
    path('register', views.user_register)
]
