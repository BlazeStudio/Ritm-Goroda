from django import forms


class EventForm(forms.Form):
    title = forms.CharField()
    type = forms.CharField()
    description = forms.CharField()
    coordinates = forms.CharField()
    address = forms.CharField()