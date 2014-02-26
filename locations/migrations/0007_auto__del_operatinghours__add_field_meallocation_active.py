# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting model 'OperatingHours'
        db.delete_table(u'locations_operatinghours')

        # Adding field 'MealLocation.active'
        db.add_column(u'locations_meallocation', 'active',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)


    def backwards(self, orm):
        # Adding model 'OperatingHours'
        db.create_table(u'locations_operatinghours', (
            ('weekday_from', self.gf('django.db.models.fields.IntegerField')()),
            ('weekday_to', self.gf('django.db.models.fields.IntegerField')()),
            ('meal_location', self.gf('django.db.models.fields.related.ForeignKey')(related_name='operating_hours', to=orm['locations.MealLocation'])),
            ('to_hour', self.gf('django.db.models.fields.TimeField')()),
            ('from_hour', self.gf('django.db.models.fields.TimeField')()),
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
        ))
        db.send_create_signal(u'locations', ['OperatingHours'])

        # Deleting field 'MealLocation.active'
        db.delete_column(u'locations_meallocation', 'active')


    models = {
        u'locations.locationdetailsection': {
            'Meta': {'ordering': "['order']", 'object_name': 'LocationDetailSection'},
            'header': ('django.db.models.fields.CharField', [], {'max_length': '40', 'blank': 'True'}),
            'icon': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'meal_location': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'location_detail_sections'", 'to': u"orm['locations.MealLocation']"}),
            'notes': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'order': ('django.db.models.fields.PositiveSmallIntegerField', [], {}),
            'sub_header': ('django.db.models.fields.CharField', [], {'max_length': '80', 'blank': 'True'})
        },
        u'locations.meallocation': {
            'Meta': {'object_name': 'MealLocation'},
            'active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'address': ('django_google_maps.fields.AddressField', [], {'max_length': '100'}),
            'geolocation': ('django_google_maps.fields.GeoLocationField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '60'}),
            'notes': ('django.db.models.fields.TextField', [], {'blank': 'True'})
        }
    }

    complete_apps = ['locations']