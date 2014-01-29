""" Copyright 2014, Nutrislice Inc.  All rights reserved """

from django.conf.urls import patterns, url
from locations.views import *

urlpatterns = patterns('',
    url(r'^$', MealLocatorView.as_view()),
)

__author__ = 'troy'
