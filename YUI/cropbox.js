/**
 * Created by ezgoing on 14/9/2014.
 */
'use strict';
YUI.add('crop-box', function (Y) {
    Y.cropbox = Y.Base.create('crop-box', Y.Base, [],
        {
            initializer: function (options)
            {
                this.options = options;
                this.state = {};
                this.render();
            },
            render: function ()
            {
                var self = this;
                this.imageBox = Y.one(this.options.imageBox);
                this.thumbBox = this.imageBox.one(this.options.thumbBox);
                this.spinner = this.imageBox.one(this.options.spinner);

                this.initObject();
                return this;
            },
            initObject: function()
            {
                var self = this;
                this.spinner.show();

                this.image = new Image();
                this.image.onload = function() {
                    self.spinner.hide();
                    self.setBackground();

                    //event handler
                    self.imageBox.on('mousedown', self.imgMouseDown, self);
                    self.imageBox.on('mousemove', self.imgMouseMove, self);
                    self.mouseup = Y.one('body').on('mouseup', self.imgMouseUp, self);

                    Y.UA.gecko > 0?
                        self.imageBox.on('DOMMouseScroll', self.zoomImage, self):
                        self.imageBox.on('mousewheel', self.zoomImage, self);
                };
                this.image.src = this.options.imgSrc;
            },
            setBackground: function()
            {
                if(!this.ratio) this.ratio = 1;

                var w =  parseInt(this.image.width)*this.ratio;
                var h =  parseInt(this.image.height)*this.ratio;

                var pw = (this.imageBox.get('clientWidth') - w) / 2;
                var ph = (this.imageBox.get('clientHeight') - h) / 2;

                this.imageBox.setAttribute('style',
                    'background-image: url(' + this.image.src + '); ' +
                    'background-size: ' + w +'px ' + h + 'px; ' +
                    'background-position: ' + pw + 'px ' + ph + 'px; ' +
                    'background-repeat: no-repeat');
            },
            imgMouseDown: function(e)
            {
                e.stopImmediatePropagation();
                this.state.dragable = true;
                this.state.mouseX = e.clientX;
                this.state.mouseY = e.clientY;
            },
            imgMouseMove: function(e)
            {
                e.stopImmediatePropagation();
                if (this.state.dragable)
                {
                    var x = e.clientX - this.state.mouseX;
                    var y = e.clientY - this.state.mouseY;

                    var bg = this.imageBox.getStyle('backgroundPosition').split(' ');

                    var bgX = x + parseInt(bg[0]);
                    var bgY = y + parseInt(bg[1]);

                    this.imageBox.setStyle('backgroundPosition', bgX +'px ' + bgY + 'px');

                    this.state.mouseX = e.clientX;
                    this.state.mouseY = e.clientY;
                }
            },
            imgMouseUp: function(e)
            {
                e.stopImmediatePropagation();
                this.state.dragable = false;
            },
            zoomImage: function(e)
            {
                e.wheelDelta > 0? this.ratio*=1.1 : this.ratio*=0.9;
                this.setBackground();
            },
            getDataURL: function ()
            {
                var self = this,
                    width = this.thumbBox.get('clientWidth'),
                    height = this.thumbBox.get('clientHeight'),
                    canvas = document.createElement("canvas"),
                    dim = this.imageBox.getStyle('backgroundPosition').split(' '),
                    size = this.imageBox.getStyle('backgroundSize').split(' '),
                    dx = parseInt(dim[0]) - this.imageBox.get('clientWidth')/2 + width/2,
                    dy = parseInt(dim[1]) - this.imageBox.get('clientHeight')/2 + height/2,
                    dw = parseInt(size[0]),
                    dh = parseInt(size[1]),
                    sh = parseInt(this.image.height),
                    sw = parseInt(this.image.width);

                canvas.width = width;
                canvas.height = height;
                var context = canvas.getContext("2d");
                context.drawImage(this.image, 0, 0, sw, sh, dx, dy, dw, dh);
                var imageData = canvas.toDataURL('image/png');

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
                this.setBackground();
            },
            zoomOut: function ()
            {
                this.ratio*=0.9;
                this.setBackground();
            },
            destructor: function ()
            {
                if (this.mouseup) this.mouseup.detach()
            }
        });
}, '1.0',
{
    requires: [ 'node', 'base' ]
});
