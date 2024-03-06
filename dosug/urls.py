from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),
    path('events', views.music),
    path('events/<str:type>', views.music),
    path('events/all/<str:sort>', views.music2),
    path('events/<str:type>/<str:sort>', views.music),
    path('map', views.map),
    path('test', views.test),
    path('add_event', views.add_event),
    path('event/<int:id>', views.event_detail),
    path('random_event', views.random_event)
]
