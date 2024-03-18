from django import forms
from .models import DateTimeData

class DateTimeDataForm(forms.ModelForm):
    class Meta:
        model = DateTimeData
        fields = '__all__'

class EventForm(forms.Form):
    title = forms.CharField()
    type = forms.CharField()
    description = forms.CharField()
    coordinates = forms.CharField()
    address = forms.CharField()

