/**
 * Created by Matjaz on 19/12/14.
 */
$(function() {

    //Show chart
    var showChart = function($canvas) {

        var value = $canvas.attr('data-chart-value');
        value = value ? parseInt(value) : 0;
        var color = $canvas.attr('data-chart-color') || '#4a386f';
        var colorOff = $canvas.attr('data-chart-color-off') || "#ecf0f1";
        var width = $canvas.attr('data-chart-width') || $canvas.attr('width') || 130;
        var height = $canvas.attr('data-chart-height') || $canvas.attr('height') || 130;

        $canvas.attr('width', width).attr('height', height).attr('data-chart-width', width).attr('data-chart-height', height);

        var doughnutData = [
            {
                value: value,
                color: color
            },
            {
                value : 100 - value,
                color : colorOff
            }
        ];
        var myDoughnut = new Chart($canvas.get(0).getContext("2d")).Doughnut(doughnutData);
        $canvas.attr('data-chart-shown', 'true'); //the chart is shown
    }

    //show charts when scrolled into view
    var isOnScreen = function($el){
        //from http://upshots.org/javascript/jquery-test-if-element-is-in-viewport-visible-on-screen
        var win = $(window);

        var viewport = {
            top : win.scrollTop(),
            left : win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();

        var bounds = $el.offset();
        bounds.right = bounds.left + $el.outerWidth();
        bounds.bottom = bounds.top + $el.outerHeight();

        return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
    };


    var showChartsTimer = null;

    var showChartsWhenScrolledIntoView = function() {
        showChartsTimer = null;

        $('canvas.chart').each(function(i, c) {
            var $canvas = $(c);
            if(!$canvas.attr('data-chart-shown')) { //check if chart is already shown
                if(isOnScreen($canvas)) {
                    showChart($canvas);
                }
            }
        })
    }

    $(window).on('scroll', function() {
        if(showChartsTimer) {
            clearTimeout(showChartsTimer);
        }
        showChartsTimer = setTimeout(showChartsWhenScrolledIntoView, 100);
    });

    showChartsWhenScrolledIntoView();

    //Setup event handlers for charts so that we can call update by triggering events at design time
    $(window).on('chart-added', function() {
        $('canvas.chart').off('chart-update').on('chart-update', function(event) {
            var $canvas = $(event.delegateTarget);
            showChart($canvas);
        });
    }).trigger('chart-added');
});