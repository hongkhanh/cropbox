/**
 * Created by ezgoing on 14/9/2014.
 */

"use strict";
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    var cropbox = function(options, el){
        var el = el || $(options.imageBox),
            obj =
            {
                state : {},
                ratio : 1,
                angle: 0,
                options : options,
                imageBox : el,
                thumbBox : el.find(options.thumbBox),
                spinner : el.find(options.spinner),
                image : new Image(),
                getDataURL: function ()
                {
                    var width = this.thumbBox.width(),
                        height = this.thumbBox.height(),
                        canvas = document.createElement("canvas"),
                        canvasRotate = document.createElement("canvas"),                                                
                        dim = el.css('background-position').split(' '),
                        size = el.css('background-size').split(' '),
                        dx = parseInt(dim[0]) - el.width()/2 + width/2,
                        dy = parseInt(dim[1]) - el.height()/2 + height/2,
                        dw = parseInt(size[0]),
                        dh = parseInt(size[1]),
                        sh = parseInt(this.image.height),
                        sw = parseInt(this.image.width);

                    canvas.width = width;
                    canvas.height = height;
                    var context = canvas.getContext("2d");
                    
                    context.drawImage(this.image, 0, 0, sw, sh, dx, dy, dw, dh);  
                                        
                    canvasRotate.width = width;
                    canvasRotate.height = height;
                    var contextRotate = canvasRotate.getContext("2d"); 
                    
                    if(this.angle){                                               
                        contextRotate.save();                        
                        contextRotate.translate(width/2, height/2);                            
                        contextRotate.rotate(this.angle*Math.PI / 180)
                        contextRotate.drawImage(canvas,-width/2,-height/2);                        
                        contextRotate.restore();
                    }else{
                        contextRotate.drawImage(canvas,0,0);
                    }
                                                           
                    var imageData = canvasRotate.toDataURL('image/png');
                    return imageData;
                },
                getBlob: function()
                {
                    var imageData = this.getDataURL();
                    var b64 = imageData.replace('data:image/png;base64,','');
                    var binary = atob(b64);
                    var array = [];
                    for (var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    return  new Blob([new Uint8Array(array)], {type: 'image/png'});
                },
                zoomIn: function ()
                {
                    this.ratio*=1.1;
                    setBackground();
                },
                zoomOut: function ()
                {
                    this.ratio*=0.9;
                    setBackground();
                },
                rotate: function()
                {
                    this.angle += 90;
                    if(this.angle >= 360) this.angle=0;
                    setBackground();            
                }
            },
            setBackground = function()
            {
                var w =  parseInt(obj.image.width)*obj.ratio;
                var h =  parseInt(obj.image.height)*obj.ratio;

                var pw = (el.width() - w) / 2;
                var ph = (el.height() - h) / 2;

                el.css({
                    'background-image': 'url(' + obj.image.src + ')',
                    'background-size': w +'px ' + h + 'px',
                    'background-position': pw + 'px ' + ph + 'px',
                    'background-repeat': 'no-repeat',
                    '-webkit-transform':'rotate(' + obj.angle + 'deg)',
                    '-moz-transform':'rotate(' + obj.angle + 'deg)',                    
                    'ms-transform':'rotate(' + obj.angle + 'deg)',
                    '-o-transform':'rotate(' + obj.angle + 'deg)',
                    'transform':'rotate(' + obj.angle + 'deg)'});
                
                obj.getDataURL();
            },
            imgMouseDown = function(e)
            {
                e.stopImmediatePropagation();

                obj.state.dragable = true;
                obj.state.mouseX = e.clientX;
                obj.state.mouseY = e.clientY;
            },
            imgMouseMove = function(e)
            {
                e.stopImmediatePropagation();

                if (obj.state.dragable)
                {
                    var x = e.clientX - obj.state.mouseX;
                    var y = e.clientY - obj.state.mouseY;
                   
                    var bg = el.css('background-position').split(' ');
                    
                    var bgX = x + parseInt(bg[0]);
                    var bgY = y + parseInt(bg[1]);
                    
                    if(90 == obj.angle){
                        bgX = y + parseInt(bg[0]);
                        bgY = -x + parseInt(bg[1]);
                    }else if(180 == obj.angle){
                        bgX = -x + parseInt(bg[0]);
                        bgY = -y + parseInt(bg[1]);
                    }else if(270 == obj.angle){
                        bgX = -y + parseInt(bg[0]);
                        bgY = x + parseInt(bg[1]);
                    }                   
                                            
                    el.css('background-position', bgX +'px ' + bgY + 'px');
                    
                    obj.state.mouseX = e.clientX;
                    obj.state.mouseY = e.clientY;
                }
            },
            imgMouseUp = function(e)
            {
                e.stopImmediatePropagation();
                obj.state.dragable = false;
            },
            zoomImage = function(e)
            {
                e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0 ? obj.ratio*=1.1 : obj.ratio*=0.9;
                setBackground();
            }

        obj.spinner.show();
        obj.image.onload = function() {
            obj.spinner.hide();
            setBackground();

            el.bind('mousedown', imgMouseDown);
            el.bind('mousemove', imgMouseMove);
            $(window).bind('mouseup', imgMouseUp);
            el.bind('mousewheel DOMMouseScroll', zoomImage);
        };
        obj.image.src = options.imgSrc;
        el.on('remove', function(){$(window).unbind('mouseup', imgMouseUp)});

        return obj;
    };

    jQuery.fn.cropbox = function(options){
        return new cropbox(options, this);
    };
}));
                
