/*
    jQuery Flickr PhotoWall
    jQuery image gallery script with fullscreen mode.
    http://creotiv.github.com/jquery-photowall
    
    Copyright (C) 2012  Andrey Nikishaev(creotiv@gmail.com, http://creotiv.in.ua)

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
    LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function $_GET(){
  var s = location.hash;
  a = s.match(/[^&#=]*=[^&#=]*/g);
  r = {};
  if(a) {
	  for (i=0; i<a.length; i++) {
		r[a[i].match(/[^&#=]*/)[0]] = a[i].match(/=([^&#]*)/)[0].replace('=', '');
	  }
  }
  return r;
} 

function escapeHtml(unsafe) {
return unsafe
.replace(/&/g, "&amp;")
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;")
.replace(/"/g, "&quot;")
.replace(/'/g, "&#039;");
}

// Hotfix for adding jQuery.browser method onto newer versions (it got deprecated)
//if ( !jQuery.browser ) {
	jQuery.uaMatch = function( ua ) {
		ua = ua.toLowerCase();
		var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		    /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		    /(msie) ([\w.]+)/.exec( ua ) ||
		    ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		    [];
		return {
		    browser: match[ 1 ] || "",
		    version: match[ 2 ] || "0"
		};
	};
	
	matched = jQuery.uaMatch( navigator.userAgent );
	browser = {};
	if ( matched.browser ) {
    	browser[ matched.browser ] = true;
		browser.version = matched.version;
	}
	// Chrome is Webkit, but Webkit is also Safari.
	if ( browser.chrome ) {
 	   browser.webkit = true;
	} else if ( browser.webkit ) {
    	browser.safari = true;
	}
	jQuery.browser = browser;
//}

function isMobile() {
    return ('ontouchstart' in window);
}

function isWebkitMobile() {
    return (isMobile() && typeof document.body.style.webkitTextCombine === 'string');
}

function getScreenDimensions() {
	var d = document.createElement('div');
    d.style.position = 'absolute';
    d.style.left = '-100%';
    d.style.top = '-100%';
    d.style.width = '1in';
    d.style.height = '1in';
	document.body.appendChild (d);
    var devicePixelRatio = window.devicePixelRatio || 1;
    var dpi_x = d.offsetWidth * devicePixelRatio;
    var dpi_y = d.offsetHeight * devicePixelRatio;
	document.body.removeChild(d);
    var width = screen.width;
    var height = screen.height;
    // Android browsers other than Chrome currently report physical rather than
    // viewport screen size (April 2015)
    if (isWebkitMobile() && !($.browser.chrome)) {
        width = width / (dpi_x / 96.0);
        height = height / (dpi_x / 96.0);
    }
    var width_in = width / dpi_x;
    var height_in = height / dpi_y;
    var dim = {width: width_in, height: height_in};
//    alert(dim.width + 'in wide x ' + dim.height + 'in high');
    return dim;
}

/*
    TODO: Add screen size check on zoom.
*/
var PhotoWall = {
	version: "0.1.4",
	
	_photos: {},
	_el: null,
	_c_width: 0,
	_c_height: 0,
	_first_big: null,
	_zoom_trigger: null,
	_zs: null,
	_zoom_timeout: null,
	_last_line: [],
	_must_resize: false,
	_inited: false,
	_block_resize: false,
	_line_max_height:0,
    _body_overflow: $('body').css('overflow'),
    _script_path: $("script[src]").last().attr("src").split('?')[0].split('/').slice(0, -1).join('/')+'/',
	
	options: {
         lineMaxHeight:150
        ,lineMaxHeightDynamic: false
        ,baseScreenHeight: 600
		,isFirstBig: false              // Not implemented  
        ,firstBigWidthPercent: 0.41
        ,padding:10
        ,zoomAction:'mouseenter'
        ,zoomTimeout:500
        ,zoomDuration:300
        ,zoomImageBorder:5
		,slideDuration:5000
    },
	
	init: function(op) {	
	    PhotoWall.options = $.extend(PhotoWall.options,op);
        PhotoWall.options.baseScreenHeight = $(window).height();
		PhotoWall._el = op.el+' .body';
		PhotoWall._c_width = $(PhotoWall._el).width();
		PhotoWall._c_height = $(PhotoWall._el).height();	
		PhotoWall._line_max_height = PhotoWall.options.lineMaxHeight;
		PhotoWall._setLineMaxHeightDynamic();
		$(PhotoWall._el).html('').addClass('clearfix');
		$(window).resize(PhotoWall.RESIZE);
	},
    _setLineMaxHeightDynamic: function() {
        if(PhotoWall.options.lineMaxHeightDynamic) {
		    var fact = $(window).height()/PhotoWall.options.baseScreenHeight;
		    PhotoWall.options.lineMaxHeight = (PhotoWall._line_max_height*fact >= 100)?(PhotoWall._line_max_height*fact):100;
		}  
    },
	RESIZE: function() {
		var w = $(PhotoWall._el).width();
		var h = $(PhotoWall._el).height();
		
		PhotoWall._setLineMaxHeightDynamic();
		
        if((!PhotoWall.options.lineMaxHeightDynamic && PhotoWall._c_width == w) || PhotoWall._block_resize)
			return;
		PhotoWall._c_width = w;
		PhotoWall._c_height = h;	
        PhotoWall._must_resize=false;
		$(PhotoWall._el).html('');
		PhotoWall.show();
	},
	// Here we resize all photos to max line height and replace main data array.
	load: function(data) {
	    if(!PhotoWall.options.lineMaxHeightDynamic) {
	        for(var i in data) {
	            var fact  = PhotoWall.options.lineMaxHeight/data[i].th.height;
			    data[i]['th'].width  = Math.floor(data[i]['th'].width * fact);
			    data[i]['th'].height = PhotoWall.options.lineMaxHeight;
	        }
	    }
        PhotoWall._photos = data;
		PhotoWall.show();
	},
	/* This method render images by lines to the container.
	   If 'data' is set then images from 'data' will be appended to the container,
	   else images from container will be replace by the images from the main array.
    */
	show: function(data) {
        var imgArray = new Array();	   
        var line = [];
		var totalWidth = 0;	
		if(!data) {
		    // when we load images
		    if(!PhotoWall._photos) return;
		    $(PhotoWall._el).html('');
		    //$(window).scrollTop(0);
		    imgArray = PhotoWall._photos;
		} else {
		    // when we need to update list of images. 
	        imgArray   = data;
            line       = PhotoWall._last_line[0];
		    totalWidth = PhotoWall._last_line[1];
		}
        
        var addImage = function(id,padding,w,h,big,th,cw,ch,desc, album_url) {
            var img_pos = '';
            var crop = '';
            if(cw && ch) {
                img_pos = 'position:absolute;left:-'+Math.round((w-cw)/2)+'px;top:-'+Math.round((h-ch)/2)+'px;'
                crop = 'pw-crop';
            } 
            var t = 
                $(''
                +'<div id="'+id+'" class="pw-photo '+crop+' clearfix"' +'style=" margin:'+padding+'px; width:'+w+'px;height:'+h+'px;float:left;">'
                +'<figure><a href="'+album_url+'">'
                +'<img src="'+th+'" width="'+w+'" height="'+h+'"' +'style="'+img_pos+'" title="'+desc+'"/>'
                +'<figcaption>'
                +'<h3>'+desc+'</h3>'
                +'</figcaption>'
                +'</a></figure>'
                +'</div>'
	        );
            //Took out unnecessary fade effect
			//if($.browser.msie) {
			//	t.find('img').hide().load(function(){$(this).fadeIn(300);});
			//} else {
            //t.find('img').css('opacity',0).load(function(){
			 //       $(this).delay(Math.random()*(1000 - 300)+300)
			 //              .animate({"opacity":1},{duration:1000});
            //    });
			//}
            
			return t;
        }
        /*
            Create line of images and add it to container body.
        */
		var showLine = function(line,total_width,last,first) {
			var num_photos = line.length;		
		    var ln = $("<div class='pw-line' style='width:"+(total_width+num_photos*PhotoWall.options.padding*2)+"px'></div>")
                     .appendTo(PhotoWall._el);
            var space = (first)?(PhotoWall._c_width*PhotoWall.options.firstBigWidthPercent+PhotoWall.options.padding*2):0;			
			var hCoef = (PhotoWall._c_width-space-num_photos*PhotoWall.options.padding*2) / total_width;
			if(last)
				var hCoef = 1;
            var l = 0;
			for(var k in line) {	
				var w = Math.floor(line[k].th.width*hCoef);
				var h = Math.floor(line[k].th.height*hCoef);
                var t;
                // This needed to fit images in container, because due to round 
                // function it can be different in few pixels.
                l += w;
                if(!last && k == (num_photos-1)) {
                    w += (PhotoWall._c_width-space-num_photos*PhotoWall.options.padding*2)-l;
                }
                
				if(line[k].th.desc == undefined) {
					line[k].th.desc = '';
				}
				t = addImage(line[k].id,PhotoWall.options.padding,w,h,line[k].img,line[k].th.src,null,null,line[k].th.desc,line[k].th.album_url);
				ln.append(t);
			}
			ln.css({'width': PhotoWall._c_width});
			return t;
		};/* End of showLine() */

        var lines = 0;
		var firstLineHeight = PhotoWall.options.padding*2;
		var first = true;
        for(var i in imgArray) {	
			var space = 0;
		    var first_space = false;
		    var e = null;
		    //PhotoWall.options.lineMaxHeight = PhotoWall._line_max_height;
		    
		    // if lineMaxHeight changes on resize then recompute image sizes.
		    if(PhotoWall.options.lineMaxHeightDynamic) {
   				var fact  = PhotoWall.options.lineMaxHeight/imgArray[i].th.height;
				
				imgArray[i]['th'].width  = Math.floor(imgArray[i]['th'].width * fact);
				imgArray[i]['th'].height = PhotoWall.options.lineMaxHeight;
		    }
			if(PhotoWall.options.isFirstBig && first) {
			    PhotoWall._first_big = imgArray[i];
		        first = false;
		        continue;
		    }
			
			if(lines < 2 && PhotoWall.options.isFirstBig) {
			    var h = PhotoWall._first_big.th.height;
			    //PhotoWall.options.lineMaxHeight = (Math.round(h/2) < PhotoWall._line_max_height)?Math.round(h/2):PhotoWall._line_max_height;
                first_space = true;
                space       = PhotoWall._c_width*PhotoWall.options.firstBigWidthPercent;  
            }
			
			line.push(imgArray[i]);
			totalWidth += imgArray[i].th.width;

			if(totalWidth >= (PhotoWall._c_width - space)) 
			{
			    var ln = showLine(line,totalWidth,0,first_space);
                if(lines < 2)
					firstLineHeight += ln.height();
				PhotoWall._last_line = [line,totalWidth,ln];
				line = [];
                totalWidth = 0;
                lines++;
			}
		}
	    if(PhotoWall.options.isFirstBig) {
            var im = PhotoWall._first_big;
            var fact = PhotoWall._c_width*PhotoWall.options.firstBigWidthPercent/imgArray[i].width;
            var w = im.width * fact;
            var h = im.height * fact;
			im.th.width = w;
			im.th.height = h;
			im.th.src = im.img;
			im.th.zoom_src = im.img;
			PhotoWall._first_big = addImage(
				im.id,
				PhotoWall.options.padding,
				w,
				h,
				im.img,
				im.img
			).prependTo(PhotoWall._el);
        }
        
		if(line) {
			if(lines < 2 && PhotoWall.options.isFirstBig)
                first_space = true;
		    var ln = showLine(line,totalWidth,1,first_space);
		    PhotoWall._last_line = [line,totalWidth,ln];
		}
        // Hack: Fix line width if scroll bar not present.
	    if(PhotoWall._c_width < $(PhotoWall._el).width()) {
            PhotoWall.RESIZE();
	    }
		$('.pw-line').css({'width': PhotoWall._c_width + 'px'});
		if(!PhotoWall._inited) {
		    PhotoWall._inited = true;
		    PhotoWall.initGUI();
		}			
	},
	/*
	    Initialize GUI.
	*/
	initGUI: function() {
		if(PhotoWall.options.zoom)
		    PhotoWall.initZoom();
	},
	/*
	    Initialize image zoom.
	*/
	initZoom: function() {
		$(".pw-zoom").on(PhotoWall.options.zoomAction,function (){
			var img = $(this);
			if(!parseInt(img.css('opacity'))) return;
							
			img.stop().addClass('pw-photo-hover');
			// Make images to zoom only after some time to prevent zoom on mouse move.
			PhotoWall._zoom_timeout = setTimeout(function(){
				img.removeClass('pw-photo-hover');				
				img.addClass('pw-photo-zoomed');
				if(PhotoWall._zoom_timeout) {
					PhotoWall._zs = [img.width(),img.height()];
					var container  = img.parent().parent();
					var item   = PhotoWall._photos[container.attr('id')];
					// Preload zoomed image and replace old only when it loaded.
					var bigIMG = $('<img/>');
					bigIMG.attr('src',item.th.zoom_src);
					bigIMG.load(function(){ 
						img.attr('src',$(this).attr('src'));
						$(this).remove();
					});		
                    // calculating zoom image size
					var w  = Math.round(img.width()*item.th.zoom_factor);
					var h  = Math.round(img.height()*item.th.zoom_factor);
					// calculating diff size
					var dw = w - img.width();
					var dh = h - img.height();
					// calculating left and top margin
					var l  = -(dw) * 0.5-PhotoWall.options.zoomImageBorder;
					var t  = -(dh) * 0.5-PhotoWall.options.zoomImageBorder;
					
					var o  = container.offset(); 
					var wn = $(window);
					var winFact = 1;
					// Prevent image to expand out of visible part of window 
					if(o.left + l + w > (wn.width()+wn.scrollLeft()))
						l -= (o.left + l + w) - (wn.width()+wn.scrollLeft())+PhotoWall.options.zoomImageBorder*2; 
					
					if(o.left + l < wn.scrollLeft())
						l -= (o.left + l)-wn.scrollLeft();
					
					if(o.top + t + h > (wn.height()+wn.scrollTop()))
						t -= (o.top + t + h) - (wn.height()+wn.scrollTop())+PhotoWall.options.zoomImageBorder*2; 
					
					if(o.top + t < wn.scrollTop())
						t -= (o.top + t)-wn.scrollTop();
		            // END
		            // Prevent image from being bigger then visible part of window
		            if(w+PhotoWall.options.zoomImageBorder*2 > wn.width()) 
		                winFact *= (wn.width()-PhotoWall.options.zoomImageBorder*2)/(w+PhotoWall.options.zoomImageBorder*2);
		                
		            if((h*winFact+PhotoWall.options.zoomImageBorder*2) > wn.height()) 
		                winFact *= (wn.height()-PhotoWall.options.zoomImageBorder*2)/(h*winFact+PhotoWall.options.zoomImageBorder*2);
		            // END
		            
		            // Zooming
					img.animate({
						"margin-left": 	l,
						"margin-top": 	t,
						"width": 		Math.round(w*winFact),
						"height": 		Math.round(h*winFact),
						"padding": 		PhotoWall.options.zoomImageBorder
					}, {
						queue: 		false,
						duration: 	PhotoWall.options.zoomDuration,
						easing: 	'linear'
					});
				}
			},PhotoWall.options.zoomTimeout);
		});
		$(".pw-zoom").on('mouseleave',function(){
			var img = $(this);
			var container  = img.parent().parent();
			var item   = PhotoWall._photos[container.attr('id')];
			if (PhotoWall._zoom_timeout) {
					clearTimeout(PhotoWall._zoom_timeout)
					PhotoWall._zoom_timeout = null;
			}
			img.removeClass('pw-photo-hover');
			if(img.hasClass('pw-photo-zoomed')) {
				img.stop().css({
					"margin":  '',
					"padding": '',
			        "width":		PhotoWall._zs[0] + 'px',
			        "height": 		PhotoWall._zs[1] + 'px'
		
				});
				PhotoWall._zs = null;
				img.removeClass('pw-photo-zoomed');
			}
		});
	}
}
