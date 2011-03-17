/* 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * watermark.js - Create watermarked images with Canvas and JS
 *
 * Version: 0.5 (2011-03-16)
 * Copyright (c) 2011	Patrick Wied ( http://www.patrick-wied.at )
 * This code is licensed under the terms of the MIT LICENSE
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

(function(w){
	var doc = w.document,
	gcanvas = {},
	gctx = {},
	imgQueue = [],
	className = "watermark",
	watermark = false,
	watermarkPosition = "bottom-right",
	watermarkPath = "watermark.png?"+(+(new Date())),
	opacity = (255/(100/50)), // 50%
	initCanvas = function(){
		gcanvas = doc.createElement("canvas");
		gcanvas.style.cssText = "display:none;";
		gctx = gcanvas.getContext("2d");
		doc.body.appendChild(gcanvas);
	},
	initWatermark = function(){
		watermark = new Image();
		watermark.src = watermarkPath;
		
		// redundancy | yuck. rewrite coming soon
		if(opacity != 255){
			if(!watermark.complete){
				watermark.onload = function(){	
					applyTransparency();
					applyWatermarks();
				}
			}else{
				applyTransparency();
				applyWatermarks();
			}
		}else{
			applyWatermarks();
		}
		
	},
	
	applyTransparency = function(){
		var w = watermark.width || watermark.offsetWidth,
		h = watermark.height || watermark.offsetHeight;
		setCanvasSize(w, h);
		gctx.drawImage(watermark, 0, 0);
				
		var image = gctx.getImageData(0, 0, w, h);
		var imageData = image.data,
		length = imageData.length;
		for(var i=3; i < length; i+=4){  
			imageData[i] = (imageData[i]<opacity)?imageData[i]:opacity;
		}
		image.data = imageData;
		gctx.putImageData(image, 0, 0);
		watermark.onload = null;
		watermark.src = gcanvas.toDataURL();
	},
	configure = function(config){
		if(config["watermark"])
			watermark = config["watermark"];
		if(config["path"])
			watermarkPath = config["path"];
		if(config["position"])
			watermarkPosition = config["position"];
		if(config["opacity"])
			opacity = (255/(100/config["opacity"]));
		if(config["className"])
			className = config["className"];
		
		initCanvas();
		initWatermark();
	}
	setCanvasSize = function(w, h){
		gcanvas.width = w;
		gcanvas.height = h;
	},
	applyWatermark = function(img){
		gcanvas.width = img.width || img.offsetWidth;
		gcanvas.height = img.height || img.offsetHeight;
		gctx.drawImage(img, 0, 0);
		var position = watermarkPosition,
		x = 0,
		y = 0;
		if(position.indexOf("top")!=-1)
			y = 10;
		else
			y = gcanvas.height-watermark.height-10;
		
		if(position.indexOf("left")!=-1)
			x = 10;
		else
			x = gcanvas.width-watermark.width-10;
		
		gctx.drawImage(watermark, x, y);
		img.onload = null;
		img.src = gcanvas.toDataURL();
	},
	applyWatermarks = function(){
		var els = doc.getElementsByClassName(className),
		len = els.length;
		while(len--){
			var img = els[len];
			if(img.tagName.toUpperCase() != "IMG")
				continue;
			
			if(!img.complete){
				img.onload = function(){
					applyWatermark(this);
				};
			}else{
				applyWatermark(img);
			}
		}
	};
	
	
	return {
		init: function(config){
			configure(config);
		}
	};
})(window).init({
	/* config goes here */
	"position": "top-right",	// default "bottom-right"
	"opacity": 50,	// default 50
	"className": "watermark" // default "watermark"
});