/**
 * Hides any column with the "position" or "order" class (which typically are the columns
 * containing a position/order input).
 */

(function($) {
    $(function(){
        $('.grp-th.order').hide();
        $('.grp-td.order').hide();
        $('.grp-th.position').hide();
        $('.grp-td.position').hide();
    });
}(jQuery));
