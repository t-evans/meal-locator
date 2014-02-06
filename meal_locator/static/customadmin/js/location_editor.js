(function($) {
    $(function(){
        var $addressFld = $('#id_address'),
            $geolocationFld = $('#id_geolocation'),
            $map = $('<div id="map_preview" style="width: 500px; height: 300px;"></div>');

        // Add the "data-geo" attribute so the plugin can automatically update those
        // fields when a value is selected (see "dataAttribute" below).
        $addressFld.data('geo');
        $geolocationFld.data('geo');

        $map.insertAfter($addressFld);
        $addressFld.geocomplete({
            map: '#map_preview',
            location: $addressFld.val(),
            mapOptions: {
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
        });
    });
}(jQuery));
