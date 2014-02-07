(function($) {
    $(function(){
        var $addressFld = $('#id_address'),
            $geolocationFld = $('#id_geolocation'),
            $map = $('<div id="map_preview" style="width: 500px; height: 300px;"></div>'),
            mapStartingLocation = $addressFld.val(),
            hasInitialAddress = mapStartingLocation != null && mapStartingLocation !== '',
            addMarkerManagementToMapsApi = function() {
                // Google's v3 api doesn't allow easy access to current markers on the
                // map.  This fixes that.
                google.maps.Map.prototype.markers = new Array();
                google.maps.Map.prototype.getMarkers = function() {
                    return this.markers
                };
                google.maps.Map.prototype.clearMarkers = function() {
                    for(var i=0; i<this.markers.length; i++){
                        this.markers[i].setMap(null);
                    }
                    this.markers = new Array();
                };
                google.maps.Marker.prototype._setMap = google.maps.Marker.prototype.setMap;
                google.maps.Marker.prototype.setMap = function(map) {
                    if (map) {
                        map.markers[map.markers.length] = this;
                    }
                    this._setMap(map);
                }
            },
            configureMap = function() {
                if (!mapStartingLocation) {
                    var defaultCenter = new google.maps.LatLng(39.368279,-96.707153);
                    mapStartingLocation = defaultCenter;
                }

                $map.insertAfter($addressFld);

                $addressFld.geocomplete({
                    map: '#map_preview',
                    location: mapStartingLocation,
                    mapOptions: {
                        zoom: 14,
                        mapTypeId: google.maps.MapTypeId.HYBRID
                    },
                    markerOptions: {
                        draggable: true
                    }
                })
                .bind('geocode:result', function(event, result) {
                    var location = result.geometry.location,
                        geolocation = '' + location.d + ',' + location.e;
                    $geolocationFld.val(geolocation);
                })
                .bind('geocode:dragged', function(event, location) {
                    var geolocation = '' + location.d + ',' + location.e;
                    $geolocationFld.val(geolocation);
                });
            },
            getGeolocationLatLng = function() {
                var geolocationStr = $geolocationFld.val(),
                    latLng;
                if (geolocationStr && geolocationStr.length) {
                    var latlong = geolocationStr.split(',');
                    latLng = new google.maps.LatLng(latlong[0], latlong[1]);
                }
                else
                    latLng = null;
                return latLng
            },
            onMapConfigured = function() {
                var map = $addressFld.geocomplete('map');
                if (!hasInitialAddress) {
                    // The only way I could find to get the map to draw initially when
                    // there is no starting location is to temporarily add a starting
                    // location.
                    // This code removes that starting marker so all that is left is
                    // an empty map.
                    map.clearMarkers();
                    map.setZoom(3);
                }
                else {
                    // I'm not sure why the initial mapOptions.zoom property doesn't work,
                    // and I'm not sure why the default zoom level is other-than 14, like
                    // the documentation claims (https://github.com/ubilabs/geocomplete)...
                    // but manually setting the zoom seems to work.
                    setTimeout(function() {
                        map.setZoom(14);
                        var latLng = getGeolocationLatLng();
                        if (latLng)
                            map.setCenter(latLng);
                    }, 1000);
                }
            },
            geocoder = new google.maps.Geocoder(),
            lookUpAddressByGeolocation = function() {
                var latLng = getGeolocationLatLng();
                if (latLng) {
                    geocoder.geocode({'latLng': latLng}, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                var formattedAddress = results[0].formatted_address;
                                $addressFld.val(formattedAddress);
                            }
                        }
                    });
                }
            },
            addLookUpAddressButtonToGeolocationFld = function() {
                var $lookUpAddress = $('<a id="look-up-address-btn" href="javascript:void(0);" style="padding: 2px 0 0 7px;">Update Address from Geolocation</a>');
                $geolocationFld.after($lookUpAddress);
                $lookUpAddress.click(function() {
                    lookUpAddressByGeolocation();
                });
            };
        addMarkerManagementToMapsApi();
        configureMap();
        onMapConfigured();
        addLookUpAddressButtonToGeolocationFld();
    });
}(jQuery));
