from django.conf.urls import patterns, include, url
from django.conf import settings

from locations.api.views import *

urlpatterns = patterns('',
    url(r'^meals/$', MealLocationAPIView.as_view()),
)
