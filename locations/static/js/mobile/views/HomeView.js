/**
 * Copyright 2014, Nutrislice Inc.  All rights reserved.
 */
define([
    'jquery',
    'backbone',
    'underscore',
    'app',
    'models/MealLocation',
    'views/GoogleMapView',
    'text!templates/HomeView.jst',
    'lib/jquery.browser-info',
    'lib/jockey',
    'lib/jockey.alerts',
    'lib/jquery.geocomplete.min'
],
function($, Backbone, _, app, MealLocation, GoogleMapView, templateText) {
    return Backbone.View.extend({
        id: 'home-page',
        events: {
            'click #btn-use-specific-location': 'lookUpGeolocationByEnteredAddress'
        },
        $mapInstructions: $('<div id="map-instructions">Pick a summer feeding side below to find some delicious food!</div>'),
        userGeolocation: null,
        initialize: function(options) {
            var MealLocations = Backbone.Collection.extend({
                model: MealLocation,
                baseUrl: '/api/locations/meals/'
            }),
            that = this;
            this.mealLocations = new MealLocations([]);
            this.mealLocations.on('sync', this.renderMap, this);

            Jockey.on("updateUserLocation", function(position) {
                Jockey.off('updateUserLocation');
                that.userGeolocation = '' + position.latitude + ',' + position.longitude;
                that.lookUpAddressByGeolocation(position);
            });
        },
        template: _.template(templateText),
        render: function() {
            var $pageContent = $('#page-content'),
                html = this.template();
            this.$el.append(html);
            $pageContent.html(this.$el);
            var $addressFld = this.$('#address');
            $addressFld.geocomplete();
            return this;
        },
        getMaxMapHeight: function(mapInstructionsHeight) {
            var maxMapHeight = $(window).height() - mapInstructionsHeight;
            if ($.browser.isIosDevice) {
                if (app.isRunningInWrapperApp) {
                    maxMapHeight -= 20;
                }
                else {
                    if ($.browser.isIos7) {
                        maxMapHeight -= 80;
                    }
                    else
                        maxMapHeight -= 65;
                }
            }
            return maxMapHeight;
        },
        renderMap: function() {
            var $pageContent = $('#page-content');
            $pageContent.html(this.$mapInstructions);
            var mapInstructionsHeight = this.$mapInstructions.outerHeight(),
                maxMapHeight = this.getMaxMapHeight(mapInstructionsHeight),
                mealLocationMapView = new GoogleMapView({
                    markerModels: this.mealLocations.models,
                    maxHeight: maxMapHeight
                });
            $pageContent.append(mealLocationMapView.render().$el);
        },
        fetchMealLocationsNearGeolocation: function (geolocation) {
            var that = this;
            that.mealLocations.url = that.mealLocations.baseUrl + '?near=' + geolocation;
            that.mealLocations.fetch({
                error: function () {
                    var $msg = $('<p id="map-instructions">We\'re sorry, we encountered an unexpected error while attempting to retrieve the current meal locations. Click <a href="javascript:void(0);">here</a> to try again.  If the problem persists, please contact support@nutrislice.com.</p>'),
                        $reloadLink = $msg.find('a');
                    $reloadLink.click(function () {
                        location.reload();
                    });
                    $('#page-content').html($msg);
                }
            });
        },
        geocoder: new google.maps.Geocoder(),
        useCurrentUserLocation: function() {
            app.selectedUserAddress = this.userAddress;
            app.selectedUserGeolocation = this.userGeolocation;
            this.fetchMealLocationsNearGeolocation(app.selectedUserGeolocation);
        },
        lookUpAddressByGeolocation: function(geolocation) {
            var that = this,
                latLng = new google.maps.LatLng(geolocation.latitude, geolocation.longitude);
            this.geocoder.geocode({'latLng': latLng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK && results[0]) {
                    that.userAddress = results[0].formatted_address;
                }
                else
                    that.userAddress = '' + geolocation.latitude + ',' + geolocation.longitude;
                that.$('#user-current-address').html(that.userAddress);
                var $useCurrLocationBtn = that.$('#btn-use-current-location');
                $useCurrLocationBtn.removeClass('disabled');
                $useCurrLocationBtn.click(function() {
                    that.useCurrentUserLocation()
                });
            });
        },
        lookUpGeolocationByEnteredAddress: function() {
            var that = this,
                address = that.$('#address').val(),
                geolocation = null;
            Jockey.off('updateUserLocation');
            app.selectedUserAddress = address;
            that.geocoder.geocode({'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                    var result = results[0];
                    if (result && result.geometry && result.geometry.location) {
                        var latlng = result.geometry.location,
                            geolocation = '' + latlng.d + ',' + latlng.e;
                    }
                }
                if (typeof geolocation === 'undefined') {
                    var msg = 'Unable to look up the location of the provided address.  ' +
                        'This could be a problem with your Internet connection, or is ' +
                        'could be an address that doesn\'t exist.  If the problem persists, ' +
                        'please contact support@nutrislice.com.';
                    app.displayAlert(msg, function() {
                    }, 'Address not recognized.');
                }
                else {
                    app.selectedUserGeolocation = geolocation;
                    that.fetchMealLocationsNearGeolocation(geolocation);
                }
            });
        }
    });
});