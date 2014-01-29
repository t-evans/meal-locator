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
    return Backbone.Model.extend({
        name: function() {
            return this.get('name');
        },
        address: function() {
            return this.get('address');
        },
        latitude: function() {
            return this.get('latitude');
        },
        longitude: function() {
            return this.get('longitude');
        }
    });
});
