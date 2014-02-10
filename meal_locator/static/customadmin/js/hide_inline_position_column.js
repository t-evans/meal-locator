/**
 * Hides the column containing an input with the name "position" or the name "order".
 */

(function($) {
    $(function(){
        $('.grp-th.order').hide();
        $('.grp-td.order').hide();
        $('.grp-th.position').hide();
        $('.grp-td.position').hide();
    });
}(jQuery));
