"use strict";!function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)}(function(t){var e=function(e,n){var i={scrollToZoom:!0};e=t.extend({},i,e||{}),console.log(e);var n=n||t(e.imageBox),o={state:{},ratio:1,options:e,imageBox:n,thumbBox:n.find(e.thumbBox),spinner:n.find(e.spinner),image:new Image,getDataURL:function(){var t=this.thumbBox.width(),e=this.thumbBox.height(),i=document.createElement("canvas"),o=n.css("background-position").split(" "),a=n.css("background-size").split(" "),s=parseInt(o[0])-n.width()/2+t/2,r=parseInt(o[1])-n.height()/2+e/2,u=parseInt(a[0]),c=parseInt(a[1]),g=parseInt(this.image.height),m=parseInt(this.image.width);i.width=t,i.height=e;var p=i.getContext("2d");p.drawImage(this.image,0,0,m,g,s,r,u,c);var d=i.toDataURL("image/png");return d},getBlob:function(){for(var t=this.getDataURL(),e=t.replace("data:image/png;base64,",""),n=atob(e),i=[],o=0;o<n.length;o++)i.push(n.charCodeAt(o));return new Blob([new Uint8Array(i)],{type:"image/png"})},zoomIn:function(){this.ratio*=1.1,a()},zoomOut:function(){this.ratio*=.9,a()}},a=function(){var t=parseInt(o.image.width)*o.ratio,e=parseInt(o.image.height)*o.ratio,i=(n.width()-t)/2,a=(n.height()-e)/2;n.css({"background-image":"url("+o.image.src+")","background-size":t+"px "+e+"px","background-position":i+"px "+a+"px","background-repeat":"no-repeat"})},s=function(t){t.stopImmediatePropagation(),o.state.dragable=!0,o.state.mouseX=t.clientX,o.state.mouseY=t.clientY},r=function(t){if(t.stopImmediatePropagation(),o.state.dragable){var e=t.clientX-o.state.mouseX,i=t.clientY-o.state.mouseY,a=n.css("background-position").split(" "),s=e+parseInt(a[0]),r=i+parseInt(a[1]);n.css("background-position",s+"px "+r+"px"),o.state.mouseX=t.clientX,o.state.mouseY=t.clientY}},u=function(t){t.stopImmediatePropagation(),o.state.dragable=!1},c=function(t){t.originalEvent.wheelDelta>0||t.originalEvent.detail<0?o.ratio*=1.1:o.ratio*=.9,a()};return o.spinner.show(),o.image.onload=function(){o.spinner.hide(),a(),n.bind("mousedown",s),n.bind("mousemove",r),t(window).bind("mouseup",u),e.scrollToZoom&&n.bind("mousewheel DOMMouseScroll",c)},o.image.src=e.imgSrc,n.on("remove",function(){t(window).unbind("mouseup",u)}),o};jQuery.fn.cropbox=function(t){return new e(t,this)}});
