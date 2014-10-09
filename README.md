cropbox.js
=======
A lightweight and simple JavaScript, Jquery, YUI plugin to crop your avatar.

## Features

- support dataUrl for displaying image (function getDataURL)
- support Blob for uploading image (function getBlob)

##Screenshot
![ScreenShot](/screenshot.jpg)

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
        var cropper = new cropbox(options);
        document.querySelector('#file').addEventListener('change', function(){
            var reader = new FileReader();
            reader.onload = function(e) {
                options.imgSrc = e.target.result;
                cropper = new cropbox(options);
            }
            reader.readAsDataURL(this.files[0]);
            this.files = [];
        })
        document.querySelector('#btnCrop').addEventListener('click', function(){
            var img = cropper.getDataURL()
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
        var cropper = $('.imageBox').cropbox(options);
        $('#file').on('change', function(){
            var reader = new FileReader();
            reader.onload = function(e) {
                options.imgSrc = e.target.result;
                cropper = $('.imageBox').cropbox(options);
            }
            reader.readAsDataURL(this.files[0]);
            this.files = [];
        })
        $('#btnCrop').on('click', function(){
            var img = cropper.getDataURL()
            $('.cropped').append('<img src="'+img+'">');
        })
        $('#btnZoomIn').on('click', function(){
            cropper.zoomIn();
        })
        $('#btnZoomOut').on('click', function(){
            cropper.zoomOut();
        })
    });
    
    // use with require js (new feature added on 9 Oct 2014)
    require.config({
        baseUrl: "../",
        paths: {
            jquery: 'jquery-1.11.1.min',
            cropbox: 'cropbox'
        }
    });
    require( ["jquery", "cropbox"], function($) {
        var options =
        {
            thumbBox: '.thumbBox',
            spinner: '.spinner',
            imgSrc: 'avatar.png'
        }
        var cropper = $('.imageBox').cropbox(options);
        $('#file').on('change', function(){
            var reader = new FileReader();
            reader.onload = function(e) {
                options.imgSrc = e.target.result;
                cropper = $('.imageBox').cropbox(options);
            }
            reader.readAsDataURL(this.files[0]);
            this.files = [];
        })
        $('#btnCrop').on('click', function(){
            var img = cropper.getDataURL();
            $('.cropped').append('<img src="'+img+'">');
        })
        $('#btnZoomIn').on('click', function(){
            cropper.zoomIn();
        })
        $('#btnZoomOut').on('click', function(){
            cropper.zoomOut();
        })
        }
    );

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
        var cropper = new Y.cropbox(options);
        Y.one('#file').on('change', function(){
            var reader = new FileReader();
            reader.onload = function(e) {
                options.imgSrc = e.target.result;
                cropper = new Y.cropbox(options);
            }
            reader.readAsDataURL(this.get('files')._nodes[0]);
            this.get('files')._nodes = [];
        })
        Y.one('#btnCrop').on('click', function(){
            var img = cropper.getDataURL()
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