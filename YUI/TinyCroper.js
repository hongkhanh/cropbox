/**
 * Created by ezgoing on 14/9/2014.
 */

YUI.add('cropper', function (Y) {
        Y.UploadAvatarView = Y.Base.create('view:account-upload-avatar', Y.View, [Y.Popup],
            {
                template: Y.Utils.templates('t-account-upload-avatar'),
                obj: {state:{}},
                objState: {imageBox:{}},
                events: {
                    '#btnClose, #btnCancel': {click: 'close'},
                    '#btnSave': {click: 'save'}
                },
                initializer: function () {
                    Y.log('UploadAvatarView initialize');
                    this.render();
                },
                render: function () {
                    Y.log('UploadAvatarView render');

                    var self = this;
                    var c = this.get('container');
                    var html = this.template();
                    c.setHTML(html);

                    this.renderPopup();

                    this.obj.imageBox = c.one('#imageBox');
                    this.initObject(this.get('file'));

                    return this;
                },
                initObject: function(file)
                {
                    var self = this;
                    var c = this.get('container');
                    c.one('.spinner').show();
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var img = new Image();
                        img.onload = function() {
                            c.one('.spinner').hide();
                            c.one('#btnSave').show();
                            self.obj.image = img;
                            self.setBackground();

                            //event handler
                            self.obj.imageBox.on('mousedown', self.imgMouseDown, self);
                            self.obj.imageBox.on('mousemove', self.imgMouseMove, self);
                            Y.one('body').on('mouseup', self.imgMouseUp, self);

                            Y.UA.gecko > 0?
                                self.obj.imageBox.on('DOMMouseScroll', self.zoomImage, self):
                                self.obj.imageBox.on('mousewheel', self.zoomImage, self);

                            self.resize();
                        };
                        img.src = e.target.result;
                    }
                    reader.readAsDataURL(file);
                },
                setBackground: function()
                {
                    if(!this.obj.ratio) this.obj.ratio = 1;

                    var w =  parseInt(this.obj.image.width)*this.obj.ratio;
                    var h =  parseInt(this.obj.image.height)*this.obj.ratio;

                    var pw = (this.obj.imageBox.get('clientWidth') - w) / 2;
                    var ph = (this.obj.imageBox.get('clientHeight') - h) / 2;

                    this.obj.imageBox.setStyle('backgroundImage', 'url(' + this.obj.image.src + ')');
                    this.obj.imageBox.setStyle('backgroundSize', w +'px ' + h + 'px');
                    this.obj.imageBox.setStyle('backgroundPosition', pw + 'px ' + ph + 'px');
                    this.obj.imageBox.setStyle('background-repeat', 'no-repeat');
                },
                imgMouseDown: function(e)
                {
                    e.stopImmediatePropagation();
                    this.obj.state.dragable = true;
                    this.obj.state.mouseX = e.clientX;
                    this.obj.state.mouseY = e.clientY;
                },
                imgMouseMove: function(e)
                {
                    e.stopImmediatePropagation();
                    if (this.obj.state.dragable)
                    {
                        var x = e.clientX - this.obj.state.mouseX;
                        var y = e.clientY - this.obj.state.mouseY;

                        var bg = this.obj.imageBox.getStyle('backgroundPosition').split(' ');

                        var bgX = x + parseInt(bg[0]);
                        var bgY = y + parseInt(bg[1]);

                        this.obj.imageBox.setStyle('backgroundPosition', bgX +'px ' + bgY + 'px');

                        this.obj.state.mouseX = e.clientX;
                        this.obj.state.mouseY = e.clientY;
                    }
                },
                imgMouseUp: function(e)
                {
                    e.stopImmediatePropagation();
                    this.obj.state.dragable = false;
                },
                zoomImage: function(e)
                {
                    e.wheelDelta > 0? this.obj.ratio*=1.1 : this.obj.ratio*=0.9;
                    this.setBackground();
                },
                save: function ()
                {
                    var self = this;
                    var c = this.get('container');

                    var spinner = c.one('.spinner');
                    if (spinner.getStyle('display') != 'none') return;

                    var canvas = document.createElement("canvas");
                    canvas.width = 150;
                    canvas.height = 150;
                    var context = canvas.getContext("2d");

                    var dim = this.obj.imageBox.getStyle('backgroundPosition').split(' ');
                    var size = this.obj.imageBox.getStyle('backgroundSize').split(' ');
                    var dx = parseInt(dim[0]) - this.obj.imageBox.get('clientWidth')/2 + 75;
                    var dy = parseInt(dim[1]) - this.obj.imageBox.get('clientHeight')/2 + 75;
                    var dw = parseInt(size[0]);
                    var dh = parseInt(size[1]);
                    var sh = parseInt(this.obj.image.height);
                    var sw = parseInt(this.obj.image.width);
                    context.drawImage(this.obj.image, 0, 0, sw, sh, dx, dy, dw, dh);

                    var imageData = canvas.toDataURL('image/jpeg');
                    var b64 = imageData.replace('data:image/jpeg;base64,','');
                    var binary = atob(b64);
                    var array = [];
                    for (var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    var image =  new Blob([new Uint8Array(array)], {type: 'image/jpeg'});

                    var parent = this.get('parent');
                    var m = parent.get('model');

                    spinner.show();
                    m.upload_avatar(image, function(err){
                        if(err) Y.STORE.showAlertDialog('An error occurred. Please check the data and try again.', 'error');
                        else
                        {
                            self.remove();
                            parent.show();
                            Y.STORE.showNotification('Avatar saved successfully.');
                        }
                        spinner.hide();
                    })
                },
                close: function () {
                    this.get('parent').show();
                    this.remove();
                },
                destructor: function () {
                    Y.log('UploadAvatarView destroy');
                }
            });

    }, '1.0',
    {
        requires: [ 'node', 'view', 'popup', 'slider' ]
    });
