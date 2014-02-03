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
                existingOverlayId = $elementToDarken.data(OVERLAY_ID_KEY),
                top = opts.includeMargins ? elementOffset.top - parseInt($elementToDarken.css('marginTop')) : elementOffset.top,
                left = opts.includeMargins ? elementOffset.left - parseInt($elementToDarken.css('marginLeft')) : elementOffset.left;

            // Check if there is already an overlay, and remove it.
            if (existingOverlayId)
                $('#' + existingOverlayId).remove();

            // Add the new overlay
            $overlay.css({
                'background-color': 'rgba(0,0,0,' + opts.opacity + ')',
                'z-index': elementZIndex + 1,
                'position': 'absolute',
                'top': top,
                'left': left,
                'width': $elementToDarken.outerWidth(opts.includeMargins),
                'height': $elementToDarken.outerHeight(opts.includeMargins)
            });
            if (opts.allowClickThrough)
                $overlay.css('pointer-events', 'none');
            if (opts.useRadialGradient)
                $overlay.css('background-image', '-webkit-radial-gradient(50% 80%, circle farthest-side, rgba(255,255,255,' + opts.opacity + ') 0%, rgba(0,0,0,' + opts.opacity + ') 100%)');
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
            'fadeInDuration': 0,
            'useRadialGradient': false,
            'includeMargins': false
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