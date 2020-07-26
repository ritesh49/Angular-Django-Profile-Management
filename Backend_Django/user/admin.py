from django.contrib import admin
from .models import RegisterModel
from django.contrib.sessions.models import Session

''' Registering Model so that it can be validated through django admin panel'''
admin.site.register(RegisterModel)
admin.site.register(Session)
