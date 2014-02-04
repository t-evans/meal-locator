# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'OperatingHours'
        db.create_table(u'locations_operatinghours', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('meal_location', self.gf('django.db.models.fields.related.ForeignKey')(related_name='operating_hours', to=orm['locations.MealLocation'])),
            ('weekday_from', self.gf('django.db.models.fields.IntegerField')(unique=True)),
            ('weekday_to', self.gf('django.db.models.fields.IntegerField')()),
            ('from_hour', self.gf('django.db.models.fields.TimeField')()),
            ('to_hour', self.gf('django.db.models.fields.TimeField')()),
        ))
        db.send_create_signal(u'locations', ['OperatingHours'])


    def backwards(self, orm):
        # Deleting model 'OperatingHours'
        db.delete_table(u'locations_operatinghours')


    models = {
        u'locations.meallocation': {
            'Meta': {'object_name': 'MealLocation'},
            'address': ('django_google_maps.fields.AddressField', [], {'max_length': '254'}),
            'geolocation': ('django_google_maps.fields.GeoLocationField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '254'})
        },
        u'locations.operatinghours': {
            'Meta': {'object_name': 'OperatingHours'},
            'from_hour': ('django.db.models.fields.TimeField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'meal_location': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'operating_hours'", 'to': u"orm['locations.MealLocation']"}),
            'to_hour': ('django.db.models.fields.TimeField', [], {}),
            'weekday_from': ('django.db.models.fields.IntegerField', [], {'unique': 'True'}),
            'weekday_to': ('django.db.models.fields.IntegerField', [], {})
        }
    }

    complete_apps = ['locations']