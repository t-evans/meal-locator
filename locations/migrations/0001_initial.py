# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'MealLocation'
        db.create_table(u'locations_meallocation', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=254)),
            ('address', self.gf('django_google_maps.fields.AddressField')(max_length=254)),
            ('geolocation', self.gf('django_google_maps.fields.GeoLocationField')(max_length=100)),
        ))
        db.send_create_signal(u'locations', ['MealLocation'])


    def backwards(self, orm):
        # Deleting model 'MealLocation'
        db.delete_table(u'locations_meallocation')


    models = {
        u'locations.meallocation': {
            'Meta': {'object_name': 'MealLocation'},
            'address': ('django_google_maps.fields.AddressField', [], {'max_length': '254'}),
            'geolocation': ('django_google_maps.fields.GeoLocationField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '254'})
        }
    }

    complete_apps = ['locations']