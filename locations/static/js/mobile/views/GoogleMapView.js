/**
 * Copyright 2014, Nutrislice Inc.  All rights reserved.
 */
define([
    'jquery',
    'backbone',
    'underscore',
    'app',
    'views/GoogleMapInfoWindowView',
    'lib/jockey'
    //'lib/jquery.dark-overlay'
],
function($, Backbone, _, app, GoogleMapInfoWindowView) {
    return Backbone.View.extend({
        id: 'map-canvas',
        events: {
        },
        map: null,
        markerModels: [],
        maxHeight: null,
        allLatitudes: [],
        allLongitudes: [],
        currentLocationMarker: null,
        infoWindowView: null,
        latestSelectedMarker: null,
        initialize: function(options) {
            _.bindAll(this, 'updateCurrentPositionOnMap');
            var that = this;
            this.markerModels = options.markerModels;
            this.maxHeight = options.maxHeight;
            this.$el.height(this.maxHeight);
            that.extractAllLatitudesAndLongitudes();

            Jockey.on("updateUserLocation", function(payload) {
                that.updateCurrentPositionOnMap(that.map, payload);
            });
            this.infoWindowView = new GoogleMapInfoWindowView({mapView: this});
            this.infoWindowView.on('showMobileInfoWindow', this.mobileInfoWindowShown, this);
        },
        extractAllLatitudesAndLongitudes: function() {
            this.allLatitudes = this.markerModels.map(function(model) {
                return model.latitude();
            });
            this.allLatitudes = _.without(this.allLatitudes, null);

            this.allLongitudes = this.markerModels.map(function(model) {
                return model.longitude();
            });
            this.allLongitudes = _.without(this.allLongitudes, null);
        },
        addMarker: function(markerModel, map) {
            var that = this,
                position = new google.maps.LatLng(markerModel.latitude(), markerModel.longitude()),
                marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: markerModel.name()
                });
            google.maps.event.addListener(marker, 'click', function() {
                that.latestSelectedMarker = marker;
                if (that.infoWindowView)
                    that.infoWindowView.open(marker, markerModel);
            });
        },
        addMarkers: function(markerModels, map) {
            for (var i=0; i<markerModels.length; i++) {
                var markerModel = markerModels[i];
                this.addMarker(markerModel, map);
            }
        },
        updateCurrentPositionOnMap: function(map, position, mapDimentions) {
            var updateMapZoomLevel = false;
            if (this.currentLocationMarker === null) {
                this.currentLocationMarker = new google.maps.Marker({
                    clickable: false,
                    icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                                                    new google.maps.Size(22,22),
                                                                    new google.maps.Point(0,18),
                                                                    new google.maps.Point(11,11)),
                    shadow: null,
                    zIndex: 999,
                    map: map
                });
                updateMapZoomLevel = true;
            }
            var me = new google.maps.LatLng(position.latitude, position.longitude);
            this.currentLocationMarker.setPosition(me);

            if (updateMapZoomLevel) {
                if (typeof mapDimentions === 'undefined') {
                    mapDimentions = {
                        height: this.$el.height() > 0 ? this.$el.height()-15 : $(window).height() - 15,
                        width: this.$el.width() > 0 ? this.$el.width()-15 : $(window).width() - 15
                    };
                }
                this.updateMapZoomLevelToIncludeCurrentUserPosition(map, position, mapDimentions);
            }
        },
        getCurrentPosition: function() {
            if (!this.currentLocationMarker)
                return null;
            else
                return this.currentLocationMarker.getPosition();
        },
        setCurrentLocationIfPossible: function(map, mapDimentions) {
            var that = this;

            // If running in the wrapper app, it will ask for location permission separate
            // from the site (i.e. if the site asks, BOTH will ask), so we'll just let the
            // app control it instead and pass info to the site.
            if (!app.isRunningInWrapperApp) {
                if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function(pos) {
                    that.updateCurrentPositionOnMap(map, pos.coords, mapDimentions);
                }, function(error) {
                    // Map is already rendered w/o the position. Nothing to do...
                    console.log("Error while retrieving user's current location: " + error);
                }, {
                    timeout: 10000
                });
            }
        },
        getAverageValues: function(arr) {
            if (!arr || arr.length === 0)
                return 0;

            return _.reduce(arr, function(currentSum, nextValue) {
                return currentSum + nextValue;
            }, 0) / arr.length;
        },
        calculateCenterOfMarkers: function() {
            var averageLatitude = this.getAverageValues(this.allLatitudes),
                averageLongitude = this.getAverageValues(this.allLongitudes);
            return new google.maps.LatLng(averageLatitude,averageLongitude);
        },
        getBoundsZoomLevel: function(minLatitude, maxLatitude, minLongitude, maxLongitude, mapDim) {
            // Uses technique from http://stackoverflow.com/questions/6048975/google-maps-v3-how-to-calculate-the-zoom-level-for-a-given-bounds#answer-13274361
            var WORLD_DIM = { height: 256, width: 256 };
            var ZOOM_MAX = 21;

            function latRad(lat) {
                var sin = Math.sin(lat * Math.PI / 180);
                var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
                return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
            }

            function zoom(mapPx, worldPx, fraction) {
                return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
            }
            var maxLatRad = latRad(maxLatitude),
                minLatRad = latRad(minLatitude),
                latFraction = (maxLatRad - minLatRad) / Math.PI;

            var lngDiff = maxLongitude - minLongitude;
            var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

            var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
            var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

//            setTimeout(function() {
//                alert('Zoom calculator...\nlatZoom: ' + latZoom + '\nlngZoom: ' + lngZoom
//                 + '\nZOOM_MAX: ' + ZOOM_MAX + '\nlatFraction: ' + latFraction + '\nlngDiff: '
//                 + lngDiff + '\nlngFraction: ' + lngFraction + '\nmaxLatRad: ' + maxLatRad
//                 + '\nminLatRad: ' + minLatRad + '\nmapHeight: ' + mapDim.height + '\nmapWidth: ' + mapDim.width);
//            }, 6000);
            return Math.min(latZoom, lngZoom, ZOOM_MAX);
        },
        calculateAppropriateZoomLevel: function(mapDimentions) {
            var maxLatitude = _.max(this.allLatitudes),
                minLatitude = _.min(this.allLatitudes),
                maxLongitude = _.max(this.allLongitudes),
                minLongitude = _.min(this.allLongitudes),
                zoom = this.getBoundsZoomLevel(minLatitude, maxLatitude, minLongitude, maxLongitude, mapDimentions);
            return zoom;
        },
        updateMapZoomLevelToIncludeCurrentUserPosition: function(map, currentUserPosition, mapDimentions) {
            this.allLatitudes.push(currentUserPosition.latitude);
            this.allLongitudes.push(currentUserPosition.longitude);
            var zoom = this.calculateAppropriateZoomLevel(mapDimentions);
            map.setZoom(zoom);
            map.setCenter(this.calculateCenterOfMarkers());
        },
        render: function() {
            var mapOptions = {
                    center: this.calculateCenterOfMarkers(),
                    scrollwheel: false
                },
                map = new google.maps.Map(this.el, mapOptions),
                mapDimentions = {
                    height: this.$el.height() > 0 ? this.$el.height()-15 : $(window).height() - 15,
                    width: this.$el.width() > 0 ? this.$el.width()-15 : $(window).width() - 15
                };
            this.map = map;
            this.addMarkers(this.markerModels, map);
            map.setZoom(this.calculateAppropriateZoomLevel(mapDimentions));
            this.setCurrentLocationIfPossible(map, mapDimentions);
            return this;
        },
        mobileInfoWindowShown: function() {
            var that = this,
                $window = $(window),
                $body = $(document.body),
                closeInfoWindowScrollPos = 100,
                infoWindowZoomLevel = 16;

            // Show the info window
            $body.animate({
                'scrollTop': this.infoWindowView.$el.offset().top
            }, 700);
//            that.$el.darken({
//                'opacity': 0.25,
//                'fadeInDuration': 700,
//                'useRadialGradient': true
//            });

            // Center & zoom in the map
            var centerPosition = new google.maps.LatLng(this.latestSelectedMarker.position.lat() + 0.0025, this.latestSelectedMarker.position.lng())
            this.map.setCenter(centerPosition);
            var previousZoom = this.map.getZoom();
            this.map.setZoom(infoWindowZoomLevel);

            // Detect when the user pushes the info window out of the way - restore the previous zoom level and remove the info window.
            setTimeout(function() {
                $window.bind('scroll', function() {
                    if ($body.scrollTop() < closeInfoWindowScrollPos) {
                        $window.unbind('scroll');
                        console.log('' + $body.scrollTop() + ' is less than ' + closeInfoWindowScrollPos + '. Closing Info window...');

                        // Finish scrolling
                        $body.animate({
                            'scrollTop': 0
                        }, 200);
                        that.infoWindowView.close();

                        // Restore previous zoom
                        var currentZoom = that.map.getZoom();
                        if (currentZoom == infoWindowZoomLevel && currentZoom > previousZoom) // Only restore the previous zoom level if the user hasn't messed with it.
                            that.map.setZoom(previousZoom);
//                        that.$el.undarken(200);
                    }
    //                else
    //                    console.log('' + $body.scrollTop() + ' is NOT less than ' + closeInfoWindowScrollPos);
                });
            }, 500);
        }
    });
});