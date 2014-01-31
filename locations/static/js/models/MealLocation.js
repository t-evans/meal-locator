/**
 * Copyright 2014, Nutrislice Inc.  All rights reserved.

 * User: troy
 * Date: 1/29/14
 */

define([
    'underscore',
    'backbone',
    'app'
],
function(_, Backbone, app) {
    var geocoder = new google.maps.Geocoder();
    return Backbone.Model.extend({
        name: function() {
            return this.get('name');
        },
        lookupAddressByCoords: function() {
            // Fires an "addressReceived" event if/when it can look up the address by location.
            var that = this,
                latlng = new google.maps.LatLng(this.latitude(), this.longitude());
            geocoder.geocode({'latLng': latlng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        that.set('address', results[0].formatted_address);
                    }
                }
            });
        },
        address: function() {
            var address = this.get('address');
            if (address) {
                if (address.indexOf('\n') < 0 && address.indexOf(',') > 0) {
                    address = address.replace(/,\s?/, '<br>');
                }
            }
            return address;
        },
        latitude: function() {
            return this.get('latitude');
        },
        longitude: function() {
            return this.get('longitude');
        }
    });
});
