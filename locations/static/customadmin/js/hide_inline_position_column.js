/**
 * Hides any column with the "position" or "order" class (which typically are the columns
 * containing a position/order input).
 */

(function($) {
    $(function(){
        $('.grp-th.order, .grp-td.order, .grp-th.position, .grp-td.position').hide();
    });
}(jQuery));
