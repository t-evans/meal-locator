(function($) {
    /*
     Adds a dark overlay to each of the selected elements.
    Example usage:
        $('SELECTOR').darken();
        which is equivalent to...
        $('SELECTOR').darken(0.5);
        which is equivalent to...
        $('SELECTOR').darken({
            'opacity': 0.5,
            'allowClickThrough': true
        });

        $('SELECTOR').undarken();
     */
    var OVERLAY_ID_KEY = 'darkOverlayId',
        addDarkOverlay = function($elementToDarken, opts) {
            var elementZIndex = $elementToDarken.css('z-index'),
                overlayId = Math.random().toString(36).substring(7);
            if (elementZIndex === 'auto')
                elementZIndex = 0;
            var elementOffset = $elementToDarken.offset(),
                $overlay = $('<div id="' + overlayId + '"></div>'),
                existingOverlayId = $elementToDarken.data(OVERLAY_ID_KEY);

            // Check if there is already an overlay, and remove it.
            if (existingOverlayId)
                $('#' + existingOverlayId).remove();

            // Add the new overlay
            $overlay.css({
                'background-color': 'rgba(0,0,0,' + opts.opacity + ')',
                'z-index': elementZIndex + 1,
                'position': 'absolute',
                'top': elementOffset.top,
                'left': elementOffset.left,
                'width': $elementToDarken.outerWidth(),
                'height': $elementToDarken.outerHeight()
            });
//            $overlay.css('background-color', 'rgba(0,0,0,0.5)');
            if (opts.allowClickThrough)
                $overlay.css('pointer-events', 'none');
            $elementToDarken.data(OVERLAY_ID_KEY, overlayId);

            $overlay.hide();
            $('body').prepend($overlay);
            $overlay.fadeIn(opts.fadeInDuration);
        };

    $.fn.darken = function(opts) {
        var $$ = this;
        if (typeof opts === 'undefined')
            opts = {};
        else if (!isNaN(parseInt(opts))) {
            opts = {'opacity': opts};
        }
        var options = $.extend({
            'opacity': 0.5,
            'allowClickThrough': true,
            'fadeInDuration': 0
        }, opts);
        $$.each(function() {
            addDarkOverlay($(this), options);
        });
        return $$;
    };

    $.fn.undarken = function(fadeOutDuration) {
        var $this = $(this),
            overlayId = $this.data(OVERLAY_ID_KEY),
            $overlay = $('#' + overlayId);
        if (typeof fadeOutDuration === 'undefined')
            fadeOutDuration = 0;
        $overlay.fadeOut(fadeOutDuration, function() {
            $overlay.remove();
        });
        $this.data(OVERLAY_ID_KEY, null);
    };

    $.fn.toggleOverlay = function() {
        var overlayId = $(this).data(OVERLAY_ID_KEY);
        if (overlayId)
            this.undarken();
        else
            this.darken();
    };
}(jQuery));