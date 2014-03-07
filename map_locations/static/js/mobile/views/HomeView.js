/**
 * Copyright 2014, Nutrislice Inc.  All rights reserved.
 */
define([
    'jquery',
    'backbone',
    'underscore',
    'app',
    'models/MapLocation',
    'views/GoogleMapView',
    'text!templates/HomeView.jst',
    'lib/jquery.browser-info',
    'lib/jockey',
    'lib/jockey.alerts',
    'lib/jquery.geocomplete.min'
],
function($, Backbone, _, app, MapLocation, GoogleMapView, templateText) {
    return Backbone.View.extend({
        id: 'home-page',
        events: {
            'click #btn-use-specific-location': 'lookUpGeolocationByEnteredAddress'
        },
        $mapInstructions: $('<div id="map-instructions">Pick a summer feeding side below to find some delicious food!</div>'),
        userAddress: null,
        userGeolocation: null,
        initialize: function(options) {
            var MapLocations = Backbone.Collection.extend({
                model: MapLocation,
                baseUrl: '/api/locations/active/'
            }),
            that = this;
            this.mapLocations = new MapLocations([]);
            this.mapLocations.on('sync', this.renderMap, this);

            if (app.isRunningInMobileApp) {
                // If running in the wrapper app, the app will ask for location permission separate
                // from the site (i.e. if the site asks, BOTH will ask), so we'll just let the
                // app control it instead and pass info to the site.
                Jockey.on("updateUserLocation", function(position) {
                    Jockey.off('updateUserLocation');
                    that.userGeolocation = position;
                    that.lookUpAddressByGeolocation(position);
                });
            }
            else {
                if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function(pos) {
                    that.userGeolocation = pos.coords;
                    that.lookUpAddressByGeolocation(pos.coords);
                }, function(error) {
                    // Map is already rendered w/o the position. Nothing to do...
                    console.log("Error while retrieving user's current location: " + error);
                }, {
                    timeout: 10000
                });
            }
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
                if (app.isRunningInMobileApp) {
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
            this.$mapInstructions.html('Showing meal locations near')
            this.$mapInstructions.append('<div class="selected-address">' + app.selectedLocation.address.replace(/,\s?/, '<br>') + '</div>');
            $pageContent.html(this.$mapInstructions);
            var mapInstructionsHeight = this.$mapInstructions.outerHeight(),
                maxMapHeight = this.getMaxMapHeight(mapInstructionsHeight),
                googleMapView = new GoogleMapView({
                    markerModels: this.mapLocations.models,
                    maxHeight: maxMapHeight
                });
            $pageContent.append(googleMapView.render().$el);
            $('body').scrollTop(0);
        },
        fetchMapLocationsNearSelectedLocation: function () {
            var that = this;
            that.mapLocations.url = that.mapLocations.baseUrl + '?near=' + app.selectedLocation.geolocationStr();
            that.mapLocations.fetch({
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
            app.selectedLocation.address = this.userAddress;
            app.selectedLocation.geolocation = this.userGeolocation;
            this.fetchMapLocationsNearSelectedLocation();
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
                    that.useCurrentUserLocation();
                });
            });
        },
        lookUpGeolocationByEnteredAddress: function() {
            var that = this,
                address = that.$('#address').val(),
                geolocation = null;
            Jockey.off('updateUserLocation');
            app.selectedLocation.address = address;
            that.geocoder.geocode({'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                    var result = results[0];
                    if (result && result.geometry && result.geometry.location) {
                        var latlng = result.geometry.location,
                            geolocation = {
                                'latitude': latlng.d,
                                'longitude': latlng.e
                            };
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
                    app.selectedLocation.geolocation = geolocation;
                    that.fetchMapLocationsNearSelectedLocation();
                }
            });
        }
    });
});