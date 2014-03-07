(function($) {
    $(function(){
        var $addressFld = $('#id_address');
        if (!$addressFld.length) {
            // Must be on the list page, rather than the editor.
            return;
        }
        var addressFieldValueOnPageLoad = $addressFld.val(),
            $geolocationFld = $('#id_geolocation'),
            $latitudeFld = $('#id_geolocation_0'),
            $longitudeFld = $('#id_geolocation_1'),
            $map = $('<div id="map_preview" style="width: 500px; height: 300px;"></div>'),
            mapStartingLatitude = $latitudeFld.val(),
            mapStartingLongigude = $longitudeFld.val(),
            mapStartingLocation = $geolocationFld.val(),
            hasInitialAddress = mapStartingLatitude != null && mapStartingLatitude !== '' && mapStartingLongigude && mapStartingLongigude !== '',
            userManuallyChangedAddress = false,
            configureMap = function() {
                if (hasInitialAddress)
                    mapStartingLocation = new google.maps.LatLng(mapStartingLatitude, mapStartingLongigude)
                else {
                    var defaultCenter = new google.maps.LatLng(39.368279,-96.707153);
                    mapStartingLocation = defaultCenter;
                }

                $map.insertAfter($addressFld);
                $addressFld.keyup(function() {
                    userManuallyChangedAddress = true;
                    addressFieldValueOnPageLoad = $addressFld.val();
                });

                $addressFld.geocomplete({
                    map: '#map_preview',
                    location: mapStartingLocation,
                    mapOptions: {
                        zoom: 16, // This field is in the documentation, but it is ignored here. Best you can do is programmatically change the zoom level after the map has loaded (see onMapLoaded(), below).
                        mapTypeId: google.maps.MapTypeId.HYBRID
                    },
                    markerOptions: {
                        draggable: true
                    }
                })
                .bind('geocode:result', function(event, result) {
                    var location = result.geometry.location;
                    $latitudeFld.val(location.d);
                    $longitudeFld.val(location.e);

                    // Geocomplete overwrites (on page load) the user-entered address with whatever the pin
                    // is pointed to initially (if anything).  geocomplete then triggers this event.
                    // The below restores the address value to what it should be.
                    $addressFld.val(addressFieldValueOnPageLoad);
                })
                .bind('geocode:dragged', function(event, location) {
                    $latitudeFld.val(location.d);
                    $longitudeFld.val(location.e);
                });
                var map = $addressFld.geocomplete('map');
                google.maps.event.addListenerOnce(map, 'idle', function() { // Fired the first time google maps stops loading stuff (see http://stackoverflow.com/questions/832692/how-can-i-check-whether-google-maps-is-fully-loaded).
                    onMapLoaded();
                });
            },
            getGeolocationLatLng = function() {
                var latitudeStr = $latitudeFld.val(),
                    longitudeStr = $longitudeFld.val(),
                    latLng;
                if (latitudeStr && longitudeStr && latitudeStr.length && longitudeStr.length) {
                    latLng = new google.maps.LatLng(latitudeStr, longitudeStr);
                }
                else
                    latLng = null;
                return latLng
            },
            onMapLoaded = function() {
                var map = $addressFld.geocomplete('map');

                if (!hasInitialAddress) {
                    // The only way I could find to get the map to draw initially when
                    // there is no starting location is to temporarily add a starting
                    // location.
                    // This code removes that starting marker so all that is left is
                    // an empty map.
                    var marker = $addressFld.geocomplete('marker');
                    marker.setMap(null);
                    $addressFld.geocomplete('initMarker');
                    map.setZoom(3);
                }
                else {
                    // I'm not sure why the initial mapOptions.zoom property doesn't work,
                    // and I'm not sure why the default zoom level is other-than 14, like
                    // the documentation claims (https://github.com/ubilabs/geocomplete)...
                    // but manually setting the zoom seems to work.
                    //map.setZoom(14);
                    var latLng = getGeolocationLatLng();
                    if (map && latLng)
                        map.setCenter(latLng);
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
            addUpdateAddressFromGeolocationButton = function() {
                var $lookUpAddress = $('<a id="look-up-address-btn" class="ui-state-default ui-corner-all" href="javascript:void(0);" title="If you’ve moved the pin, click here to update the address, above, to the pin’s new location.">Update Address from pin</a>');
                $map.after($lookUpAddress);
                $lookUpAddress.click(function() {
                    lookUpAddressByGeolocation();
                });
            },
            hideGeolocationField = function() {
                $('div.geolocation').hide();
            };
        configureMap();
        addUpdateAddressFromGeolocationButton();
        hideGeolocationField();
    });
}(jQuery));
