// Prevent the enter and backspace key from navigating away from or submitting a form..
(function($) {
    $(function(){
        var keyStop = {
            8: ":not(input:text, textarea, input:file, input:password, input[type=colorpicker])", // stop backspace = back
            13: "input:text, input:password, input[type=colorpicker]", // stop enter = submit

            end: null
        };
        if ($('body').hasClass('change-form')) {
            $(document).bind("keydown", function(event){

                var selector = keyStop[event.which];

                if(selector !== undefined && $(event.target).is(selector)) {
                    event.preventDefault(); //stop event
                }
                return true;
            });
        }
    });
}(jQuery));
