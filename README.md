CropBox.js
=======
A lightweight and simple JavaScript, Jquery, YUI plugin to crop your avatar.

Features
    Fully customize theme via CSS

![ScreenShot](/screenshot.png)

# Usage

## Pure javascript

    window.onload = function() {
        var options =
        {
            imageBox: '.imageBox',
            thumbBox: '.thumbBox',
            spinner: '.spinner',
            imgSrc: 'avatar.png'
        }
        var cropper = new CropBox(options);
        document.querySelector('#file').addEventListener('change', function(){
            var reader = new FileReader();
            reader.onload = function(e) {
                options.imgSrc = e.target.result;
                cropper = new CropBox(options);
            }
            reader.readAsDataURL(this.files[0]);
            this.files = [];
        })
        document.querySelector('#btnCrop').addEventListener('click', function(){
            var img = cropper.getAvatar()
            document.querySelector('.cropped').innerHTML += '<img src="'+img+'">';
        })
        document.querySelector('#btnZoomIn').addEventListener('click', function(){
            cropper.zoomIn();
        })
        document.querySelector('#btnZoomOut').addEventListener('click', function(){
            cropper.zoomOut();
        })
    };

[Demo](http://cssdeck.com/labs/xnmcokhc)

## Jquery plugin

    $(window).load(function() {
        var options =
        {
            thumbBox: '.thumbBox',
            spinner: '.spinner',
            imgSrc: 'avatar.png'
        }
        var cropper = $('.imageBox').CropBox(options);
        $('#file').on('change', function(){
            var reader = new FileReader();
            reader.onload = function(e) {
                options.imgSrc = e.target.result;
                cropper = $('.imageBox').CropBox(options);
            }
            reader.readAsDataURL(this.files[0]);
            this.files = [];
        })
        $('#btnCrop').on('click', function(){
            var img = cropper.getAvatar()
            $('.cropped').append('<img src="'+img+'">');
        })
        $('#btnZoomIn').on('click', function(){
            cropper.zoomIn();
        })
        $('#btnZoomOut').on('click', function(){
            cropper.zoomOut();
        })
    });

[Demo](http://cssdeck.com/labs/t8bdodvj)

## YUI plugin

    YUI().use('node', 'crop-box', function(Y){
        var options =
        {
            imageBox: '.imageBox',
            thumbBox: '.thumbBox',
            spinner: '.spinner',
            imgSrc: 'avatar.png'
        }
        var cropper = new Y.CropBox(options);
        Y.one('#file').on('change', function(){
            var reader = new FileReader();
            reader.onload = function(e) {
                options.imgSrc = e.target.result;
                cropper = new Y.CropBox(options);
            }
            reader.readAsDataURL(this.get('files')._nodes[0]);
            this.get('files')._nodes = [];
        })
        Y.one('#btnCrop').on('click', function(){
            var img = cropper.getAvatar()
            Y.one('.cropped').append('<img src="'+img+'">');
        })
        Y.one('#btnZoomIn').on('click', function(){
            cropper.zoomIn();
        })
        Y.one('#btnZoomOut').on('click', function(){
            cropper.zoomOut();
        })
    })

[Demo](http://cssdeck.com/labs/kugvd9kp)