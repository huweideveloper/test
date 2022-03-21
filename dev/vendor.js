/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [], result;
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/ 		if(executeModules) {
/******/ 			for(i=0; i < executeModules.length; i++) {
/******/ 				result = __webpack_require__(__webpack_require__.s = executeModules[i]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// objects to store loaded and loading chunks
/******/ 	var installedChunks = {
/******/ 		67: 0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData === 0) {
/******/ 			return new Promise(function(resolve) { resolve(); });
/******/ 		}
/******/
/******/ 		// a Promise means "currently loading".
/******/ 		if(installedChunkData) {
/******/ 			return installedChunkData[2];
/******/ 		}
/******/
/******/ 		// setup Promise in chunk cache
/******/ 		var promise = new Promise(function(resolve, reject) {
/******/ 			installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 		});
/******/ 		installedChunkData[2] = promise;
/******/
/******/ 		// start chunk loading
/******/ 		var head = document.getElementsByTagName('head')[0];
/******/ 		var script = document.createElement('script');
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = 'utf-8';
/******/ 		script.async = true;
/******/ 		script.timeout = 120000;
/******/
/******/ 		if (__webpack_require__.nc) {
/******/ 			script.setAttribute("nonce", __webpack_require__.nc);
/******/ 		}
/******/ 		script.src = __webpack_require__.p + "" + {"0":"7217a521f886f52389ed","1":"d5edca3a453663ddcf1f","2":"0eb0a2e1fd57b4ac5c48","3":"39e53e003122e024da2e","4":"3f2ce3b9bcdb26b7c92a","5":"bdecba96f71b8dbe444a","6":"1ce631c66eadc37b9cd3","7":"4f4d2337772400783a95","8":"f04e04f0dd22af1c46e1","9":"f086ff964ac2fbcc1529","10":"af45048ec1c70a951c15","11":"f8c5b36ade36ff10a74d","12":"28569da47f51cf7299ba","13":"a3e836ac1e4d6803a7dd","14":"097217ad9053104bc340","15":"e27600401388f78354ff","16":"9dc2eabe873b303b645d","17":"c71b04c74ac5794be39a","18":"4b5a7a577912ec24f73b","19":"04398345a7477a7baa4b","20":"d4ab6a4c7a46a98d1248","21":"05126065c2bf36d0cb12","22":"e752d3c5ddf00475763c","23":"bf6e15ccdde21363e7f4","24":"333e08c908ae032edea3","25":"95c9c93d6ad4bcda7b2f","26":"547e6be36981e45f3e73","27":"39092261b05e2ddfeb20","28":"51196f0ba9699d923056","29":"ad54745e6d5a93cfc730","30":"89d15eb7ba28cc300130","31":"3359d7b09fa3209a8e82","32":"148a020f91641719a66c","33":"ef59bb0cd38fd22c21e8","34":"cb5dcb3159892838b913","35":"7ffe984ae9e803674d53","36":"c6b811d37f91369e95a2","37":"096e6e73a3e8adb3f147","38":"427f7a3b9c18c03bf5ca","39":"24c1ed5fafe0d63de0fd","40":"a0657edc8b1607aa56a8","41":"b1015e72aa8d5efdabed","42":"860d3d6b280af380cca8","43":"f39c579f8a9543db36f8","44":"eeee7dff30046d646c70","45":"14a10ae8be3e150c17b0","46":"cb626f4bd43647660d7e","47":"45f2075689451dd3c807","48":"1ce30d9558308088d9bf","49":"71c85b390895b45578cf","50":"9d382c3344f05d25290f","52":"5a5d4e62b3fcc733a869","53":"6df914569f90cc16a2ff","54":"eaaf75a6f3e07bf2191f","55":"f66b3b0741253720b731","56":"c81682750ef5dc537c8c","57":"e30ed4509a1e8cb8498b","58":"5728a5b61649eeb7cbc1","59":"a8d91bf0eae7d01051f1","60":"257f13bd4f85c011e133","61":"db9d9d02ad5a8fb4624c","62":"5bd1e1db74d0d27dfd9e","63":"8383f6ccb4de915cd28c","64":"c47e5ba931a27146eb99","65":"dfa989e5b218cc66aa5c","66":"c8392ff0d1d20693611c"}[chunkId] + "." + ({}[chunkId]||chunkId) + ".min.js";
/******/ 		var timeout = setTimeout(onScriptComplete, 120000);
/******/ 		script.onerror = script.onload = onScriptComplete;
/******/ 		function onScriptComplete() {
/******/ 			// avoid mem leaks in IE.
/******/ 			script.onerror = script.onload = null;
/******/ 			clearTimeout(timeout);
/******/ 			var chunk = installedChunks[chunkId];
/******/ 			if(chunk !== 0) {
/******/ 				if(chunk) {
/******/ 					chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));
/******/ 				}
/******/ 				installedChunks[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		head.appendChild(script);
/******/
/******/ 		return promise;
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./dev/";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 456);
/******/ })
/************************************************************************/
/******/ ({

/***/ 456:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(457);
__webpack_require__(459);
__webpack_require__(460);
__webpack_require__(461);
__webpack_require__(462);
__webpack_require__(463);
__webpack_require__(464);
__webpack_require__(465);
__webpack_require__(466);
__webpack_require__(467);
__webpack_require__(468);
module.exports = __webpack_require__(469);


/***/ }),

/***/ 457:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// ┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐ \\
// │ Raphaël 2.2.0 - JavaScript Vector Library                                                             │ \\
// ├───────────────────────────────────────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2008-2016 Dmitry Baranovskiy (http://raphaeljs.com)                                       │ \\
// │ Copyright © 2008-2016 Sencha Labs (http://sencha.com)                                                 │ \\
// ├───────────────────────────────────────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT (https://github.com/DmitryBaranovskiy/raphael/blob/master/license.txt) license.│ \\
// └───────────────────────────────────────────────────────────────────────────────────────────────────────┘ \\

(function webpackUniversalModuleDefinition(root, factory) {
	//window.Raphael = window.Raphael || Raphael
	if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') module.exports = window.Raphael = factory();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') exports["Raphael"] = window.Raphael = factory();else root["Raphael"] = window.Raphael = factory();
})(undefined, function () {
	return (/******/function (modules) {
			// webpackBootstrap
			/******/ // The module cache
			/******/var installedModules = {};

			/******/ // The require function
			/******/function __webpack_require__(moduleId) {

				/******/ // Check if module is in cache
				/******/if (installedModules[moduleId])
					/******/return installedModules[moduleId].exports;

				/******/ // Create a new module (and put it into the cache)
				/******/var module = installedModules[moduleId] = {
					/******/exports: {},
					/******/id: moduleId,
					/******/loaded: false
					/******/ };

				/******/ // Execute the module function
				/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

				/******/ // Flag the module as loaded
				/******/module.loaded = true;

				/******/ // Return the exports of the module
				/******/return module.exports;
				/******/
			}

			/******/ // expose the modules object (__webpack_modules__)
			/******/__webpack_require__.m = modules;

			/******/ // expose the module cache
			/******/__webpack_require__.c = installedModules;

			/******/ // __webpack_public_path__
			/******/__webpack_require__.p = "";

			/******/ // Load entry module and return exports
			/******/return __webpack_require__(0);
			/******/
		}(
		/************************************************************************/
		/******/[
		/* 0 */
		/***/function (module, exports, __webpack_require__) {

			var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(3), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (R) {

				return R;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

			/***/
		},
		/* 1 */
		/***/function (module, exports, __webpack_require__) {

			var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (eve) {

				/*\
     * Raphael
     [ method ]
     **
     * Creates a canvas object on which to draw.
     * You must do this first, as all future calls to drawing methods
     * from this instance will be bound to this canvas.
     > Parameters
     **
     - container (HTMLElement|string) DOM element or its ID which is going to be a parent for drawing surface
     - width (number)
     - height (number)
     - callback (function) #optional callback function which is going to be executed in the context of newly created paper
     * or
     - x (number)
     - y (number)
     - width (number)
     - height (number)
     - callback (function) #optional callback function which is going to be executed in the context of newly created paper
     * or
     - all (array) (first 3 or 4 elements in the array are equal to [containerID, width, height] or [x, y, width, height]. The rest are element descriptions in format {type: type, <attributes>}). See @Paper.add.
     - callback (function) #optional callback function which is going to be executed in the context of newly created paper
     * or
     - onReadyCallback (function) function that is going to be called on DOM ready event. You can also subscribe to this event via Eve’s “DOMLoad” event. In this case method returns `undefined`.
     = (object) @Paper
     > Usage
     | // Each of the following examples create a canvas
     | // that is 320px wide by 200px high.
     | // Canvas is created at the viewport’s 10,50 coordinate.
     | var paper = Raphael(10, 50, 320, 200);
     | // Canvas is created at the top left corner of the #notepad element
     | // (or its top right corner in dir="rtl" elements)
     | var paper = Raphael(document.getElementById("notepad"), 320, 200);
     | // Same as above
     | var paper = Raphael("notepad", 320, 200);
     | // Image dump
     | var set = Raphael(["notepad", 320, 200, {
     |     type: "rect",
     |     x: 10,
     |     y: 10,
     |     width: 25,
     |     height: 25,
     |     stroke: "#f00"
     | }, {
     |     type: "text",
     |     x: 30,
     |     y: 40,
     |     text: "Dump"
     | }]);
    \*/
				function R(first) {
					if (R.is(first, "function")) {
						return loaded ? first() : eve.on("raphael.DOMload", first);
					} else if (R.is(first, array)) {
						return R._engine.create[apply](R, first.splice(0, 3 + R.is(first[0], nu))).add(first);
					} else {
						var args = Array.prototype.slice.call(arguments, 0);
						if (R.is(args[args.length - 1], "function")) {
							var f = args.pop();
							return loaded ? f.call(R._engine.create[apply](R, args)) : eve.on("raphael.DOMload", function () {
								f.call(R._engine.create[apply](R, args));
							});
						} else {
							return R._engine.create[apply](R, arguments);
						}
					}
				}
				R.version = "2.2.0";
				R.eve = eve;
				var loaded,
				    separator = /[, ]+/,
				    elements = { circle: 1, rect: 1, path: 1, ellipse: 1, text: 1, image: 1 },
				    formatrg = /\{(\d+)\}/g,
				    proto = "prototype",
				    has = "hasOwnProperty",
				    g = {
					doc: document,
					win: window
				},
				    oldRaphael = {
					was: Object.prototype[has].call(g.win, "Raphael"),
					is: g.win.Raphael
				},
				    Paper = function Paper() {
					/*\
      * Paper.ca
      [ property (object) ]
      **
      * Shortcut for @Paper.customAttributes
     \*/
					/*\
      * Paper.customAttributes
      [ property (object) ]
      **
      * If you have a set of attributes that you would like to represent
      * as a function of some number you can do it easily with custom attributes:
      > Usage
      | paper.customAttributes.hue = function (num) {
      |     num = num % 1;
      |     return {fill: "hsb(" + num + ", 0.75, 1)"};
      | };
      | // Custom attribute “hue” will change fill
      | // to be given hue with fixed saturation and brightness.
      | // Now you can use it like this:
      | var c = paper.circle(10, 10, 10).attr({hue: .45});
      | // or even like this:
      | c.animate({hue: 1}, 1e3);
      |
      | // You could also create custom attribute
      | // with multiple parameters:
      | paper.customAttributes.hsb = function (h, s, b) {
      |     return {fill: "hsb(" + [h, s, b].join(",") + ")"};
      | };
      | c.attr({hsb: "0.5 .8 1"});
      | c.animate({hsb: [1, 0, 0.5]}, 1e3);
     \*/
					this.ca = this.customAttributes = {};
				},
				    paperproto,
				    appendChild = "appendChild",
				    apply = "apply",
				    concat = "concat",
				    supportsTouch = 'ontouchstart' in g.win || g.win.DocumentTouch && g.doc instanceof DocumentTouch,
				    //taken from Modernizr touch test
				E = "",
				    S = " ",
				    Str = String,
				    split = "split",
				    events = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[split](S),
				    touchMap = {
					mousedown: "touchstart",
					mousemove: "touchmove",
					mouseup: "touchend"
				},
				    lowerCase = Str.prototype.toLowerCase,
				    math = Math,
				    mmax = math.max,
				    mmin = math.min,
				    abs = math.abs,
				    pow = math.pow,
				    PI = math.PI,
				    nu = "number",
				    string = "string",
				    array = "array",
				    toString = "toString",
				    fillString = "fill",
				    objectToString = Object.prototype.toString,
				    paper = {},
				    push = "push",
				    ISURL = R._ISURL = /^url\(['"]?(.+?)['"]?\)$/i,
				    colourRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,
				    isnan = { "NaN": 1, "Infinity": 1, "-Infinity": 1 },
				    bezierrg = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,
				    round = math.round,
				    setAttribute = "setAttribute",
				    toFloat = parseFloat,
				    toInt = parseInt,
				    upperCase = Str.prototype.toUpperCase,
				    availableAttrs = R._availableAttrs = {
					"arrow-end": "none",
					"arrow-start": "none",
					blur: 0,
					"clip-rect": "0 0 1e9 1e9",
					cursor: "default",
					cx: 0,
					cy: 0,
					fill: "#fff",
					"fill-opacity": 1,
					font: '10px "Arial"',
					"font-family": '"Arial"',
					"font-size": "10",
					"font-style": "normal",
					"font-weight": 400,
					gradient: 0,
					height: 0,
					href: "http://raphaeljs.com/",
					"letter-spacing": 0,
					opacity: 1,
					path: "M0,0",
					r: 0,
					rx: 0,
					ry: 0,
					src: "",
					stroke: "#000",
					"stroke-dasharray": "",
					"stroke-linecap": "butt",
					"stroke-linejoin": "butt",
					"stroke-miterlimit": 0,
					"stroke-opacity": 1,
					"stroke-width": 1,
					target: "_blank",
					"text-anchor": "middle",
					title: "Raphael",
					transform: "",
					width: 0,
					x: 0,
					y: 0,
					"class": ""
				},
				    availableAnimAttrs = R._availableAnimAttrs = {
					blur: nu,
					"clip-rect": "csv",
					cx: nu,
					cy: nu,
					fill: "colour",
					"fill-opacity": nu,
					"font-size": nu,
					height: nu,
					opacity: nu,
					path: "path",
					r: nu,
					rx: nu,
					ry: nu,
					stroke: "colour",
					"stroke-opacity": nu,
					"stroke-width": nu,
					transform: "transform",
					width: nu,
					x: nu,
					y: nu
				},
				    whitespace = /[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]/g,
				    commaSpaces = /[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/,
				    hsrg = { hs: 1, rg: 1 },
				    p2s = /,?([achlmqrstvxz]),?/gi,
				    pathCommand = /([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,
				    tCommand = /([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,
				    pathValues = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/ig,
				    radial_gradient = R._radial_gradient = /^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/,
				    eldata = {},
				    sortByKey = function sortByKey(a, b) {
					return a.key - b.key;
				},
				    sortByNumber = function sortByNumber(a, b) {
					return toFloat(a) - toFloat(b);
				},
				    fun = function fun() {},
				    pipe = function pipe(x) {
					return x;
				},
				    rectPath = R._rectPath = function (x, y, w, h, r) {
					if (r) {
						return [["M", x + r, y], ["l", w - r * 2, 0], ["a", r, r, 0, 0, 1, r, r], ["l", 0, h - r * 2], ["a", r, r, 0, 0, 1, -r, r], ["l", r * 2 - w, 0], ["a", r, r, 0, 0, 1, -r, -r], ["l", 0, r * 2 - h], ["a", r, r, 0, 0, 1, r, -r], ["z"]];
					}
					return [["M", x, y], ["l", w, 0], ["l", 0, h], ["l", -w, 0], ["z"]];
				},
				    ellipsePath = function ellipsePath(x, y, rx, ry) {
					if (ry == null) {
						ry = rx;
					}
					return [["M", x, y], ["m", 0, -ry], ["a", rx, ry, 0, 1, 1, 0, 2 * ry], ["a", rx, ry, 0, 1, 1, 0, -2 * ry], ["z"]];
				},
				    getPath = R._getPath = {
					path: function path(el) {
						return el.attr("path");
					},
					circle: function circle(el) {
						var a = el.attrs;
						return ellipsePath(a.cx, a.cy, a.r);
					},
					ellipse: function ellipse(el) {
						var a = el.attrs;
						return ellipsePath(a.cx, a.cy, a.rx, a.ry);
					},
					rect: function rect(el) {
						var a = el.attrs;
						return rectPath(a.x, a.y, a.width, a.height, a.r);
					},
					image: function image(el) {
						var a = el.attrs;
						return rectPath(a.x, a.y, a.width, a.height);
					},
					text: function text(el) {
						var bbox = el._getBBox();
						return rectPath(bbox.x, bbox.y, bbox.width, bbox.height);
					},
					set: function set(el) {
						var bbox = el._getBBox();
						return rectPath(bbox.x, bbox.y, bbox.width, bbox.height);
					}
				},

				/*\
     * Raphael.mapPath
     [ method ]
     **
     * Transform the path string with given matrix.
     > Parameters
     - path (string) path string
     - matrix (object) see @Matrix
     = (string) transformed path string
    \*/
				mapPath = R.mapPath = function (path, matrix) {
					if (!matrix) {
						return path;
					}
					var x, y, i, j, ii, jj, pathi;
					path = path2curve(path);
					for (i = 0, ii = path.length; i < ii; i++) {
						pathi = path[i];
						for (j = 1, jj = pathi.length; j < jj; j += 2) {
							x = matrix.x(pathi[j], pathi[j + 1]);
							y = matrix.y(pathi[j], pathi[j + 1]);
							pathi[j] = x;
							pathi[j + 1] = y;
						}
					}
					return path;
				};

				R._g = g;
				/*\
     * Raphael.type
     [ property (string) ]
     **
     * Can be “SVG”, “VML” or empty, depending on browser support.
    \*/
				R.type = g.win.SVGAngle || g.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML";
				if (R.type == "VML") {
					var d = g.doc.createElement("div"),
					    b;
					d.innerHTML = '<v:shape adj="1"/>';
					b = d.firstChild;
					b.style.behavior = "url(#default#VML)";
					if (!(b && _typeof(b.adj) == "object")) {
						return R.type = E;
					}
					d = null;
				}
				/*\
     * Raphael.svg
     [ property (boolean) ]
     **
     * `true` if browser supports SVG.
    \*/
				/*\
     * Raphael.vml
     [ property (boolean) ]
     **
     * `true` if browser supports VML.
    \*/
				R.svg = !(R.vml = R.type == "VML");
				R._Paper = Paper;
				/*\
     * Raphael.fn
     [ property (object) ]
     **
     * You can add your own method to the canvas. For example if you want to draw a pie chart,
     * you can create your own pie chart function and ship it as a Raphaël plugin. To do this
     * you need to extend the `Raphael.fn` object. You should modify the `fn` object before a
     * Raphaël instance is created, otherwise it will take no effect. Please note that the
     * ability for namespaced plugins was removed in Raphael 2.0. It is up to the plugin to
     * ensure any namespacing ensures proper context.
     > Usage
     | Raphael.fn.arrow = function (x1, y1, x2, y2, size) {
     |     return this.path( ... );
     | };
     | // or create namespace
     | Raphael.fn.mystuff = {
     |     arrow: function () {…},
     |     star: function () {…},
     |     // etc…
     | };
     | var paper = Raphael(10, 10, 630, 480);
     | // then use it
     | paper.arrow(10, 10, 30, 30, 5).attr({fill: "#f00"});
     | paper.mystuff.arrow();
     | paper.mystuff.star();
    \*/
				R.fn = paperproto = Paper.prototype = R.prototype;
				R._id = 0;
				/*\
     * Raphael.is
     [ method ]
     **
     * Handful of replacements for `typeof` operator.
     > Parameters
     - o (…) any object or primitive
     - type (string) name of the type, i.e. “string”, “function”, “number”, etc.
     = (boolean) is given value is of given type
    \*/
				R.is = function (o, type) {
					type = lowerCase.call(type);
					if (type == "finite") {
						return !isnan[has](+o);
					}
					if (type == "array") {
						return o instanceof Array;
					}
					return type == "null" && o === null || type == (typeof o === 'undefined' ? 'undefined' : _typeof(o)) && o !== null || type == "object" && o === Object(o) || type == "array" && Array.isArray && Array.isArray(o) || objectToString.call(o).slice(8, -1).toLowerCase() == type;
				};

				function clone(obj) {
					if (typeof obj == "function" || Object(obj) !== obj) {
						return obj;
					}
					var res = new obj.constructor();
					for (var key in obj) {
						if (obj[has](key)) {
							res[key] = clone(obj[key]);
						}
					}return res;
				}

				/*\
     * Raphael.angle
     [ method ]
     **
     * Returns angle between two or three points
     > Parameters
     - x1 (number) x coord of first point
     - y1 (number) y coord of first point
     - x2 (number) x coord of second point
     - y2 (number) y coord of second point
     - x3 (number) #optional x coord of third point
     - y3 (number) #optional y coord of third point
     = (number) angle in degrees.
    \*/
				R.angle = function (x1, y1, x2, y2, x3, y3) {
					if (x3 == null) {
						var x = x1 - x2,
						    y = y1 - y2;
						if (!x && !y) {
							return 0;
						}
						return (180 + math.atan2(-y, -x) * 180 / PI + 360) % 360;
					} else {
						return R.angle(x1, y1, x3, y3) - R.angle(x2, y2, x3, y3);
					}
				};
				/*\
     * Raphael.rad
     [ method ]
     **
     * Transform angle to radians
     > Parameters
     - deg (number) angle in degrees
     = (number) angle in radians.
    \*/
				R.rad = function (deg) {
					return deg % 360 * PI / 180;
				};
				/*\
     * Raphael.deg
     [ method ]
     **
     * Transform angle to degrees
     > Parameters
     - rad (number) angle in radians
     = (number) angle in degrees.
    \*/
				R.deg = function (rad) {
					return Math.round(rad * 180 / PI % 360 * 1000) / 1000;
				};
				/*\
     * Raphael.snapTo
     [ method ]
     **
     * Snaps given value to given grid.
     > Parameters
     - values (array|number) given array of values or step of the grid
     - value (number) value to adjust
     - tolerance (number) #optional tolerance for snapping. Default is `10`.
     = (number) adjusted value.
    \*/
				R.snapTo = function (values, value, tolerance) {
					tolerance = R.is(tolerance, "finite") ? tolerance : 10;
					if (R.is(values, array)) {
						var i = values.length;
						while (i--) {
							if (abs(values[i] - value) <= tolerance) {
								return values[i];
							}
						}
					} else {
						values = +values;
						var rem = value % values;
						if (rem < tolerance) {
							return value - rem;
						}
						if (rem > values - tolerance) {
							return value - rem + values;
						}
					}
					return value;
				};

				/*\
     * Raphael.createUUID
     [ method ]
     **
     * Returns RFC4122, version 4 ID
    \*/
				var createUUID = R.createUUID = function (uuidRegEx, uuidReplacer) {
					return function () {
						return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
					};
				}(/[xy]/g, function (c) {
					var r = math.random() * 16 | 0,
					    v = c == "x" ? r : r & 3 | 8;
					return v.toString(16);
				});

				/*\
     * Raphael.setWindow
     [ method ]
     **
     * Used when you need to draw in `&lt;iframe>`. Switched window to the iframe one.
     > Parameters
     - newwin (window) new window object
    \*/
				R.setWindow = function (newwin) {
					eve("raphael.setWindow", R, g.win, newwin);
					g.win = newwin;
					g.doc = g.win.document;
					if (R._engine.initWin) {
						R._engine.initWin(g.win);
					}
				};
				var _toHex = function toHex(color) {
					if (R.vml) {
						// http://dean.edwards.name/weblog/2009/10/convert-any-colour-value-to-hex-in-msie/
						var trim = /^\s+|\s+$/g;
						var bod;
						try {
							var docum = new ActiveXObject("htmlfile");
							docum.write("<body>");
							docum.close();
							bod = docum.body;
						} catch (e) {
							bod = createPopup().document.body;
						}
						var range = bod.createTextRange();
						_toHex = cacher(function (color) {
							try {
								bod.style.color = Str(color).replace(trim, E);
								var value = range.queryCommandValue("ForeColor");
								value = (value & 255) << 16 | value & 65280 | (value & 16711680) >>> 16;
								return "#" + ("000000" + value.toString(16)).slice(-6);
							} catch (e) {
								return "none";
							}
						});
					} else {
						var i = g.doc.createElement("i");
						i.title = "Rapha\xebl Colour Picker";
						i.style.display = "none";
						g.doc.body.appendChild(i);
						_toHex = cacher(function (color) {
							i.style.color = color;
							return g.doc.defaultView.getComputedStyle(i, E).getPropertyValue("color");
						});
					}
					return _toHex(color);
				},
				    hsbtoString = function hsbtoString() {
					return "hsb(" + [this.h, this.s, this.b] + ")";
				},
				    hsltoString = function hsltoString() {
					return "hsl(" + [this.h, this.s, this.l] + ")";
				},
				    rgbtoString = function rgbtoString() {
					return this.hex;
				},
				    prepareRGB = function prepareRGB(r, g, b) {
					if (g == null && R.is(r, "object") && "r" in r && "g" in r && "b" in r) {
						b = r.b;
						g = r.g;
						r = r.r;
					}
					if (g == null && R.is(r, string)) {
						var clr = R.getRGB(r);
						r = clr.r;
						g = clr.g;
						b = clr.b;
					}
					if (r > 1 || g > 1 || b > 1) {
						r /= 255;
						g /= 255;
						b /= 255;
					}

					return [r, g, b];
				},
				    packageRGB = function packageRGB(r, g, b, o) {
					r *= 255;
					g *= 255;
					b *= 255;
					var rgb = {
						r: r,
						g: g,
						b: b,
						hex: R.rgb(r, g, b),
						toString: rgbtoString
					};
					R.is(o, "finite") && (rgb.opacity = o);
					return rgb;
				};

				/*\
     * Raphael.color
     [ method ]
     **
     * Parses the color string and returns object with all values for the given color.
     > Parameters
     - clr (string) color string in one of the supported formats (see @Raphael.getRGB)
     = (object) Combined RGB & HSB object in format:
     o {
     o     r (number) red,
     o     g (number) green,
     o     b (number) blue,
     o     hex (string) color in HTML/CSS format: #••••••,
     o     error (boolean) `true` if string can’t be parsed,
     o     h (number) hue,
     o     s (number) saturation,
     o     v (number) value (brightness),
     o     l (number) lightness
     o }
    \*/
				R.color = function (clr) {
					var rgb;
					if (R.is(clr, "object") && "h" in clr && "s" in clr && "b" in clr) {
						rgb = R.hsb2rgb(clr);
						clr.r = rgb.r;
						clr.g = rgb.g;
						clr.b = rgb.b;
						clr.hex = rgb.hex;
					} else if (R.is(clr, "object") && "h" in clr && "s" in clr && "l" in clr) {
						rgb = R.hsl2rgb(clr);
						clr.r = rgb.r;
						clr.g = rgb.g;
						clr.b = rgb.b;
						clr.hex = rgb.hex;
					} else {
						if (R.is(clr, "string")) {
							clr = R.getRGB(clr);
						}
						if (R.is(clr, "object") && "r" in clr && "g" in clr && "b" in clr) {
							rgb = R.rgb2hsl(clr);
							clr.h = rgb.h;
							clr.s = rgb.s;
							clr.l = rgb.l;
							rgb = R.rgb2hsb(clr);
							clr.v = rgb.b;
						} else {
							clr = { hex: "none" };
							clr.r = clr.g = clr.b = clr.h = clr.s = clr.v = clr.l = -1;
						}
					}
					clr.toString = rgbtoString;
					return clr;
				};
				/*\
     * Raphael.hsb2rgb
     [ method ]
     **
     * Converts HSB values to RGB object.
     > Parameters
     - h (number) hue
     - s (number) saturation
     - v (number) value or brightness
     = (object) RGB object in format:
     o {
     o     r (number) red,
     o     g (number) green,
     o     b (number) blue,
     o     hex (string) color in HTML/CSS format: #••••••
     o }
    \*/
				R.hsb2rgb = function (h, s, v, o) {
					if (this.is(h, "object") && "h" in h && "s" in h && "b" in h) {
						v = h.b;
						s = h.s;
						o = h.o;
						h = h.h;
					}
					h *= 360;
					var R, G, B, X, C;
					h = h % 360 / 60;
					C = v * s;
					X = C * (1 - abs(h % 2 - 1));
					R = G = B = v - C;

					h = ~~h;
					R += [C, X, 0, 0, X, C][h];
					G += [X, C, C, X, 0, 0][h];
					B += [0, 0, X, C, C, X][h];
					return packageRGB(R, G, B, o);
				};
				/*\
     * Raphael.hsl2rgb
     [ method ]
     **
     * Converts HSL values to RGB object.
     > Parameters
     - h (number) hue
     - s (number) saturation
     - l (number) luminosity
     = (object) RGB object in format:
     o {
     o     r (number) red,
     o     g (number) green,
     o     b (number) blue,
     o     hex (string) color in HTML/CSS format: #••••••
     o }
    \*/
				R.hsl2rgb = function (h, s, l, o) {
					if (this.is(h, "object") && "h" in h && "s" in h && "l" in h) {
						l = h.l;
						s = h.s;
						h = h.h;
					}
					if (h > 1 || s > 1 || l > 1) {
						h /= 360;
						s /= 100;
						l /= 100;
					}
					h *= 360;
					var R, G, B, X, C;
					h = h % 360 / 60;
					C = 2 * s * (l < .5 ? l : 1 - l);
					X = C * (1 - abs(h % 2 - 1));
					R = G = B = l - C / 2;

					h = ~~h;
					R += [C, X, 0, 0, X, C][h];
					G += [X, C, C, X, 0, 0][h];
					B += [0, 0, X, C, C, X][h];
					return packageRGB(R, G, B, o);
				};
				/*\
     * Raphael.rgb2hsb
     [ method ]
     **
     * Converts RGB values to HSB object.
     > Parameters
     - r (number) red
     - g (number) green
     - b (number) blue
     = (object) HSB object in format:
     o {
     o     h (number) hue
     o     s (number) saturation
     o     b (number) brightness
     o }
    \*/
				R.rgb2hsb = function (r, g, b) {
					b = prepareRGB(r, g, b);
					r = b[0];
					g = b[1];
					b = b[2];

					var H, S, V, C;
					V = mmax(r, g, b);
					C = V - mmin(r, g, b);
					H = C == 0 ? null : V == r ? (g - b) / C : V == g ? (b - r) / C + 2 : (r - g) / C + 4;
					H = (H + 360) % 6 * 60 / 360;
					S = C == 0 ? 0 : C / V;
					return { h: H, s: S, b: V, toString: hsbtoString };
				};
				/*\
     * Raphael.rgb2hsl
     [ method ]
     **
     * Converts RGB values to HSL object.
     > Parameters
     - r (number) red
     - g (number) green
     - b (number) blue
     = (object) HSL object in format:
     o {
     o     h (number) hue
     o     s (number) saturation
     o     l (number) luminosity
     o }
    \*/
				R.rgb2hsl = function (r, g, b) {
					b = prepareRGB(r, g, b);
					r = b[0];
					g = b[1];
					b = b[2];

					var H, S, L, M, m, C;
					M = mmax(r, g, b);
					m = mmin(r, g, b);
					C = M - m;
					H = C == 0 ? null : M == r ? (g - b) / C : M == g ? (b - r) / C + 2 : (r - g) / C + 4;
					H = (H + 360) % 6 * 60 / 360;
					L = (M + m) / 2;
					S = C == 0 ? 0 : L < .5 ? C / (2 * L) : C / (2 - 2 * L);
					return { h: H, s: S, l: L, toString: hsltoString };
				};
				R._path2string = function () {
					return this.join(",").replace(p2s, "$1");
				};
				function repush(array, item) {
					for (var i = 0, ii = array.length; i < ii; i++) {
						if (array[i] === item) {
							return array.push(array.splice(i, 1)[0]);
						}
					}
				}
				function cacher(f, scope, postprocessor) {
					function newf() {
						var arg = Array.prototype.slice.call(arguments, 0),
						    args = arg.join('\u2400'),
						    cache = newf.cache = newf.cache || {},
						    count = newf.count = newf.count || [];
						if (cache[has](args)) {
							repush(count, args);
							return postprocessor ? postprocessor(cache[args]) : cache[args];
						}
						count.length >= 1e3 && delete cache[count.shift()];
						count.push(args);
						cache[args] = f[apply](scope, arg);
						return postprocessor ? postprocessor(cache[args]) : cache[args];
					}
					return newf;
				}

				var preload = R._preload = function (src, f) {
					var img = g.doc.createElement("img");
					img.style.cssText = "position:absolute;left:-9999em;top:-9999em";
					img.onload = function () {
						f.call(this);
						this.onload = null;
						g.doc.body.removeChild(this);
					};
					img.onerror = function () {
						g.doc.body.removeChild(this);
					};
					g.doc.body.appendChild(img);
					img.src = src;
				};

				function clrToString() {
					return this.hex;
				}

				/*\
     * Raphael.getRGB
     [ method ]
     **
     * Parses colour string as RGB object
     > Parameters
     - colour (string) colour string in one of formats:
     # <ul>
     #     <li>Colour name (“<code>red</code>”, “<code>green</code>”, “<code>cornflowerblue</code>”, etc)</li>
     #     <li>#••• — shortened HTML colour: (“<code>#000</code>”, “<code>#fc0</code>”, etc)</li>
     #     <li>#•••••• — full length HTML colour: (“<code>#000000</code>”, “<code>#bd2300</code>”)</li>
     #     <li>rgb(•••, •••, •••) — red, green and blue channels’ values: (“<code>rgb(200,&nbsp;100,&nbsp;0)</code>”)</li>
     #     <li>rgb(•••%, •••%, •••%) — same as above, but in %: (“<code>rgb(100%,&nbsp;175%,&nbsp;0%)</code>”)</li>
     #     <li>hsb(•••, •••, •••) — hue, saturation and brightness values: (“<code>hsb(0.5,&nbsp;0.25,&nbsp;1)</code>”)</li>
     #     <li>hsb(•••%, •••%, •••%) — same as above, but in %</li>
     #     <li>hsl(•••, •••, •••) — same as hsb</li>
     #     <li>hsl(•••%, •••%, •••%) — same as hsb</li>
     # </ul>
     = (object) RGB object in format:
     o {
     o     r (number) red,
     o     g (number) green,
     o     b (number) blue
     o     hex (string) color in HTML/CSS format: #••••••,
     o     error (boolean) true if string can’t be parsed
     o }
    \*/
				R.getRGB = cacher(function (colour) {
					if (!colour || !!((colour = Str(colour)).indexOf("-") + 1)) {
						return { r: -1, g: -1, b: -1, hex: "none", error: 1, toString: clrToString };
					}
					if (colour == "none") {
						return { r: -1, g: -1, b: -1, hex: "none", toString: clrToString };
					}
					!(hsrg[has](colour.toLowerCase().substring(0, 2)) || colour.charAt() == "#") && (colour = _toHex(colour));
					var res,
					    red,
					    green,
					    blue,
					    opacity,
					    t,
					    values,
					    rgb = colour.match(colourRegExp);
					if (rgb) {
						if (rgb[2]) {
							blue = toInt(rgb[2].substring(5), 16);
							green = toInt(rgb[2].substring(3, 5), 16);
							red = toInt(rgb[2].substring(1, 3), 16);
						}
						if (rgb[3]) {
							blue = toInt((t = rgb[3].charAt(3)) + t, 16);
							green = toInt((t = rgb[3].charAt(2)) + t, 16);
							red = toInt((t = rgb[3].charAt(1)) + t, 16);
						}
						if (rgb[4]) {
							values = rgb[4][split](commaSpaces);
							red = toFloat(values[0]);
							values[0].slice(-1) == "%" && (red *= 2.55);
							green = toFloat(values[1]);
							values[1].slice(-1) == "%" && (green *= 2.55);
							blue = toFloat(values[2]);
							values[2].slice(-1) == "%" && (blue *= 2.55);
							rgb[1].toLowerCase().slice(0, 4) == "rgba" && (opacity = toFloat(values[3]));
							values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
						}
						if (rgb[5]) {
							values = rgb[5][split](commaSpaces);
							red = toFloat(values[0]);
							values[0].slice(-1) == "%" && (red *= 2.55);
							green = toFloat(values[1]);
							values[1].slice(-1) == "%" && (green *= 2.55);
							blue = toFloat(values[2]);
							values[2].slice(-1) == "%" && (blue *= 2.55);
							(values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
							rgb[1].toLowerCase().slice(0, 4) == "hsba" && (opacity = toFloat(values[3]));
							values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
							return R.hsb2rgb(red, green, blue, opacity);
						}
						if (rgb[6]) {
							values = rgb[6][split](commaSpaces);
							red = toFloat(values[0]);
							values[0].slice(-1) == "%" && (red *= 2.55);
							green = toFloat(values[1]);
							values[1].slice(-1) == "%" && (green *= 2.55);
							blue = toFloat(values[2]);
							values[2].slice(-1) == "%" && (blue *= 2.55);
							(values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
							rgb[1].toLowerCase().slice(0, 4) == "hsla" && (opacity = toFloat(values[3]));
							values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
							return R.hsl2rgb(red, green, blue, opacity);
						}
						rgb = { r: red, g: green, b: blue, toString: clrToString };
						rgb.hex = "#" + (16777216 | blue | green << 8 | red << 16).toString(16).slice(1);
						R.is(opacity, "finite") && (rgb.opacity = opacity);
						return rgb;
					}
					return { r: -1, g: -1, b: -1, hex: "none", error: 1, toString: clrToString };
				}, R);
				/*\
     * Raphael.hsb
     [ method ]
     **
     * Converts HSB values to hex representation of the colour.
     > Parameters
     - h (number) hue
     - s (number) saturation
     - b (number) value or brightness
     = (string) hex representation of the colour.
    \*/
				R.hsb = cacher(function (h, s, b) {
					return R.hsb2rgb(h, s, b).hex;
				});
				/*\
     * Raphael.hsl
     [ method ]
     **
     * Converts HSL values to hex representation of the colour.
     > Parameters
     - h (number) hue
     - s (number) saturation
     - l (number) luminosity
     = (string) hex representation of the colour.
    \*/
				R.hsl = cacher(function (h, s, l) {
					return R.hsl2rgb(h, s, l).hex;
				});
				/*\
     * Raphael.rgb
     [ method ]
     **
     * Converts RGB values to hex representation of the colour.
     > Parameters
     - r (number) red
     - g (number) green
     - b (number) blue
     = (string) hex representation of the colour.
    \*/
				R.rgb = cacher(function (r, g, b) {
					function round(x) {
						return x + 0.5 | 0;
					}
					return "#" + (16777216 | round(b) | round(g) << 8 | round(r) << 16).toString(16).slice(1);
				});
				/*\
     * Raphael.getColor
     [ method ]
     **
     * On each call returns next colour in the spectrum. To reset it back to red call @Raphael.getColor.reset
     > Parameters
     - value (number) #optional brightness, default is `0.75`
     = (string) hex representation of the colour.
    \*/
				R.getColor = function (value) {
					var start = this.getColor.start = this.getColor.start || { h: 0, s: 1, b: value || .75 },
					    rgb = this.hsb2rgb(start.h, start.s, start.b);
					start.h += .075;
					if (start.h > 1) {
						start.h = 0;
						start.s -= .2;
						start.s <= 0 && (this.getColor.start = { h: 0, s: 1, b: start.b });
					}
					return rgb.hex;
				};
				/*\
     * Raphael.getColor.reset
     [ method ]
     **
     * Resets spectrum position for @Raphael.getColor back to red.
    \*/
				R.getColor.reset = function () {
					delete this.start;
				};

				// http://schepers.cc/getting-to-the-point
				function catmullRom2bezier(crp, z) {
					var d = [];
					for (var i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2) {
						var p = [{ x: +crp[i - 2], y: +crp[i - 1] }, { x: +crp[i], y: +crp[i + 1] }, { x: +crp[i + 2], y: +crp[i + 3] }, { x: +crp[i + 4], y: +crp[i + 5] }];
						if (z) {
							if (!i) {
								p[0] = { x: +crp[iLen - 2], y: +crp[iLen - 1] };
							} else if (iLen - 4 == i) {
								p[3] = { x: +crp[0], y: +crp[1] };
							} else if (iLen - 2 == i) {
								p[2] = { x: +crp[0], y: +crp[1] };
								p[3] = { x: +crp[2], y: +crp[3] };
							}
						} else {
							if (iLen - 4 == i) {
								p[3] = p[2];
							} else if (!i) {
								p[0] = { x: +crp[i], y: +crp[i + 1] };
							}
						}
						d.push(["C", (-p[0].x + 6 * p[1].x + p[2].x) / 6, (-p[0].y + 6 * p[1].y + p[2].y) / 6, (p[1].x + 6 * p[2].x - p[3].x) / 6, (p[1].y + 6 * p[2].y - p[3].y) / 6, p[2].x, p[2].y]);
					}

					return d;
				}
				/*\
     * Raphael.parsePathString
     [ method ]
     **
     * Utility method
     **
     * Parses given path string into an array of arrays of path segments.
     > Parameters
     - pathString (string|array) path string or array of segments (in the last case it will be returned straight away)
     = (array) array of segments.
    \*/
				R.parsePathString = function (pathString) {
					if (!pathString) {
						return null;
					}
					var pth = paths(pathString);
					if (pth.arr) {
						return pathClone(pth.arr);
					}

					var paramCounts = { a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0 },
					    data = [];
					if (R.is(pathString, array) && R.is(pathString[0], array)) {
						// rough assumption
						data = pathClone(pathString);
					}
					if (!data.length) {
						Str(pathString).replace(pathCommand, function (a, b, c) {
							var params = [],
							    name = b.toLowerCase();
							c.replace(pathValues, function (a, b) {
								b && params.push(+b);
							});
							if (name == "m" && params.length > 2) {
								data.push([b][concat](params.splice(0, 2)));
								name = "l";
								b = b == "m" ? "l" : "L";
							}
							if (name == "r") {
								data.push([b][concat](params));
							} else while (params.length >= paramCounts[name]) {
								data.push([b][concat](params.splice(0, paramCounts[name])));
								if (!paramCounts[name]) {
									break;
								}
							}
						});
					}
					data.toString = R._path2string;
					pth.arr = pathClone(data);
					return data;
				};
				/*\
     * Raphael.parseTransformString
     [ method ]
     **
     * Utility method
     **
     * Parses given path string into an array of transformations.
     > Parameters
     - TString (string|array) transform string or array of transformations (in the last case it will be returned straight away)
     = (array) array of transformations.
    \*/
				R.parseTransformString = cacher(function (TString) {
					if (!TString) {
						return null;
					}
					var paramCounts = { r: 3, s: 4, t: 2, m: 6 },
					    data = [];
					if (R.is(TString, array) && R.is(TString[0], array)) {
						// rough assumption
						data = pathClone(TString);
					}
					if (!data.length) {
						Str(TString).replace(tCommand, function (a, b, c) {
							var params = [],
							    name = lowerCase.call(b);
							c.replace(pathValues, function (a, b) {
								b && params.push(+b);
							});
							data.push([b][concat](params));
						});
					}
					data.toString = R._path2string;
					return data;
				});
				// PATHS
				var paths = function paths(ps) {
					var p = paths.ps = paths.ps || {};
					if (p[ps]) {
						p[ps].sleep = 100;
					} else {
						p[ps] = {
							sleep: 100
						};
					}
					setTimeout(function () {
						for (var key in p) {
							if (p[has](key) && key != ps) {
								p[key].sleep--;
								!p[key].sleep && delete p[key];
							}
						}
					});
					return p[ps];
				};
				/*\
     * Raphael.findDotsAtSegment
     [ method ]
     **
     * Utility method
     **
     * Find dot coordinates on the given cubic bezier curve at the given t.
     > Parameters
     - p1x (number) x of the first point of the curve
     - p1y (number) y of the first point of the curve
     - c1x (number) x of the first anchor of the curve
     - c1y (number) y of the first anchor of the curve
     - c2x (number) x of the second anchor of the curve
     - c2y (number) y of the second anchor of the curve
     - p2x (number) x of the second point of the curve
     - p2y (number) y of the second point of the curve
     - t (number) position on the curve (0..1)
     = (object) point information in format:
     o {
     o     x: (number) x coordinate of the point
     o     y: (number) y coordinate of the point
     o     m: {
     o         x: (number) x coordinate of the left anchor
     o         y: (number) y coordinate of the left anchor
     o     }
     o     n: {
     o         x: (number) x coordinate of the right anchor
     o         y: (number) y coordinate of the right anchor
     o     }
     o     start: {
     o         x: (number) x coordinate of the start of the curve
     o         y: (number) y coordinate of the start of the curve
     o     }
     o     end: {
     o         x: (number) x coordinate of the end of the curve
     o         y: (number) y coordinate of the end of the curve
     o     }
     o     alpha: (number) angle of the curve derivative at the point
     o }
    \*/
				R.findDotsAtSegment = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
					var t1 = 1 - t,
					    t13 = pow(t1, 3),
					    t12 = pow(t1, 2),
					    t2 = t * t,
					    t3 = t2 * t,
					    x = t13 * p1x + t12 * 3 * t * c1x + t1 * 3 * t * t * c2x + t3 * p2x,
					    y = t13 * p1y + t12 * 3 * t * c1y + t1 * 3 * t * t * c2y + t3 * p2y,
					    mx = p1x + 2 * t * (c1x - p1x) + t2 * (c2x - 2 * c1x + p1x),
					    my = p1y + 2 * t * (c1y - p1y) + t2 * (c2y - 2 * c1y + p1y),
					    nx = c1x + 2 * t * (c2x - c1x) + t2 * (p2x - 2 * c2x + c1x),
					    ny = c1y + 2 * t * (c2y - c1y) + t2 * (p2y - 2 * c2y + c1y),
					    ax = t1 * p1x + t * c1x,
					    ay = t1 * p1y + t * c1y,
					    cx = t1 * c2x + t * p2x,
					    cy = t1 * c2y + t * p2y,
					    alpha = 90 - math.atan2(mx - nx, my - ny) * 180 / PI;
					(mx > nx || my < ny) && (alpha += 180);
					return {
						x: x,
						y: y,
						m: { x: mx, y: my },
						n: { x: nx, y: ny },
						start: { x: ax, y: ay },
						end: { x: cx, y: cy },
						alpha: alpha
					};
				};
				/*\
     * Raphael.bezierBBox
     [ method ]
     **
     * Utility method
     **
     * Return bounding box of a given cubic bezier curve
     > Parameters
     - p1x (number) x of the first point of the curve
     - p1y (number) y of the first point of the curve
     - c1x (number) x of the first anchor of the curve
     - c1y (number) y of the first anchor of the curve
     - c2x (number) x of the second anchor of the curve
     - c2y (number) y of the second anchor of the curve
     - p2x (number) x of the second point of the curve
     - p2y (number) y of the second point of the curve
     * or
     - bez (array) array of six points for bezier curve
     = (object) point information in format:
     o {
     o     min: {
     o         x: (number) x coordinate of the left point
     o         y: (number) y coordinate of the top point
     o     }
     o     max: {
     o         x: (number) x coordinate of the right point
     o         y: (number) y coordinate of the bottom point
     o     }
     o }
    \*/
				R.bezierBBox = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
					if (!R.is(p1x, "array")) {
						p1x = [p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y];
					}
					var bbox = curveDim.apply(null, p1x);
					return {
						x: bbox.min.x,
						y: bbox.min.y,
						x2: bbox.max.x,
						y2: bbox.max.y,
						width: bbox.max.x - bbox.min.x,
						height: bbox.max.y - bbox.min.y
					};
				};
				/*\
     * Raphael.isPointInsideBBox
     [ method ]
     **
     * Utility method
     **
     * Returns `true` if given point is inside bounding boxes.
     > Parameters
     - bbox (string) bounding box
     - x (string) x coordinate of the point
     - y (string) y coordinate of the point
     = (boolean) `true` if point inside
    \*/
				R.isPointInsideBBox = function (bbox, x, y) {
					return x >= bbox.x && x <= bbox.x2 && y >= bbox.y && y <= bbox.y2;
				};
				/*\
     * Raphael.isBBoxIntersect
     [ method ]
     **
     * Utility method
     **
     * Returns `true` if two bounding boxes intersect
     > Parameters
     - bbox1 (string) first bounding box
     - bbox2 (string) second bounding box
     = (boolean) `true` if they intersect
    \*/
				R.isBBoxIntersect = function (bbox1, bbox2) {
					var i = R.isPointInsideBBox;
					return i(bbox2, bbox1.x, bbox1.y) || i(bbox2, bbox1.x2, bbox1.y) || i(bbox2, bbox1.x, bbox1.y2) || i(bbox2, bbox1.x2, bbox1.y2) || i(bbox1, bbox2.x, bbox2.y) || i(bbox1, bbox2.x2, bbox2.y) || i(bbox1, bbox2.x, bbox2.y2) || i(bbox1, bbox2.x2, bbox2.y2) || (bbox1.x < bbox2.x2 && bbox1.x > bbox2.x || bbox2.x < bbox1.x2 && bbox2.x > bbox1.x) && (bbox1.y < bbox2.y2 && bbox1.y > bbox2.y || bbox2.y < bbox1.y2 && bbox2.y > bbox1.y);
				};
				function base3(t, p1, p2, p3, p4) {
					var t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4,
					    t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
					return t * t2 - 3 * p1 + 3 * p2;
				}
				function bezlen(x1, y1, x2, y2, x3, y3, x4, y4, z) {
					if (z == null) {
						z = 1;
					}
					z = z > 1 ? 1 : z < 0 ? 0 : z;
					var z2 = z / 2,
					    n = 12,
					    Tvalues = [-0.1252, 0.1252, -0.3678, 0.3678, -0.5873, 0.5873, -0.7699, 0.7699, -0.9041, 0.9041, -0.9816, 0.9816],
					    Cvalues = [0.2491, 0.2491, 0.2335, 0.2335, 0.2032, 0.2032, 0.1601, 0.1601, 0.1069, 0.1069, 0.0472, 0.0472],
					    sum = 0;
					for (var i = 0; i < n; i++) {
						var ct = z2 * Tvalues[i] + z2,
						    xbase = base3(ct, x1, x2, x3, x4),
						    ybase = base3(ct, y1, y2, y3, y4),
						    comb = xbase * xbase + ybase * ybase;
						sum += Cvalues[i] * math.sqrt(comb);
					}
					return z2 * sum;
				}
				function getTatLen(x1, y1, x2, y2, x3, y3, x4, y4, ll) {
					if (ll < 0 || bezlen(x1, y1, x2, y2, x3, y3, x4, y4) < ll) {
						return;
					}
					var t = 1,
					    step = t / 2,
					    t2 = t - step,
					    l,
					    e = .01;
					l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
					while (abs(l - ll) > e) {
						step /= 2;
						t2 += (l < ll ? 1 : -1) * step;
						l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
					}
					return t2;
				}
				function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
					if (mmax(x1, x2) < mmin(x3, x4) || mmin(x1, x2) > mmax(x3, x4) || mmax(y1, y2) < mmin(y3, y4) || mmin(y1, y2) > mmax(y3, y4)) {
						return;
					}
					var nx = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4),
					    ny = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4),
					    denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

					if (!denominator) {
						return;
					}
					var px = nx / denominator,
					    py = ny / denominator,
					    px2 = +px.toFixed(2),
					    py2 = +py.toFixed(2);
					if (px2 < +mmin(x1, x2).toFixed(2) || px2 > +mmax(x1, x2).toFixed(2) || px2 < +mmin(x3, x4).toFixed(2) || px2 > +mmax(x3, x4).toFixed(2) || py2 < +mmin(y1, y2).toFixed(2) || py2 > +mmax(y1, y2).toFixed(2) || py2 < +mmin(y3, y4).toFixed(2) || py2 > +mmax(y3, y4).toFixed(2)) {
						return;
					}
					return { x: px, y: py };
				}
				function inter(bez1, bez2) {
					return interHelper(bez1, bez2);
				}
				function interCount(bez1, bez2) {
					return interHelper(bez1, bez2, 1);
				}
				function interHelper(bez1, bez2, justCount) {
					var bbox1 = R.bezierBBox(bez1),
					    bbox2 = R.bezierBBox(bez2);
					if (!R.isBBoxIntersect(bbox1, bbox2)) {
						return justCount ? 0 : [];
					}
					var l1 = bezlen.apply(0, bez1),
					    l2 = bezlen.apply(0, bez2),
					    n1 = mmax(~~(l1 / 5), 1),
					    n2 = mmax(~~(l2 / 5), 1),
					    dots1 = [],
					    dots2 = [],
					    xy = {},
					    res = justCount ? 0 : [];
					for (var i = 0; i < n1 + 1; i++) {
						var p = R.findDotsAtSegment.apply(R, bez1.concat(i / n1));
						dots1.push({ x: p.x, y: p.y, t: i / n1 });
					}
					for (i = 0; i < n2 + 1; i++) {
						p = R.findDotsAtSegment.apply(R, bez2.concat(i / n2));
						dots2.push({ x: p.x, y: p.y, t: i / n2 });
					}
					for (i = 0; i < n1; i++) {
						for (var j = 0; j < n2; j++) {
							var di = dots1[i],
							    di1 = dots1[i + 1],
							    dj = dots2[j],
							    dj1 = dots2[j + 1],
							    ci = abs(di1.x - di.x) < .001 ? "y" : "x",
							    cj = abs(dj1.x - dj.x) < .001 ? "y" : "x",
							    is = intersect(di.x, di.y, di1.x, di1.y, dj.x, dj.y, dj1.x, dj1.y);
							if (is) {
								if (xy[is.x.toFixed(4)] == is.y.toFixed(4)) {
									continue;
								}
								xy[is.x.toFixed(4)] = is.y.toFixed(4);
								var t1 = di.t + abs((is[ci] - di[ci]) / (di1[ci] - di[ci])) * (di1.t - di.t),
								    t2 = dj.t + abs((is[cj] - dj[cj]) / (dj1[cj] - dj[cj])) * (dj1.t - dj.t);
								if (t1 >= 0 && t1 <= 1.001 && t2 >= 0 && t2 <= 1.001) {
									if (justCount) {
										res++;
									} else {
										res.push({
											x: is.x,
											y: is.y,
											t1: mmin(t1, 1),
											t2: mmin(t2, 1)
										});
									}
								}
							}
						}
					}
					return res;
				}
				/*\
     * Raphael.pathIntersection
     [ method ]
     **
     * Utility method
     **
     * Finds intersections of two paths
     > Parameters
     - path1 (string) path string
     - path2 (string) path string
     = (array) dots of intersection
     o [
     o     {
     o         x: (number) x coordinate of the point
     o         y: (number) y coordinate of the point
     o         t1: (number) t value for segment of path1
     o         t2: (number) t value for segment of path2
     o         segment1: (number) order number for segment of path1
     o         segment2: (number) order number for segment of path2
     o         bez1: (array) eight coordinates representing beziér curve for the segment of path1
     o         bez2: (array) eight coordinates representing beziér curve for the segment of path2
     o     }
     o ]
    \*/
				R.pathIntersection = function (path1, path2) {
					return interPathHelper(path1, path2);
				};
				R.pathIntersectionNumber = function (path1, path2) {
					return interPathHelper(path1, path2, 1);
				};
				function interPathHelper(path1, path2, justCount) {
					path1 = R._path2curve(path1);
					path2 = R._path2curve(path2);
					var x1,
					    y1,
					    x2,
					    y2,
					    x1m,
					    y1m,
					    x2m,
					    y2m,
					    bez1,
					    bez2,
					    res = justCount ? 0 : [];
					for (var i = 0, ii = path1.length; i < ii; i++) {
						var pi = path1[i];
						if (pi[0] == "M") {
							x1 = x1m = pi[1];
							y1 = y1m = pi[2];
						} else {
							if (pi[0] == "C") {
								bez1 = [x1, y1].concat(pi.slice(1));
								x1 = bez1[6];
								y1 = bez1[7];
							} else {
								bez1 = [x1, y1, x1, y1, x1m, y1m, x1m, y1m];
								x1 = x1m;
								y1 = y1m;
							}
							for (var j = 0, jj = path2.length; j < jj; j++) {
								var pj = path2[j];
								if (pj[0] == "M") {
									x2 = x2m = pj[1];
									y2 = y2m = pj[2];
								} else {
									if (pj[0] == "C") {
										bez2 = [x2, y2].concat(pj.slice(1));
										x2 = bez2[6];
										y2 = bez2[7];
									} else {
										bez2 = [x2, y2, x2, y2, x2m, y2m, x2m, y2m];
										x2 = x2m;
										y2 = y2m;
									}
									var intr = interHelper(bez1, bez2, justCount);
									if (justCount) {
										res += intr;
									} else {
										for (var k = 0, kk = intr.length; k < kk; k++) {
											intr[k].segment1 = i;
											intr[k].segment2 = j;
											intr[k].bez1 = bez1;
											intr[k].bez2 = bez2;
										}
										res = res.concat(intr);
									}
								}
							}
						}
					}
					return res;
				}
				/*\
     * Raphael.isPointInsidePath
     [ method ]
     **
     * Utility method
     **
     * Returns `true` if given point is inside a given closed path.
     > Parameters
     - path (string) path string
     - x (number) x of the point
     - y (number) y of the point
     = (boolean) true, if point is inside the path
    \*/
				R.isPointInsidePath = function (path, x, y) {
					var bbox = R.pathBBox(path);
					return R.isPointInsideBBox(bbox, x, y) && interPathHelper(path, [["M", x, y], ["H", bbox.x2 + 10]], 1) % 2 == 1;
				};
				R._removedFactory = function (methodname) {
					return function () {
						eve("raphael.log", null, 'Rapha\xEBl: you are calling to method \u201C' + methodname + '\u201D of removed object', methodname);
					};
				};
				/*\
     * Raphael.pathBBox
     [ method ]
     **
     * Utility method
     **
     * Return bounding box of a given path
     > Parameters
     - path (string) path string
     = (object) bounding box
     o {
     o     x: (number) x coordinate of the left top point of the box
     o     y: (number) y coordinate of the left top point of the box
     o     x2: (number) x coordinate of the right bottom point of the box
     o     y2: (number) y coordinate of the right bottom point of the box
     o     width: (number) width of the box
     o     height: (number) height of the box
     o     cx: (number) x coordinate of the center of the box
     o     cy: (number) y coordinate of the center of the box
     o }
    \*/
				var pathDimensions = R.pathBBox = function (path) {
					var pth = paths(path);
					if (pth.bbox) {
						return clone(pth.bbox);
					}
					if (!path) {
						return { x: 0, y: 0, width: 0, height: 0, x2: 0, y2: 0 };
					}
					path = path2curve(path);
					var x = 0,
					    y = 0,
					    X = [],
					    Y = [],
					    p;
					for (var i = 0, ii = path.length; i < ii; i++) {
						p = path[i];
						if (p[0] == "M") {
							x = p[1];
							y = p[2];
							X.push(x);
							Y.push(y);
						} else {
							var dim = curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
							X = X[concat](dim.min.x, dim.max.x);
							Y = Y[concat](dim.min.y, dim.max.y);
							x = p[5];
							y = p[6];
						}
					}
					var xmin = mmin[apply](0, X),
					    ymin = mmin[apply](0, Y),
					    xmax = mmax[apply](0, X),
					    ymax = mmax[apply](0, Y),
					    width = xmax - xmin,
					    height = ymax - ymin,
					    bb = {
						x: xmin,
						y: ymin,
						x2: xmax,
						y2: ymax,
						width: width,
						height: height,
						cx: xmin + width / 2,
						cy: ymin + height / 2
					};
					pth.bbox = clone(bb);
					return bb;
				},
				    pathClone = function pathClone(pathArray) {
					var res = clone(pathArray);
					res.toString = R._path2string;
					return res;
				},
				    pathToRelative = R._pathToRelative = function (pathArray) {
					var pth = paths(pathArray);
					if (pth.rel) {
						return pathClone(pth.rel);
					}
					if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) {
						// rough assumption
						pathArray = R.parsePathString(pathArray);
					}
					var res = [],
					    x = 0,
					    y = 0,
					    mx = 0,
					    my = 0,
					    start = 0;
					if (pathArray[0][0] == "M") {
						x = pathArray[0][1];
						y = pathArray[0][2];
						mx = x;
						my = y;
						start++;
						res.push(["M", x, y]);
					}
					for (var i = start, ii = pathArray.length; i < ii; i++) {
						var r = res[i] = [],
						    pa = pathArray[i];
						if (pa[0] != lowerCase.call(pa[0])) {
							r[0] = lowerCase.call(pa[0]);
							switch (r[0]) {
								case "a":
									r[1] = pa[1];
									r[2] = pa[2];
									r[3] = pa[3];
									r[4] = pa[4];
									r[5] = pa[5];
									r[6] = +(pa[6] - x).toFixed(3);
									r[7] = +(pa[7] - y).toFixed(3);
									break;
								case "v":
									r[1] = +(pa[1] - y).toFixed(3);
									break;
								case "m":
									mx = pa[1];
									my = pa[2];
								default:
									for (var j = 1, jj = pa.length; j < jj; j++) {
										r[j] = +(pa[j] - (j % 2 ? x : y)).toFixed(3);
									}
							}
						} else {
							r = res[i] = [];
							if (pa[0] == "m") {
								mx = pa[1] + x;
								my = pa[2] + y;
							}
							for (var k = 0, kk = pa.length; k < kk; k++) {
								res[i][k] = pa[k];
							}
						}
						var len = res[i].length;
						switch (res[i][0]) {
							case "z":
								x = mx;
								y = my;
								break;
							case "h":
								x += +res[i][len - 1];
								break;
							case "v":
								y += +res[i][len - 1];
								break;
							default:
								x += +res[i][len - 2];
								y += +res[i][len - 1];
						}
					}
					res.toString = R._path2string;
					pth.rel = pathClone(res);
					return res;
				},
				    pathToAbsolute = R._pathToAbsolute = function (pathArray) {
					var pth = paths(pathArray);
					if (pth.abs) {
						return pathClone(pth.abs);
					}
					if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) {
						// rough assumption
						pathArray = R.parsePathString(pathArray);
					}
					if (!pathArray || !pathArray.length) {
						return [["M", 0, 0]];
					}
					var res = [],
					    x = 0,
					    y = 0,
					    mx = 0,
					    my = 0,
					    start = 0;
					if (pathArray[0][0] == "M") {
						x = +pathArray[0][1];
						y = +pathArray[0][2];
						mx = x;
						my = y;
						start++;
						res[0] = ["M", x, y];
					}
					var crz = pathArray.length == 3 && pathArray[0][0] == "M" && pathArray[1][0].toUpperCase() == "R" && pathArray[2][0].toUpperCase() == "Z";
					for (var r, pa, i = start, ii = pathArray.length; i < ii; i++) {
						res.push(r = []);
						pa = pathArray[i];
						if (pa[0] != upperCase.call(pa[0])) {
							r[0] = upperCase.call(pa[0]);
							switch (r[0]) {
								case "A":
									r[1] = pa[1];
									r[2] = pa[2];
									r[3] = pa[3];
									r[4] = pa[4];
									r[5] = pa[5];
									r[6] = +(pa[6] + x);
									r[7] = +(pa[7] + y);
									break;
								case "V":
									r[1] = +pa[1] + y;
									break;
								case "H":
									r[1] = +pa[1] + x;
									break;
								case "R":
									var dots = [x, y][concat](pa.slice(1));
									for (var j = 2, jj = dots.length; j < jj; j++) {
										dots[j] = +dots[j] + x;
										dots[++j] = +dots[j] + y;
									}
									res.pop();
									res = res[concat](catmullRom2bezier(dots, crz));
									break;
								case "M":
									mx = +pa[1] + x;
									my = +pa[2] + y;
								default:
									for (j = 1, jj = pa.length; j < jj; j++) {
										r[j] = +pa[j] + (j % 2 ? x : y);
									}
							}
						} else if (pa[0] == "R") {
							dots = [x, y][concat](pa.slice(1));
							res.pop();
							res = res[concat](catmullRom2bezier(dots, crz));
							r = ["R"][concat](pa.slice(-2));
						} else {
							for (var k = 0, kk = pa.length; k < kk; k++) {
								r[k] = pa[k];
							}
						}
						switch (r[0]) {
							case "Z":
								x = mx;
								y = my;
								break;
							case "H":
								x = r[1];
								break;
							case "V":
								y = r[1];
								break;
							case "M":
								mx = r[r.length - 2];
								my = r[r.length - 1];
							default:
								x = r[r.length - 2];
								y = r[r.length - 1];
						}
					}
					res.toString = R._path2string;
					pth.abs = pathClone(res);
					return res;
				},
				    l2c = function l2c(x1, y1, x2, y2) {
					return [x1, y1, x2, y2, x2, y2];
				},
				    q2c = function q2c(x1, y1, ax, ay, x2, y2) {
					var _13 = 1 / 3,
					    _23 = 2 / 3;
					return [_13 * x1 + _23 * ax, _13 * y1 + _23 * ay, _13 * x2 + _23 * ax, _13 * y2 + _23 * ay, x2, y2];
				},
				    a2c = function a2c(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
					// for more information of where this math came from visit:
					// http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
					var _120 = PI * 120 / 180,
					    rad = PI / 180 * (+angle || 0),
					    res = [],
					    xy,
					    rotate = cacher(function (x, y, rad) {
						var X = x * math.cos(rad) - y * math.sin(rad),
						    Y = x * math.sin(rad) + y * math.cos(rad);
						return { x: X, y: Y };
					});
					if (!recursive) {
						xy = rotate(x1, y1, -rad);
						x1 = xy.x;
						y1 = xy.y;
						xy = rotate(x2, y2, -rad);
						x2 = xy.x;
						y2 = xy.y;
						var cos = math.cos(PI / 180 * angle),
						    sin = math.sin(PI / 180 * angle),
						    x = (x1 - x2) / 2,
						    y = (y1 - y2) / 2;
						var h = x * x / (rx * rx) + y * y / (ry * ry);
						if (h > 1) {
							h = math.sqrt(h);
							rx = h * rx;
							ry = h * ry;
						}
						var rx2 = rx * rx,
						    ry2 = ry * ry,
						    k = (large_arc_flag == sweep_flag ? -1 : 1) * math.sqrt(abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
						    cx = k * rx * y / ry + (x1 + x2) / 2,
						    cy = k * -ry * x / rx + (y1 + y2) / 2,
						    f1 = math.asin(((y1 - cy) / ry).toFixed(9)),
						    f2 = math.asin(((y2 - cy) / ry).toFixed(9));

						f1 = x1 < cx ? PI - f1 : f1;
						f2 = x2 < cx ? PI - f2 : f2;
						f1 < 0 && (f1 = PI * 2 + f1);
						f2 < 0 && (f2 = PI * 2 + f2);
						if (sweep_flag && f1 > f2) {
							f1 = f1 - PI * 2;
						}
						if (!sweep_flag && f2 > f1) {
							f2 = f2 - PI * 2;
						}
					} else {
						f1 = recursive[0];
						f2 = recursive[1];
						cx = recursive[2];
						cy = recursive[3];
					}
					var df = f2 - f1;
					if (abs(df) > _120) {
						var f2old = f2,
						    x2old = x2,
						    y2old = y2;
						f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
						x2 = cx + rx * math.cos(f2);
						y2 = cy + ry * math.sin(f2);
						res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
					}
					df = f2 - f1;
					var c1 = math.cos(f1),
					    s1 = math.sin(f1),
					    c2 = math.cos(f2),
					    s2 = math.sin(f2),
					    t = math.tan(df / 4),
					    hx = 4 / 3 * rx * t,
					    hy = 4 / 3 * ry * t,
					    m1 = [x1, y1],
					    m2 = [x1 + hx * s1, y1 - hy * c1],
					    m3 = [x2 + hx * s2, y2 - hy * c2],
					    m4 = [x2, y2];
					m2[0] = 2 * m1[0] - m2[0];
					m2[1] = 2 * m1[1] - m2[1];
					if (recursive) {
						return [m2, m3, m4][concat](res);
					} else {
						res = [m2, m3, m4][concat](res).join()[split](",");
						var newres = [];
						for (var i = 0, ii = res.length; i < ii; i++) {
							newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
						}
						return newres;
					}
				},
				    findDotAtSegment = function findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
					var t1 = 1 - t;
					return {
						x: pow(t1, 3) * p1x + pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + pow(t, 3) * p2x,
						y: pow(t1, 3) * p1y + pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + pow(t, 3) * p2y
					};
				},
				    curveDim = cacher(function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
					var a = c2x - 2 * c1x + p1x - (p2x - 2 * c2x + c1x),
					    b = 2 * (c1x - p1x) - 2 * (c2x - c1x),
					    c = p1x - c1x,
					    t1 = (-b + math.sqrt(b * b - 4 * a * c)) / 2 / a,
					    t2 = (-b - math.sqrt(b * b - 4 * a * c)) / 2 / a,
					    y = [p1y, p2y],
					    x = [p1x, p2x],
					    dot;
					abs(t1) > "1e12" && (t1 = .5);
					abs(t2) > "1e12" && (t2 = .5);
					if (t1 > 0 && t1 < 1) {
						dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
						x.push(dot.x);
						y.push(dot.y);
					}
					if (t2 > 0 && t2 < 1) {
						dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
						x.push(dot.x);
						y.push(dot.y);
					}
					a = c2y - 2 * c1y + p1y - (p2y - 2 * c2y + c1y);
					b = 2 * (c1y - p1y) - 2 * (c2y - c1y);
					c = p1y - c1y;
					t1 = (-b + math.sqrt(b * b - 4 * a * c)) / 2 / a;
					t2 = (-b - math.sqrt(b * b - 4 * a * c)) / 2 / a;
					abs(t1) > "1e12" && (t1 = .5);
					abs(t2) > "1e12" && (t2 = .5);
					if (t1 > 0 && t1 < 1) {
						dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
						x.push(dot.x);
						y.push(dot.y);
					}
					if (t2 > 0 && t2 < 1) {
						dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
						x.push(dot.x);
						y.push(dot.y);
					}
					return {
						min: { x: mmin[apply](0, x), y: mmin[apply](0, y) },
						max: { x: mmax[apply](0, x), y: mmax[apply](0, y) }
					};
				}),
				    path2curve = R._path2curve = cacher(function (path, path2) {
					var pth = !path2 && paths(path);
					if (!path2 && pth.curve) {
						return pathClone(pth.curve);
					}
					var p = pathToAbsolute(path),
					    p2 = path2 && pathToAbsolute(path2),
					    attrs = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null },
					    attrs2 = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null },
					    processPath = function processPath(path, d, pcom) {
						var nx,
						    ny,
						    tq = { T: 1, Q: 1 };
						if (!path) {
							return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
						}
						!(path[0] in tq) && (d.qx = d.qy = null);
						switch (path[0]) {
							case "M":
								d.X = path[1];
								d.Y = path[2];
								break;
							case "A":
								path = ["C"][concat](a2c[apply](0, [d.x, d.y][concat](path.slice(1))));
								break;
							case "S":
								if (pcom == "C" || pcom == "S") {
									// In "S" case we have to take into account, if the previous command is C/S.
									nx = d.x * 2 - d.bx; // And reflect the previous
									ny = d.y * 2 - d.by; // command's control point relative to the current point.
								} else {
									// or some else or nothing
									nx = d.x;
									ny = d.y;
								}
								path = ["C", nx, ny][concat](path.slice(1));
								break;
							case "T":
								if (pcom == "Q" || pcom == "T") {
									// In "T" case we have to take into account, if the previous command is Q/T.
									d.qx = d.x * 2 - d.qx; // And make a reflection similar
									d.qy = d.y * 2 - d.qy; // to case "S".
								} else {
									// or something else or nothing
									d.qx = d.x;
									d.qy = d.y;
								}
								path = ["C"][concat](q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
								break;
							case "Q":
								d.qx = path[1];
								d.qy = path[2];
								path = ["C"][concat](q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
								break;
							case "L":
								path = ["C"][concat](l2c(d.x, d.y, path[1], path[2]));
								break;
							case "H":
								path = ["C"][concat](l2c(d.x, d.y, path[1], d.y));
								break;
							case "V":
								path = ["C"][concat](l2c(d.x, d.y, d.x, path[1]));
								break;
							case "Z":
								path = ["C"][concat](l2c(d.x, d.y, d.X, d.Y));
								break;
						}
						return path;
					},
					    fixArc = function fixArc(pp, i) {
						if (pp[i].length > 7) {
							pp[i].shift();
							var pi = pp[i];
							while (pi.length) {
								pcoms1[i] = "A"; // if created multiple C:s, their original seg is saved
								p2 && (pcoms2[i] = "A"); // the same as above
								pp.splice(i++, 0, ["C"][concat](pi.splice(0, 6)));
							}
							pp.splice(i, 1);
							ii = mmax(p.length, p2 && p2.length || 0);
						}
					},
					    fixM = function fixM(path1, path2, a1, a2, i) {
						if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
							path2.splice(i, 0, ["M", a2.x, a2.y]);
							a1.bx = 0;
							a1.by = 0;
							a1.x = path1[i][1];
							a1.y = path1[i][2];
							ii = mmax(p.length, p2 && p2.length || 0);
						}
					},
					    pcoms1 = [],
					    // path commands of original path p
					pcoms2 = [],
					    // path commands of original path p2
					pfirst = "",
					    // temporary holder for original path command
					pcom = ""; // holder for previous path command of original path
					for (var i = 0, ii = mmax(p.length, p2 && p2.length || 0); i < ii; i++) {
						p[i] && (pfirst = p[i][0]); // save current path command

						if (pfirst != "C") // C is not saved yet, because it may be result of conversion
							{
								pcoms1[i] = pfirst; // Save current path command
								i && (pcom = pcoms1[i - 1]); // Get previous path command pcom
							}
						p[i] = processPath(p[i], attrs, pcom); // Previous path command is inputted to processPath

						if (pcoms1[i] != "A" && pfirst == "C") pcoms1[i] = "C"; // A is the only command
						// which may produce multiple C:s
						// so we have to make sure that C is also C in original path

						fixArc(p, i); // fixArc adds also the right amount of A:s to pcoms1

						if (p2) {
							// the same procedures is done to p2
							p2[i] && (pfirst = p2[i][0]);
							if (pfirst != "C") {
								pcoms2[i] = pfirst;
								i && (pcom = pcoms2[i - 1]);
							}
							p2[i] = processPath(p2[i], attrs2, pcom);

							if (pcoms2[i] != "A" && pfirst == "C") pcoms2[i] = "C";

							fixArc(p2, i);
						}
						fixM(p, p2, attrs, attrs2, i);
						fixM(p2, p, attrs2, attrs, i);
						var seg = p[i],
						    seg2 = p2 && p2[i],
						    seglen = seg.length,
						    seg2len = p2 && seg2.length;
						attrs.x = seg[seglen - 2];
						attrs.y = seg[seglen - 1];
						attrs.bx = toFloat(seg[seglen - 4]) || attrs.x;
						attrs.by = toFloat(seg[seglen - 3]) || attrs.y;
						attrs2.bx = p2 && (toFloat(seg2[seg2len - 4]) || attrs2.x);
						attrs2.by = p2 && (toFloat(seg2[seg2len - 3]) || attrs2.y);
						attrs2.x = p2 && seg2[seg2len - 2];
						attrs2.y = p2 && seg2[seg2len - 1];
					}
					if (!p2) {
						pth.curve = pathClone(p);
					}
					return p2 ? [p, p2] : p;
				}, null, pathClone),
				    parseDots = R._parseDots = cacher(function (gradient) {
					var dots = [];
					for (var i = 0, ii = gradient.length; i < ii; i++) {
						var dot = {},
						    par = gradient[i].match(/^([^:]*):?([\d\.]*)/);
						dot.color = R.getRGB(par[1]);
						if (dot.color.error) {
							return null;
						}
						dot.opacity = dot.color.opacity;
						dot.color = dot.color.hex;
						par[2] && (dot.offset = par[2] + "%");
						dots.push(dot);
					}
					for (i = 1, ii = dots.length - 1; i < ii; i++) {
						if (!dots[i].offset) {
							var start = toFloat(dots[i - 1].offset || 0),
							    end = 0;
							for (var j = i + 1; j < ii; j++) {
								if (dots[j].offset) {
									end = dots[j].offset;
									break;
								}
							}
							if (!end) {
								end = 100;
								j = ii;
							}
							end = toFloat(end);
							var d = (end - start) / (j - i + 1);
							for (; i < j; i++) {
								start += d;
								dots[i].offset = start + "%";
							}
						}
					}
					return dots;
				}),
				    tear = R._tear = function (el, paper) {
					el == paper.top && (paper.top = el.prev);
					el == paper.bottom && (paper.bottom = el.next);
					el.next && (el.next.prev = el.prev);
					el.prev && (el.prev.next = el.next);
				},
				    tofront = R._tofront = function (el, paper) {
					if (paper.top === el) {
						return;
					}
					tear(el, paper);
					el.next = null;
					el.prev = paper.top;
					paper.top.next = el;
					paper.top = el;
				},
				    toback = R._toback = function (el, paper) {
					if (paper.bottom === el) {
						return;
					}
					tear(el, paper);
					el.next = paper.bottom;
					el.prev = null;
					paper.bottom.prev = el;
					paper.bottom = el;
				},
				    insertafter = R._insertafter = function (el, el2, paper) {
					tear(el, paper);
					el2 == paper.top && (paper.top = el);
					el2.next && (el2.next.prev = el);
					el.next = el2.next;
					el.prev = el2;
					el2.next = el;
				},
				    insertbefore = R._insertbefore = function (el, el2, paper) {
					tear(el, paper);
					el2 == paper.bottom && (paper.bottom = el);
					el2.prev && (el2.prev.next = el);
					el.prev = el2.prev;
					el2.prev = el;
					el.next = el2;
				},

				/*\
     * Raphael.toMatrix
     [ method ]
     **
     * Utility method
     **
     * Returns matrix of transformations applied to a given path
     > Parameters
     - path (string) path string
     - transform (string|array) transformation string
     = (object) @Matrix
    \*/
				toMatrix = R.toMatrix = function (path, transform) {
					var bb = pathDimensions(path),
					    el = {
						_: {
							transform: E
						},
						getBBox: function getBBox() {
							return bb;
						}
					};
					extractTransform(el, transform);
					return el.matrix;
				},

				/*\
     * Raphael.transformPath
     [ method ]
     **
     * Utility method
     **
     * Returns path transformed by a given transformation
     > Parameters
     - path (string) path string
     - transform (string|array) transformation string
     = (string) path
    \*/
				transformPath = R.transformPath = function (path, transform) {
					return mapPath(path, toMatrix(path, transform));
				},
				    extractTransform = R._extractTransform = function (el, tstr) {
					if (tstr == null) {
						return el._.transform;
					}
					tstr = Str(tstr).replace(/\.{3}|\u2026/g, el._.transform || E);
					var tdata = R.parseTransformString(tstr),
					    deg = 0,
					    dx = 0,
					    dy = 0,
					    sx = 1,
					    sy = 1,
					    _ = el._,
					    m = new Matrix();
					_.transform = tdata || [];
					if (tdata) {
						for (var i = 0, ii = tdata.length; i < ii; i++) {
							var t = tdata[i],
							    tlen = t.length,
							    command = Str(t[0]).toLowerCase(),
							    absolute = t[0] != command,
							    inver = absolute ? m.invert() : 0,
							    x1,
							    y1,
							    x2,
							    y2,
							    bb;
							if (command == "t" && tlen == 3) {
								if (absolute) {
									x1 = inver.x(0, 0);
									y1 = inver.y(0, 0);
									x2 = inver.x(t[1], t[2]);
									y2 = inver.y(t[1], t[2]);
									m.translate(x2 - x1, y2 - y1);
								} else {
									m.translate(t[1], t[2]);
								}
							} else if (command == "r") {
								if (tlen == 2) {
									bb = bb || el.getBBox(1);
									m.rotate(t[1], bb.x + bb.width / 2, bb.y + bb.height / 2);
									deg += t[1];
								} else if (tlen == 4) {
									if (absolute) {
										x2 = inver.x(t[2], t[3]);
										y2 = inver.y(t[2], t[3]);
										m.rotate(t[1], x2, y2);
									} else {
										m.rotate(t[1], t[2], t[3]);
									}
									deg += t[1];
								}
							} else if (command == "s") {
								if (tlen == 2 || tlen == 3) {
									bb = bb || el.getBBox(1);
									m.scale(t[1], t[tlen - 1], bb.x + bb.width / 2, bb.y + bb.height / 2);
									sx *= t[1];
									sy *= t[tlen - 1];
								} else if (tlen == 5) {
									if (absolute) {
										x2 = inver.x(t[3], t[4]);
										y2 = inver.y(t[3], t[4]);
										m.scale(t[1], t[2], x2, y2);
									} else {
										m.scale(t[1], t[2], t[3], t[4]);
									}
									sx *= t[1];
									sy *= t[2];
								}
							} else if (command == "m" && tlen == 7) {
								m.add(t[1], t[2], t[3], t[4], t[5], t[6]);
							}
							_.dirtyT = 1;
							el.matrix = m;
						}
					}

					/*\
      * Element.matrix
      [ property (object) ]
      **
      * Keeps @Matrix object, which represents element transformation
     \*/
					el.matrix = m;

					_.sx = sx;
					_.sy = sy;
					_.deg = deg;
					_.dx = dx = m.e;
					_.dy = dy = m.f;

					if (sx == 1 && sy == 1 && !deg && _.bbox) {
						_.bbox.x += +dx;
						_.bbox.y += +dy;
					} else {
						_.dirtyT = 1;
					}
				},
				    getEmpty = function getEmpty(item) {
					var l = item[0];
					switch (l.toLowerCase()) {
						case "t":
							return [l, 0, 0];
						case "m":
							return [l, 1, 0, 0, 1, 0, 0];
						case "r":
							if (item.length == 4) {
								return [l, 0, item[2], item[3]];
							} else {
								return [l, 0];
							}
						case "s":
							if (item.length == 5) {
								return [l, 1, 1, item[3], item[4]];
							} else if (item.length == 3) {
								return [l, 1, 1];
							} else {
								return [l, 1];
							}
					}
				},
				    equaliseTransform = R._equaliseTransform = function (t1, t2) {
					t2 = Str(t2).replace(/\.{3}|\u2026/g, t1);
					t1 = R.parseTransformString(t1) || [];
					t2 = R.parseTransformString(t2) || [];
					var maxlength = mmax(t1.length, t2.length),
					    from = [],
					    to = [],
					    i = 0,
					    j,
					    jj,
					    tt1,
					    tt2;
					for (; i < maxlength; i++) {
						tt1 = t1[i] || getEmpty(t2[i]);
						tt2 = t2[i] || getEmpty(tt1);
						if (tt1[0] != tt2[0] || tt1[0].toLowerCase() == "r" && (tt1[2] != tt2[2] || tt1[3] != tt2[3]) || tt1[0].toLowerCase() == "s" && (tt1[3] != tt2[3] || tt1[4] != tt2[4])) {
							return;
						}
						from[i] = [];
						to[i] = [];
						for (j = 0, jj = mmax(tt1.length, tt2.length); j < jj; j++) {
							j in tt1 && (from[i][j] = tt1[j]);
							j in tt2 && (to[i][j] = tt2[j]);
						}
					}
					return {
						from: from,
						to: to
					};
				};
				R._getContainer = function (x, y, w, h) {
					var container;
					container = h == null && !R.is(x, "object") ? g.doc.getElementById(x) : x;
					if (container == null) {
						return;
					}
					if (container.tagName) {
						if (y == null) {
							return {
								container: container,
								width: container.style.pixelWidth || container.offsetWidth,
								height: container.style.pixelHeight || container.offsetHeight
							};
						} else {
							return {
								container: container,
								width: y,
								height: w
							};
						}
					}
					return {
						container: 1,
						x: x,
						y: y,
						width: w,
						height: h
					};
				};
				/*\
     * Raphael.pathToRelative
     [ method ]
     **
     * Utility method
     **
     * Converts path to relative form
     > Parameters
     - pathString (string|array) path string or array of segments
     = (array) array of segments.
    \*/
				R.pathToRelative = pathToRelative;
				R._engine = {};
				/*\
     * Raphael.path2curve
     [ method ]
     **
     * Utility method
     **
     * Converts path to a new path where all segments are cubic bezier curves.
     > Parameters
     - pathString (string|array) path string or array of segments
     = (array) array of segments.
    \*/
				R.path2curve = path2curve;
				/*\
     * Raphael.matrix
     [ method ]
     **
     * Utility method
     **
     * Returns matrix based on given parameters.
     > Parameters
     - a (number)
     - b (number)
     - c (number)
     - d (number)
     - e (number)
     - f (number)
     = (object) @Matrix
    \*/
				R.matrix = function (a, b, c, d, e, f) {
					return new Matrix(a, b, c, d, e, f);
				};
				function Matrix(a, b, c, d, e, f) {
					if (a != null) {
						this.a = +a;
						this.b = +b;
						this.c = +c;
						this.d = +d;
						this.e = +e;
						this.f = +f;
					} else {
						this.a = 1;
						this.b = 0;
						this.c = 0;
						this.d = 1;
						this.e = 0;
						this.f = 0;
					}
				}
				(function (matrixproto) {
					/*\
      * Matrix.add
      [ method ]
      **
      * Adds given matrix to existing one.
      > Parameters
      - a (number)
      - b (number)
      - c (number)
      - d (number)
      - e (number)
      - f (number)
      or
      - matrix (object) @Matrix
     \*/
					matrixproto.add = function (a, b, c, d, e, f) {
						var out = [[], [], []],
						    m = [[this.a, this.c, this.e], [this.b, this.d, this.f], [0, 0, 1]],
						    matrix = [[a, c, e], [b, d, f], [0, 0, 1]],
						    x,
						    y,
						    z,
						    res;

						if (a && a instanceof Matrix) {
							matrix = [[a.a, a.c, a.e], [a.b, a.d, a.f], [0, 0, 1]];
						}

						for (x = 0; x < 3; x++) {
							for (y = 0; y < 3; y++) {
								res = 0;
								for (z = 0; z < 3; z++) {
									res += m[x][z] * matrix[z][y];
								}
								out[x][y] = res;
							}
						}
						this.a = out[0][0];
						this.b = out[1][0];
						this.c = out[0][1];
						this.d = out[1][1];
						this.e = out[0][2];
						this.f = out[1][2];
					};
					/*\
      * Matrix.invert
      [ method ]
      **
      * Returns inverted version of the matrix
      = (object) @Matrix
     \*/
					matrixproto.invert = function () {
						var me = this,
						    x = me.a * me.d - me.b * me.c;
						return new Matrix(me.d / x, -me.b / x, -me.c / x, me.a / x, (me.c * me.f - me.d * me.e) / x, (me.b * me.e - me.a * me.f) / x);
					};
					/*\
      * Matrix.clone
      [ method ]
      **
      * Returns copy of the matrix
      = (object) @Matrix
     \*/
					matrixproto.clone = function () {
						return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
					};
					/*\
      * Matrix.translate
      [ method ]
      **
      * Translate the matrix
      > Parameters
      - x (number)
      - y (number)
     \*/
					matrixproto.translate = function (x, y) {
						this.add(1, 0, 0, 1, x, y);
					};
					/*\
      * Matrix.scale
      [ method ]
      **
      * Scales the matrix
      > Parameters
      - x (number)
      - y (number) #optional
      - cx (number) #optional
      - cy (number) #optional
     \*/
					matrixproto.scale = function (x, y, cx, cy) {
						y == null && (y = x);
						(cx || cy) && this.add(1, 0, 0, 1, cx, cy);
						this.add(x, 0, 0, y, 0, 0);
						(cx || cy) && this.add(1, 0, 0, 1, -cx, -cy);
					};
					/*\
      * Matrix.rotate
      [ method ]
      **
      * Rotates the matrix
      > Parameters
      - a (number)
      - x (number)
      - y (number)
     \*/
					matrixproto.rotate = function (a, x, y) {
						a = R.rad(a);
						x = x || 0;
						y = y || 0;
						var cos = +math.cos(a).toFixed(9),
						    sin = +math.sin(a).toFixed(9);
						this.add(cos, sin, -sin, cos, x, y);
						this.add(1, 0, 0, 1, -x, -y);
					};
					/*\
      * Matrix.x
      [ method ]
      **
      * Return x coordinate for given point after transformation described by the matrix. See also @Matrix.y
      > Parameters
      - x (number)
      - y (number)
      = (number) x
     \*/
					matrixproto.x = function (x, y) {
						return x * this.a + y * this.c + this.e;
					};
					/*\
      * Matrix.y
      [ method ]
      **
      * Return y coordinate for given point after transformation described by the matrix. See also @Matrix.x
      > Parameters
      - x (number)
      - y (number)
      = (number) y
     \*/
					matrixproto.y = function (x, y) {
						return x * this.b + y * this.d + this.f;
					};
					matrixproto.get = function (i) {
						return +this[Str.fromCharCode(97 + i)].toFixed(4);
					};
					matrixproto.toString = function () {
						return R.svg ? "matrix(" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)].join() + ")" : [this.get(0), this.get(2), this.get(1), this.get(3), 0, 0].join();
					};
					matrixproto.toFilter = function () {
						return "progid:DXImageTransform.Microsoft.Matrix(M11=" + this.get(0) + ", M12=" + this.get(2) + ", M21=" + this.get(1) + ", M22=" + this.get(3) + ", Dx=" + this.get(4) + ", Dy=" + this.get(5) + ", sizingmethod='auto expand')";
					};
					matrixproto.offset = function () {
						return [this.e.toFixed(4), this.f.toFixed(4)];
					};
					function norm(a) {
						return a[0] * a[0] + a[1] * a[1];
					}
					function normalize(a) {
						var mag = math.sqrt(norm(a));
						a[0] && (a[0] /= mag);
						a[1] && (a[1] /= mag);
					}
					/*\
      * Matrix.split
      [ method ]
      **
      * Splits matrix into primitive transformations
      = (object) in format:
      o dx (number) translation by x
      o dy (number) translation by y
      o scalex (number) scale by x
      o scaley (number) scale by y
      o shear (number) shear
      o rotate (number) rotation in deg
      o isSimple (boolean) could it be represented via simple transformations
     \*/
					matrixproto.split = function () {
						var out = {};
						// translation
						out.dx = this.e;
						out.dy = this.f;

						// scale and shear
						var row = [[this.a, this.c], [this.b, this.d]];
						out.scalex = math.sqrt(norm(row[0]));
						normalize(row[0]);

						out.shear = row[0][0] * row[1][0] + row[0][1] * row[1][1];
						row[1] = [row[1][0] - row[0][0] * out.shear, row[1][1] - row[0][1] * out.shear];

						out.scaley = math.sqrt(norm(row[1]));
						normalize(row[1]);
						out.shear /= out.scaley;

						// rotation
						var sin = -row[0][1],
						    cos = row[1][1];
						if (cos < 0) {
							out.rotate = R.deg(math.acos(cos));
							if (sin < 0) {
								out.rotate = 360 - out.rotate;
							}
						} else {
							out.rotate = R.deg(math.asin(sin));
						}

						out.isSimple = !+out.shear.toFixed(9) && (out.scalex.toFixed(9) == out.scaley.toFixed(9) || !out.rotate);
						out.isSuperSimple = !+out.shear.toFixed(9) && out.scalex.toFixed(9) == out.scaley.toFixed(9) && !out.rotate;
						out.noRotation = !+out.shear.toFixed(9) && !out.rotate;
						return out;
					};
					/*\
      * Matrix.toTransformString
      [ method ]
      **
      * Return transform string that represents given matrix
      = (string) transform string
     \*/
					matrixproto.toTransformString = function (shorter) {
						var s = shorter || this[split]();
						if (s.isSimple) {
							s.scalex = +s.scalex.toFixed(4);
							s.scaley = +s.scaley.toFixed(4);
							s.rotate = +s.rotate.toFixed(4);
							return (s.dx || s.dy ? "t" + [s.dx, s.dy] : E) + (s.scalex != 1 || s.scaley != 1 ? "s" + [s.scalex, s.scaley, 0, 0] : E) + (s.rotate ? "r" + [s.rotate, 0, 0] : E);
						} else {
							return "m" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)];
						}
					};
				})(Matrix.prototype);

				var preventDefault = function preventDefault() {
					this.returnValue = false;
				},
				    preventTouch = function preventTouch() {
					return this.originalEvent.preventDefault();
				},
				    stopPropagation = function stopPropagation() {
					this.cancelBubble = true;
				},
				    stopTouch = function stopTouch() {
					return this.originalEvent.stopPropagation();
				},
				    getEventPosition = function getEventPosition(e) {
					var scrollY = g.doc.documentElement.scrollTop || g.doc.body.scrollTop,
					    scrollX = g.doc.documentElement.scrollLeft || g.doc.body.scrollLeft;

					return {
						x: e.clientX + scrollX,
						y: e.clientY + scrollY
					};
				},
				    addEvent = function () {
					if (g.doc.addEventListener) {
						return function (obj, type, fn, element) {
							var f = function f(e) {
								var pos = getEventPosition(e);
								return fn.call(element, e, pos.x, pos.y);
							};
							obj.addEventListener(type, f, false);

							if (supportsTouch && touchMap[type]) {
								var _f = function _f(e) {
									var pos = getEventPosition(e),
									    olde = e;

									for (var i = 0, ii = e.targetTouches && e.targetTouches.length; i < ii; i++) {
										if (e.targetTouches[i].target == obj) {
											e = e.targetTouches[i];
											e.originalEvent = olde;
											e.preventDefault = preventTouch;
											e.stopPropagation = stopTouch;
											break;
										}
									}

									return fn.call(element, e, pos.x, pos.y);
								};
								obj.addEventListener(touchMap[type], _f, false);
							}

							return function () {
								obj.removeEventListener(type, f, false);

								if (supportsTouch && touchMap[type]) obj.removeEventListener(touchMap[type], _f, false);

								return true;
							};
						};
					} else if (g.doc.attachEvent) {
						return function (obj, type, fn, element) {
							var f = function f(e) {
								e = e || g.win.event;
								var scrollY = g.doc.documentElement.scrollTop || g.doc.body.scrollTop,
								    scrollX = g.doc.documentElement.scrollLeft || g.doc.body.scrollLeft,
								    x = e.clientX + scrollX,
								    y = e.clientY + scrollY;
								e.preventDefault = e.preventDefault || preventDefault;
								e.stopPropagation = e.stopPropagation || stopPropagation;
								return fn.call(element, e, x, y);
							};
							obj.attachEvent("on" + type, f);
							var detacher = function detacher() {
								obj.detachEvent("on" + type, f);
								return true;
							};
							return detacher;
						};
					}
				}(),
				    drag = [],
				    dragMove = function dragMove(e) {
					var x = e.clientX,
					    y = e.clientY,
					    scrollY = g.doc.documentElement.scrollTop || g.doc.body.scrollTop,
					    scrollX = g.doc.documentElement.scrollLeft || g.doc.body.scrollLeft,
					    dragi,
					    j = drag.length;
					while (j--) {
						dragi = drag[j];
						if (supportsTouch && e.touches) {
							var i = e.touches.length,
							    touch;
							while (i--) {
								touch = e.touches[i];
								if (touch.identifier == dragi.el._drag.id) {
									x = touch.clientX;
									y = touch.clientY;
									(e.originalEvent ? e.originalEvent : e).preventDefault();
									break;
								}
							}
						} else {
							e.preventDefault();
						}
						var node = dragi.el.node,
						    o,
						    next = node.nextSibling,
						    parent = node.parentNode,
						    display = node.style.display;
						g.win.opera && parent.removeChild(node);
						node.style.display = "none";
						o = dragi.el.paper.getElementByPoint(x, y);
						node.style.display = display;
						g.win.opera && (next ? parent.insertBefore(node, next) : parent.appendChild(node));
						o && eve("raphael.drag.over." + dragi.el.id, dragi.el, o);
						x += scrollX;
						y += scrollY;
						eve("raphael.drag.move." + dragi.el.id, dragi.move_scope || dragi.el, x - dragi.el._drag.x, y - dragi.el._drag.y, x, y, e);
					}
				},
				    dragUp = function dragUp(e) {
					R.unmousemove(dragMove).unmouseup(dragUp);
					var i = drag.length,
					    dragi;
					while (i--) {
						dragi = drag[i];
						dragi.el._drag = {};
						eve("raphael.drag.end." + dragi.el.id, dragi.end_scope || dragi.start_scope || dragi.move_scope || dragi.el, e);
					}
					drag = [];
				},

				/*\
     * Raphael.el
     [ property (object) ]
     **
     * You can add your own method to elements. This is useful when you want to hack default functionality or
     * want to wrap some common transformation or attributes in one method. In difference to canvas methods,
     * you can redefine element method at any time. Expending element methods wouldn’t affect set.
     > Usage
     | Raphael.el.red = function () {
     |     this.attr({fill: "#f00"});
     | };
     | // then use it
     | paper.circle(100, 100, 20).red();
    \*/
				elproto = R.el = {};
				/*\
     * Element.click
     [ method ]
     **
     * Adds event handler for click for the element.
     > Parameters
     - handler (function) handler for the event
     = (object) @Element
    \*/
				/*\
     * Element.unclick
     [ method ]
     **
     * Removes event handler for click for the element.
     > Parameters
     - handler (function) #optional handler for the event
     = (object) @Element
    \*/

				/*\
     * Element.dblclick
     [ method ]
     **
     * Adds event handler for double click for the element.
     > Parameters
     - handler (function) handler for the event
     = (object) @Element
    \*/
				/*\
     * Element.undblclick
     [ method ]
     **
     * Removes event handler for double click for the element.
     > Parameters
     - handler (function) #optional handler for the event
     = (object) @Element
    \*/

				/*\
     * Element.mousedown
     [ method ]
     **
     * Adds event handler for mousedown for the element.
     > Parameters
     - handler (function) handler for the event
     = (object) @Element
    \*/
				/*\
     * Element.unmousedown
     [ method ]
     **
     * Removes event handler for mousedown for the element.
     > Parameters
     - handler (function) #optional handler for the event
     = (object) @Element
    \*/

				/*\
     * Element.mousemove
     [ method ]
     **
     * Adds event handler for mousemove for the element.
     > Parameters
     - handler (function) handler for the event
     = (object) @Element
    \*/
				/*\
     * Element.unmousemove
     [ method ]
     **
     * Removes event handler for mousemove for the element.
     > Parameters
     - handler (function) #optional handler for the event
     = (object) @Element
    \*/

				/*\
     * Element.mouseout
     [ method ]
     **
     * Adds event handler for mouseout for the element.
     > Parameters
     - handler (function) handler for the event
     = (object) @Element
    \*/
				/*\
     * Element.unmouseout
     [ method ]
     **
     * Removes event handler for mouseout for the element.
     > Parameters
     - handler (function) #optional handler for the event
     = (object) @Element
    \*/

				/*\
     * Element.mouseover
     [ method ]
     **
     * Adds event handler for mouseover for the element.
     > Parameters
     - handler (function) handler for the event
     = (object) @Element
    \*/
				/*\
     * Element.unmouseover
     [ method ]
     **
     * Removes event handler for mouseover for the element.
     > Parameters
     - handler (function) #optional handler for the event
     = (object) @Element
    \*/

				/*\
     * Element.mouseup
     [ method ]
     **
     * Adds event handler for mouseup for the element.
     > Parameters
     - handler (function) handler for the event
     = (object) @Element
    \*/
				/*\
     * Element.unmouseup
     [ method ]
     **
     * Removes event handler for mouseup for the element.
     > Parameters
     - handler (function) #optional handler for the event
     = (object) @Element
    \*/

				/*\
     * Element.touchstart
     [ method ]
     **
     * Adds event handler for touchstart for the element.
     > Parameters
     - handler (function) handler for the event
     = (object) @Element
    \*/
				/*\
     * Element.untouchstart
     [ method ]
     **
     * Removes event handler for touchstart for the element.
     > Parameters
     - handler (function) #optional handler for the event
     = (object) @Element
    \*/

				/*\
     * Element.touchmove
     [ method ]
     **
     * Adds event handler for touchmove for the element.
     > Parameters
     - handler (function) handler for the event
     = (object) @Element
    \*/
				/*\
     * Element.untouchmove
     [ method ]
     **
     * Removes event handler for touchmove for the element.
     > Parameters
     - handler (function) #optional handler for the event
     = (object) @Element
    \*/

				/*\
     * Element.touchend
     [ method ]
     **
     * Adds event handler for touchend for the element.
     > Parameters
     - handler (function) handler for the event
     = (object) @Element
    \*/
				/*\
     * Element.untouchend
     [ method ]
     **
     * Removes event handler for touchend for the element.
     > Parameters
     - handler (function) #optional handler for the event
     = (object) @Element
    \*/

				/*\
     * Element.touchcancel
     [ method ]
     **
     * Adds event handler for touchcancel for the element.
     > Parameters
     - handler (function) handler for the event
     = (object) @Element
    \*/
				/*\
     * Element.untouchcancel
     [ method ]
     **
     * Removes event handler for touchcancel for the element.
     > Parameters
     - handler (function) #optional handler for the event
     = (object) @Element
    \*/
				for (var i = events.length; i--;) {
					(function (eventName) {
						R[eventName] = elproto[eventName] = function (fn, scope) {
							if (R.is(fn, "function")) {
								this.events = this.events || [];
								this.events.push({ name: eventName, f: fn, unbind: addEvent(this.shape || this.node || g.doc, eventName, fn, scope || this) });
							}
							return this;
						};
						R["un" + eventName] = elproto["un" + eventName] = function (fn) {
							var events = this.events || [],
							    l = events.length;
							while (l--) {
								if (events[l].name == eventName && (R.is(fn, "undefined") || events[l].f == fn)) {
									events[l].unbind();
									events.splice(l, 1);
									!events.length && delete this.events;
								}
							}
							return this;
						};
					})(events[i]);
				}

				/*\
     * Element.data
     [ method ]
     **
     * Adds or retrieves given value associated with given key.
     **
     * See also @Element.removeData
     > Parameters
     - key (string) key to store data
     - value (any) #optional value to store
     = (object) @Element
     * or, if value is not specified:
     = (any) value
     * or, if key and value are not specified:
     = (object) Key/value pairs for all the data associated with the element.
     > Usage
     | for (var i = 0, i < 5, i++) {
     |     paper.circle(10 + 15 * i, 10, 10)
     |          .attr({fill: "#000"})
     |          .data("i", i)
     |          .click(function () {
     |             alert(this.data("i"));
     |          });
     | }
    \*/
				elproto.data = function (key, value) {
					var data = eldata[this.id] = eldata[this.id] || {};
					if (arguments.length == 0) {
						return data;
					}
					if (arguments.length == 1) {
						if (R.is(key, "object")) {
							for (var i in key) {
								if (key[has](i)) {
									this.data(i, key[i]);
								}
							}return this;
						}
						eve("raphael.data.get." + this.id, this, data[key], key);
						return data[key];
					}
					data[key] = value;
					eve("raphael.data.set." + this.id, this, value, key);
					return this;
				};
				/*\
     * Element.removeData
     [ method ]
     **
     * Removes value associated with an element by given key.
     * If key is not provided, removes all the data of the element.
     > Parameters
     - key (string) #optional key
     = (object) @Element
    \*/
				elproto.removeData = function (key) {
					if (key == null) {
						eldata[this.id] = {};
					} else {
						eldata[this.id] && delete eldata[this.id][key];
					}
					return this;
				};
				/*\
    * Element.getData
    [ method ]
    **
    * Retrieves the element data
    = (object) data
    \*/
				elproto.getData = function () {
					return clone(eldata[this.id] || {});
				};
				/*\
     * Element.hover
     [ method ]
     **
     * Adds event handlers for hover for the element.
     > Parameters
     - f_in (function) handler for hover in
     - f_out (function) handler for hover out
     - icontext (object) #optional context for hover in handler
     - ocontext (object) #optional context for hover out handler
     = (object) @Element
    \*/
				elproto.hover = function (f_in, f_out, scope_in, scope_out) {
					return this.mouseover(f_in, scope_in).mouseout(f_out, scope_out || scope_in);
				};
				/*\
     * Element.unhover
     [ method ]
     **
     * Removes event handlers for hover for the element.
     > Parameters
     - f_in (function) handler for hover in
     - f_out (function) handler for hover out
     = (object) @Element
    \*/
				elproto.unhover = function (f_in, f_out) {
					return this.unmouseover(f_in).unmouseout(f_out);
				};
				var draggable = [];
				/*\
     * Element.drag
     [ method ]
     **
     * Adds event handlers for drag of the element.
     > Parameters
     - onmove (function) handler for moving
     - onstart (function) handler for drag start
     - onend (function) handler for drag end
     - mcontext (object) #optional context for moving handler
     - scontext (object) #optional context for drag start handler
     - econtext (object) #optional context for drag end handler
     * Additionally following `drag` events will be triggered: `drag.start.<id>` on start,
     * `drag.end.<id>` on end and `drag.move.<id>` on every move. When element will be dragged over another element
     * `drag.over.<id>` will be fired as well.
     *
     * Start event and start handler will be called in specified context or in context of the element with following parameters:
     o x (number) x position of the mouse
     o y (number) y position of the mouse
     o event (object) DOM event object
     * Move event and move handler will be called in specified context or in context of the element with following parameters:
     o dx (number) shift by x from the start point
     o dy (number) shift by y from the start point
     o x (number) x position of the mouse
     o y (number) y position of the mouse
     o event (object) DOM event object
     * End event and end handler will be called in specified context or in context of the element with following parameters:
     o event (object) DOM event object
     = (object) @Element
    \*/
				elproto.drag = function (onmove, onstart, onend, move_scope, start_scope, end_scope) {
					function start(e) {
						(e.originalEvent || e).preventDefault();
						var x = e.clientX,
						    y = e.clientY,
						    scrollY = g.doc.documentElement.scrollTop || g.doc.body.scrollTop,
						    scrollX = g.doc.documentElement.scrollLeft || g.doc.body.scrollLeft;
						this._drag.id = e.identifier;
						if (supportsTouch && e.touches) {
							var i = e.touches.length,
							    touch;
							while (i--) {
								touch = e.touches[i];
								this._drag.id = touch.identifier;
								if (touch.identifier == this._drag.id) {
									x = touch.clientX;
									y = touch.clientY;
									break;
								}
							}
						}
						this._drag.x = x + scrollX;
						this._drag.y = y + scrollY;
						!drag.length && R.mousemove(dragMove).mouseup(dragUp);
						drag.push({ el: this, move_scope: move_scope, start_scope: start_scope, end_scope: end_scope });
						onstart && eve.on("raphael.drag.start." + this.id, onstart);
						onmove && eve.on("raphael.drag.move." + this.id, onmove);
						onend && eve.on("raphael.drag.end." + this.id, onend);
						eve("raphael.drag.start." + this.id, start_scope || move_scope || this, e.clientX + scrollX, e.clientY + scrollY, e);
					}
					this._drag = {};
					draggable.push({ el: this, start: start });
					this.mousedown(start);
					return this;
				};
				/*\
     * Element.onDragOver
     [ method ]
     **
     * Shortcut for assigning event handler for `drag.over.<id>` event, where id is id of the element (see @Element.id).
     > Parameters
     - f (function) handler for event, first argument would be the element you are dragging over
    \*/
				elproto.onDragOver = function (f) {
					f ? eve.on("raphael.drag.over." + this.id, f) : eve.unbind("raphael.drag.over." + this.id);
				};
				/*\
     * Element.undrag
     [ method ]
     **
     * Removes all drag event handlers from given element.
    \*/
				elproto.undrag = function () {
					var i = draggable.length;
					while (i--) {
						if (draggable[i].el == this) {
							this.unmousedown(draggable[i].start);
							draggable.splice(i, 1);
							eve.unbind("raphael.drag.*." + this.id);
						}
					}!draggable.length && R.unmousemove(dragMove).unmouseup(dragUp);
					drag = [];
				};
				/*\
     * Paper.circle
     [ method ]
     **
     * Draws a circle.
     **
     > Parameters
     **
     - x (number) x coordinate of the centre
     - y (number) y coordinate of the centre
     - r (number) radius
     = (object) Raphaël element object with type “circle”
     **
     > Usage
     | var c = paper.circle(50, 50, 40);
    \*/
				paperproto.circle = function (x, y, r) {
					var out = R._engine.circle(this, x || 0, y || 0, r || 0);
					this.__set__ && this.__set__.push(out);
					return out;
				};
				/*\
     * Paper.rect
     [ method ]
     *
     * Draws a rectangle.
     **
     > Parameters
     **
     - x (number) x coordinate of the top left corner
     - y (number) y coordinate of the top left corner
     - width (number) width
     - height (number) height
     - r (number) #optional radius for rounded corners, default is 0
     = (object) Raphaël element object with type “rect”
     **
     > Usage
     | // regular rectangle
     | var c = paper.rect(10, 10, 50, 50);
     | // rectangle with rounded corners
     | var c = paper.rect(40, 40, 50, 50, 10);
    \*/
				paperproto.rect = function (x, y, w, h, r) {
					var out = R._engine.rect(this, x || 0, y || 0, w || 0, h || 0, r || 0);
					this.__set__ && this.__set__.push(out);
					return out;
				};
				/*\
     * Paper.ellipse
     [ method ]
     **
     * Draws an ellipse.
     **
     > Parameters
     **
     - x (number) x coordinate of the centre
     - y (number) y coordinate of the centre
     - rx (number) horizontal radius
     - ry (number) vertical radius
     = (object) Raphaël element object with type “ellipse”
     **
     > Usage
     | var c = paper.ellipse(50, 50, 40, 20);
    \*/
				paperproto.ellipse = function (x, y, rx, ry) {
					var out = R._engine.ellipse(this, x || 0, y || 0, rx || 0, ry || 0);
					this.__set__ && this.__set__.push(out);
					return out;
				};
				/*\
     * Paper.path
     [ method ]
     **
     * Creates a path element by given path data string.
     > Parameters
     - pathString (string) #optional path string in SVG format.
     * Path string consists of one-letter commands, followed by comma seprarated arguments in numercal form. Example:
     | "M10,20L30,40"
     * Here we can see two commands: “M”, with arguments `(10, 20)` and “L” with arguments `(30, 40)`. Upper case letter mean command is absolute, lower case—relative.
     *
     # <p>Here is short list of commands available, for more details see <a href="http://www.w3.org/TR/SVG/paths.html#PathData" title="Details of a path's data attribute's format are described in the SVG specification.">SVG path string format</a>.</p>
     # <table_group><thead><tr><th>Command</th><th>Name</th><th>Parameters</th></tr></thead><tbody>
     # <tr><td>M</td><td>moveto</td><td>(x y)+</td></tr>
     # <tr><td>Z</td><td>closepath</td><td>(none)</td></tr>
     # <tr><td>L</td><td>lineto</td><td>(x y)+</td></tr>
     # <tr><td>H</td><td>horizontal lineto</td><td>x+</td></tr>
     # <tr><td>V</td><td>vertical lineto</td><td>y+</td></tr>
     # <tr><td>C</td><td>curveto</td><td>(x1 y1 x2 y2 x y)+</td></tr>
     # <tr><td>S</td><td>smooth curveto</td><td>(x2 y2 x y)+</td></tr>
     # <tr><td>Q</td><td>quadratic Bézier curveto</td><td>(x1 y1 x y)+</td></tr>
     # <tr><td>T</td><td>smooth quadratic Bézier curveto</td><td>(x y)+</td></tr>
     # <tr><td>A</td><td>elliptical arc</td><td>(rx ry x-axis-rotation large-arc-flag sweep-flag x y)+</td></tr>
     # <tr><td>R</td><td><a href="http://en.wikipedia.org/wiki/Catmull–Rom_spline#Catmull.E2.80.93Rom_spline">Catmull-Rom curveto</a>*</td><td>x1 y1 (x y)+</td></tr></tbody></table_group>
     * * “Catmull-Rom curveto” is a not standard SVG command and added in 2.0 to make life easier.
     * Note: there is a special case when path consist of just three commands: “M10,10R…z”. In this case path will smoothly connects to its beginning.
     > Usage
     | var c = paper.path("M10 10L90 90");
     | // draw a diagonal line:
     | // move to 10,10, line to 90,90
     * For example of path strings, check out these icons: http://raphaeljs.com/icons/
    \*/
				paperproto.path = function (pathString) {
					pathString && !R.is(pathString, string) && !R.is(pathString[0], array) && (pathString += E);
					var out = R._engine.path(R.format[apply](R, arguments), this);
					this.__set__ && this.__set__.push(out);
					return out;
				};
				/*\
     * Paper.image
     [ method ]
     **
     * Embeds an image into the surface.
     **
     > Parameters
     **
     - src (string) URI of the source image
     - x (number) x coordinate position
     - y (number) y coordinate position
     - width (number) width of the image
     - height (number) height of the image
     = (object) Raphaël element object with type “image”
     **
     > Usage
     | var c = paper.image("apple.png", 10, 10, 80, 80);
    \*/
				paperproto.image = function (src, x, y, w, h) {
					var out = R._engine.image(this, src || "about:blank", x || 0, y || 0, w || 0, h || 0);
					this.__set__ && this.__set__.push(out);
					return out;
				};
				/*\
     * Paper.text
     [ method ]
     **
     * Draws a text string. If you need line breaks, put “\n” in the string.
     **
     > Parameters
     **
     - x (number) x coordinate position
     - y (number) y coordinate position
     - text (string) The text string to draw
     = (object) Raphaël element object with type “text”
     **
     > Usage
     | var t = paper.text(50, 50, "Raphaël\nkicks\nbutt!");
    \*/
				paperproto.text = function (x, y, text) {
					var out = R._engine.text(this, x || 0, y || 0, Str(text));
					this.__set__ && this.__set__.push(out);
					return out;
				};
				/*\
     * Paper.set
     [ method ]
     **
     * Creates array-like object to keep and operate several elements at once.
     * Warning: it doesn’t create any elements for itself in the page, it just groups existing elements.
     * Sets act as pseudo elements — all methods available to an element can be used on a set.
     = (object) array-like object that represents set of elements
     **
     > Usage
     | var st = paper.set();
     | st.push(
     |     paper.circle(10, 10, 5),
     |     paper.circle(30, 10, 5)
     | );
     | st.attr({fill: "red"}); // changes the fill of both circles
    \*/
				paperproto.set = function (itemsArray) {
					!R.is(itemsArray, "array") && (itemsArray = Array.prototype.splice.call(arguments, 0, arguments.length));
					var out = new Set(itemsArray);
					this.__set__ && this.__set__.push(out);
					out["paper"] = this;
					out["type"] = "set";
					return out;
				};
				/*\
     * Paper.setStart
     [ method ]
     **
     * Creates @Paper.set. All elements that will be created after calling this method and before calling
     * @Paper.setFinish will be added to the set.
     **
     > Usage
     | paper.setStart();
     | paper.circle(10, 10, 5),
     | paper.circle(30, 10, 5)
     | var st = paper.setFinish();
     | st.attr({fill: "red"}); // changes the fill of both circles
    \*/
				paperproto.setStart = function (set) {
					this.__set__ = set || this.set();
				};
				/*\
     * Paper.setFinish
     [ method ]
     **
     * See @Paper.setStart. This method finishes catching and returns resulting set.
     **
     = (object) set
    \*/
				paperproto.setFinish = function (set) {
					var out = this.__set__;
					delete this.__set__;
					return out;
				};
				/*\
     * Paper.getSize
     [ method ]
     **
     * Obtains current paper actual size.
     **
     = (object)
     \*/
				paperproto.getSize = function () {
					var container = this.canvas.parentNode;
					return {
						width: container.offsetWidth,
						height: container.offsetHeight
					};
				};
				/*\
     * Paper.setSize
     [ method ]
     **
     * If you need to change dimensions of the canvas call this method
     **
     > Parameters
     **
     - width (number) new width of the canvas
     - height (number) new height of the canvas
    \*/
				paperproto.setSize = function (width, height) {
					return R._engine.setSize.call(this, width, height);
				};
				/*\
     * Paper.setViewBox
     [ method ]
     **
     * Sets the view box of the paper. Practically it gives you ability to zoom and pan whole paper surface by
     * specifying new boundaries.
     **
     > Parameters
     **
     - x (number) new x position, default is `0`
     - y (number) new y position, default is `0`
     - w (number) new width of the canvas
     - h (number) new height of the canvas
     - fit (boolean) `true` if you want graphics to fit into new boundary box
    \*/
				paperproto.setViewBox = function (x, y, w, h, fit) {
					return R._engine.setViewBox.call(this, x, y, w, h, fit);
				};
				/*\
     * Paper.top
     [ property ]
     **
     * Points to the topmost element on the paper
    \*/
				/*\
     * Paper.bottom
     [ property ]
     **
     * Points to the bottom element on the paper
    \*/
				paperproto.top = paperproto.bottom = null;
				/*\
     * Paper.raphael
     [ property ]
     **
     * Points to the @Raphael object/function
    \*/
				paperproto.raphael = R;
				var getOffset = function getOffset(elem) {
					var box = elem.getBoundingClientRect(),
					    doc = elem.ownerDocument,
					    body = doc.body,
					    docElem = doc.documentElement,
					    clientTop = docElem.clientTop || body.clientTop || 0,
					    clientLeft = docElem.clientLeft || body.clientLeft || 0,
					    top = box.top + (g.win.pageYOffset || docElem.scrollTop || body.scrollTop) - clientTop,
					    left = box.left + (g.win.pageXOffset || docElem.scrollLeft || body.scrollLeft) - clientLeft;
					return {
						y: top,
						x: left
					};
				};
				/*\
     * Paper.getElementByPoint
     [ method ]
     **
     * Returns you topmost element under given point.
     **
     = (object) Raphaël element object
     > Parameters
     **
     - x (number) x coordinate from the top left corner of the window
     - y (number) y coordinate from the top left corner of the window
     > Usage
     | paper.getElementByPoint(mouseX, mouseY).attr({stroke: "#f00"});
    \*/
				paperproto.getElementByPoint = function (x, y) {
					var paper = this,
					    svg = paper.canvas,
					    target = g.doc.elementFromPoint(x, y);
					if (g.win.opera && target.tagName == "svg") {
						var so = getOffset(svg),
						    sr = svg.createSVGRect();
						sr.x = x - so.x;
						sr.y = y - so.y;
						sr.width = sr.height = 1;
						var hits = svg.getIntersectionList(sr, null);
						if (hits.length) {
							target = hits[hits.length - 1];
						}
					}
					if (!target) {
						return null;
					}
					while (target.parentNode && target != svg.parentNode && !target.raphael) {
						target = target.parentNode;
					}
					target == paper.canvas.parentNode && (target = svg);
					target = target && target.raphael ? paper.getById(target.raphaelid) : null;
					return target;
				};

				/*\
     * Paper.getElementsByBBox
     [ method ]
     **
     * Returns set of elements that have an intersecting bounding box
     **
     > Parameters
     **
     - bbox (object) bbox to check with
     = (object) @Set
     \*/
				paperproto.getElementsByBBox = function (bbox) {
					var set = this.set();
					this.forEach(function (el) {
						if (R.isBBoxIntersect(el.getBBox(), bbox)) {
							set.push(el);
						}
					});
					return set;
				};

				/*\
     * Paper.getById
     [ method ]
     **
     * Returns you element by its internal ID.
     **
     > Parameters
     **
     - id (number) id
     = (object) Raphaël element object
    \*/
				paperproto.getById = function (id) {
					var bot = this.bottom;
					while (bot) {
						if (bot.id == id) {
							return bot;
						}
						bot = bot.next;
					}
					return null;
				};
				/*\
     * Paper.forEach
     [ method ]
     **
     * Executes given function for each element on the paper
     *
     * If callback function returns `false` it will stop loop running.
     **
     > Parameters
     **
     - callback (function) function to run
     - thisArg (object) context object for the callback
     = (object) Paper object
     > Usage
     | paper.forEach(function (el) {
     |     el.attr({ stroke: "blue" });
     | });
    \*/
				paperproto.forEach = function (callback, thisArg) {
					var bot = this.bottom;
					while (bot) {
						if (callback.call(thisArg, bot) === false) {
							return this;
						}
						bot = bot.next;
					}
					return this;
				};
				/*\
     * Paper.getElementsByPoint
     [ method ]
     **
     * Returns set of elements that have common point inside
     **
     > Parameters
     **
     - x (number) x coordinate of the point
     - y (number) y coordinate of the point
     = (object) @Set
    \*/
				paperproto.getElementsByPoint = function (x, y) {
					var set = this.set();
					this.forEach(function (el) {
						if (el.isPointInside(x, y)) {
							set.push(el);
						}
					});
					return set;
				};
				function x_y() {
					return this.x + S + this.y;
				}
				function x_y_w_h() {
					return this.x + S + this.y + S + this.width + " \xd7 " + this.height;
				}
				/*\
     * Element.isPointInside
     [ method ]
     **
     * Determine if given point is inside this element’s shape
     **
     > Parameters
     **
     - x (number) x coordinate of the point
     - y (number) y coordinate of the point
     = (boolean) `true` if point inside the shape
    \*/
				elproto.isPointInside = function (x, y) {
					var rp = this.realPath = getPath[this.type](this);
					if (this.attr('transform') && this.attr('transform').length) {
						rp = R.transformPath(rp, this.attr('transform'));
					}
					return R.isPointInsidePath(rp, x, y);
				};
				/*\
     * Element.getBBox
     [ method ]
     **
     * Return bounding box for a given element
     **
     > Parameters
     **
     - isWithoutTransform (boolean) flag, `true` if you want to have bounding box before transformations. Default is `false`.
     = (object) Bounding box object:
     o {
     o     x: (number) top left corner x
     o     y: (number) top left corner y
     o     x2: (number) bottom right corner x
     o     y2: (number) bottom right corner y
     o     width: (number) width
     o     height: (number) height
     o }
    \*/
				elproto.getBBox = function (isWithoutTransform) {
					if (this.removed) {
						return {};
					}
					var _ = this._;
					if (isWithoutTransform) {
						if (_.dirty || !_.bboxwt) {
							this.realPath = getPath[this.type](this);
							_.bboxwt = pathDimensions(this.realPath);
							_.bboxwt.toString = x_y_w_h;
							_.dirty = 0;
						}
						return _.bboxwt;
					}
					if (_.dirty || _.dirtyT || !_.bbox) {
						if (_.dirty || !this.realPath) {
							_.bboxwt = 0;
							this.realPath = getPath[this.type](this);
						}
						_.bbox = pathDimensions(mapPath(this.realPath, this.matrix));
						_.bbox.toString = x_y_w_h;
						_.dirty = _.dirtyT = 0;
					}
					return _.bbox;
				};
				/*\
     * Element.clone
     [ method ]
     **
     = (object) clone of a given element
     **
    \*/
				elproto.clone = function () {
					if (this.removed) {
						return null;
					}
					var out = this.paper[this.type]().attr(this.attr());
					this.__set__ && this.__set__.push(out);
					return out;
				};
				/*\
     * Element.glow
     [ method ]
     **
     * Return set of elements that create glow-like effect around given element. See @Paper.set.
     *
     * Note: Glow is not connected to the element. If you change element attributes it won’t adjust itself.
     **
     > Parameters
     **
     - glow (object) #optional parameters object with all properties optional:
     o {
     o     width (number) size of the glow, default is `10`
     o     fill (boolean) will it be filled, default is `false`
     o     opacity (number) opacity, default is `0.5`
     o     offsetx (number) horizontal offset, default is `0`
     o     offsety (number) vertical offset, default is `0`
     o     color (string) glow colour, default is `black`
     o }
     = (object) @Paper.set of elements that represents glow
    \*/
				elproto.glow = function (glow) {
					if (this.type == "text") {
						return null;
					}
					glow = glow || {};
					var s = {
						width: (glow.width || 10) + (+this.attr("stroke-width") || 1),
						fill: glow.fill || false,
						opacity: glow.opacity == null ? .5 : glow.opacity,
						offsetx: glow.offsetx || 0,
						offsety: glow.offsety || 0,
						color: glow.color || "#000"
					},
					    c = s.width / 2,
					    r = this.paper,
					    out = r.set(),
					    path = this.realPath || getPath[this.type](this);
					path = this.matrix ? mapPath(path, this.matrix) : path;
					for (var i = 1; i < c + 1; i++) {
						out.push(r.path(path).attr({
							stroke: s.color,
							fill: s.fill ? s.color : "none",
							"stroke-linejoin": "round",
							"stroke-linecap": "round",
							"stroke-width": +(s.width / c * i).toFixed(3),
							opacity: +(s.opacity / c).toFixed(3)
						}));
					}
					return out.insertBefore(this).translate(s.offsetx, s.offsety);
				};
				var curveslengths = {},
				    getPointAtSegmentLength = function getPointAtSegmentLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length) {
					if (length == null) {
						return bezlen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y);
					} else {
						return R.findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, getTatLen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length));
					}
				},
				    getLengthFactory = function getLengthFactory(istotal, subpath) {
					return function (path, length, onlystart) {
						path = path2curve(path);
						var x,
						    y,
						    p,
						    l,
						    sp = "",
						    subpaths = {},
						    point,
						    len = 0;
						for (var i = 0, ii = path.length; i < ii; i++) {
							p = path[i];
							if (p[0] == "M") {
								x = +p[1];
								y = +p[2];
							} else {
								l = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
								if (len + l > length) {
									if (subpath && !subpaths.start) {
										point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
										sp += ["C" + point.start.x, point.start.y, point.m.x, point.m.y, point.x, point.y];
										if (onlystart) {
											return sp;
										}
										subpaths.start = sp;
										sp = ["M" + point.x, point.y + "C" + point.n.x, point.n.y, point.end.x, point.end.y, p[5], p[6]].join();
										len += l;
										x = +p[5];
										y = +p[6];
										continue;
									}
									if (!istotal && !subpath) {
										point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
										return { x: point.x, y: point.y, alpha: point.alpha };
									}
								}
								len += l;
								x = +p[5];
								y = +p[6];
							}
							sp += p.shift() + p;
						}
						subpaths.end = sp;
						point = istotal ? len : subpath ? subpaths : R.findDotsAtSegment(x, y, p[0], p[1], p[2], p[3], p[4], p[5], 1);
						point.alpha && (point = { x: point.x, y: point.y, alpha: point.alpha });
						return point;
					};
				};
				var getTotalLength = getLengthFactory(1),
				    getPointAtLength = getLengthFactory(),
				    getSubpathsAtLength = getLengthFactory(0, 1);
				/*\
     * Raphael.getTotalLength
     [ method ]
     **
     * Returns length of the given path in pixels.
     **
     > Parameters
     **
     - path (string) SVG path string.
     **
     = (number) length.
    \*/
				R.getTotalLength = getTotalLength;
				/*\
     * Raphael.getPointAtLength
     [ method ]
     **
     * Return coordinates of the point located at the given length on the given path.
     **
     > Parameters
     **
     - path (string) SVG path string
     - length (number)
     **
     = (object) representation of the point:
     o {
     o     x: (number) x coordinate
     o     y: (number) y coordinate
     o     alpha: (number) angle of derivative
     o }
    \*/
				R.getPointAtLength = getPointAtLength;
				/*\
     * Raphael.getSubpath
     [ method ]
     **
     * Return subpath of a given path from given length to given length.
     **
     > Parameters
     **
     - path (string) SVG path string
     - from (number) position of the start of the segment
     - to (number) position of the end of the segment
     **
     = (string) pathstring for the segment
    \*/
				R.getSubpath = function (path, from, to) {
					if (this.getTotalLength(path) - to < 1e-6) {
						return getSubpathsAtLength(path, from).end;
					}
					var a = getSubpathsAtLength(path, to, 1);
					return from ? getSubpathsAtLength(a, from).end : a;
				};
				/*\
     * Element.getTotalLength
     [ method ]
     **
     * Returns length of the path in pixels. Only works for element of “path” type.
     = (number) length.
    \*/
				elproto.getTotalLength = function () {
					var path = this.getPath();
					if (!path) {
						return;
					}

					if (this.node.getTotalLength) {
						return this.node.getTotalLength();
					}

					return getTotalLength(path);
				};
				/*\
     * Element.getPointAtLength
     [ method ]
     **
     * Return coordinates of the point located at the given length on the given path. Only works for element of “path” type.
     **
     > Parameters
     **
     - length (number)
     **
     = (object) representation of the point:
     o {
     o     x: (number) x coordinate
     o     y: (number) y coordinate
     o     alpha: (number) angle of derivative
     o }
    \*/
				elproto.getPointAtLength = function (length) {
					var path = this.getPath();
					if (!path) {
						return;
					}

					return getPointAtLength(path, length);
				};
				/*\
     * Element.getPath
     [ method ]
     **
     * Returns path of the element. Only works for elements of “path” type and simple elements like circle.
     = (object) path
     **
    \*/
				elproto.getPath = function () {
					var path,
					    getPath = R._getPath[this.type];

					if (this.type == "text" || this.type == "set") {
						return;
					}

					if (getPath) {
						path = getPath(this);
					}

					return path;
				};
				/*\
     * Element.getSubpath
     [ method ]
     **
     * Return subpath of a given element from given length to given length. Only works for element of “path” type.
     **
     > Parameters
     **
     - from (number) position of the start of the segment
     - to (number) position of the end of the segment
     **
     = (string) pathstring for the segment
    \*/
				elproto.getSubpath = function (from, to) {
					var path = this.getPath();
					if (!path) {
						return;
					}

					return R.getSubpath(path, from, to);
				};
				/*\
     * Raphael.easing_formulas
     [ property ]
     **
     * Object that contains easing formulas for animation. You could extend it with your own. By default it has following list of easing:
     # <ul>
     #     <li>“linear”</li>
     #     <li>“&lt;” or “easeIn” or “ease-in”</li>
     #     <li>“>” or “easeOut” or “ease-out”</li>
     #     <li>“&lt;>” or “easeInOut” or “ease-in-out”</li>
     #     <li>“backIn” or “back-in”</li>
     #     <li>“backOut” or “back-out”</li>
     #     <li>“elastic”</li>
     #     <li>“bounce”</li>
     # </ul>
     # <p>See also <a href="http://raphaeljs.com/easing.html">Easing demo</a>.</p>
    \*/
				var ef = R.easing_formulas = {
					linear: function linear(n) {
						return n;
					},
					"<": function _(n) {
						return pow(n, 1.7);
					},
					">": function _(n) {
						return pow(n, .48);
					},
					"<>": function _(n) {
						var q = .48 - n / 1.04,
						    Q = math.sqrt(.1734 + q * q),
						    x = Q - q,
						    X = pow(abs(x), 1 / 3) * (x < 0 ? -1 : 1),
						    y = -Q - q,
						    Y = pow(abs(y), 1 / 3) * (y < 0 ? -1 : 1),
						    t = X + Y + .5;
						return (1 - t) * 3 * t * t + t * t * t;
					},
					backIn: function backIn(n) {
						var s = 1.70158;
						return n * n * ((s + 1) * n - s);
					},
					backOut: function backOut(n) {
						n = n - 1;
						var s = 1.70158;
						return n * n * ((s + 1) * n + s) + 1;
					},
					elastic: function elastic(n) {
						if (n == !!n) {
							return n;
						}
						return pow(2, -10 * n) * math.sin((n - .075) * (2 * PI) / .3) + 1;
					},
					bounce: function bounce(n) {
						var s = 7.5625,
						    p = 2.75,
						    l;
						if (n < 1 / p) {
							l = s * n * n;
						} else {
							if (n < 2 / p) {
								n -= 1.5 / p;
								l = s * n * n + .75;
							} else {
								if (n < 2.5 / p) {
									n -= 2.25 / p;
									l = s * n * n + .9375;
								} else {
									n -= 2.625 / p;
									l = s * n * n + .984375;
								}
							}
						}
						return l;
					}
				};
				ef.easeIn = ef["ease-in"] = ef["<"];
				ef.easeOut = ef["ease-out"] = ef[">"];
				ef.easeInOut = ef["ease-in-out"] = ef["<>"];
				ef["back-in"] = ef.backIn;
				ef["back-out"] = ef.backOut;

				var animationElements = [],
				    requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
					setTimeout(callback, 16);
				},
				    animation = function animation() {
					var Now = +new Date(),
					    l = 0;
					for (; l < animationElements.length; l++) {
						var e = animationElements[l];
						if (e.el.removed || e.paused) {
							continue;
						}
						var time = Now - e.start,
						    ms = e.ms,
						    easing = e.easing,
						    from = e.from,
						    diff = e.diff,
						    to = e.to,
						    t = e.t,
						    that = e.el,
						    set = {},
						    now,
						    init = {},
						    key;
						if (e.initstatus) {
							time = (e.initstatus * e.anim.top - e.prev) / (e.percent - e.prev) * ms;
							e.status = e.initstatus;
							delete e.initstatus;
							e.stop && animationElements.splice(l--, 1);
						} else {
							e.status = (e.prev + (e.percent - e.prev) * (time / ms)) / e.anim.top;
						}
						if (time < 0) {
							continue;
						}
						if (time < ms) {
							var pos = easing(time / ms);
							for (var attr in from) {
								if (from[has](attr)) {
									switch (availableAnimAttrs[attr]) {
										case nu:
											now = +from[attr] + pos * ms * diff[attr];
											break;
										case "colour":
											now = "rgb(" + [upto255(round(from[attr].r + pos * ms * diff[attr].r)), upto255(round(from[attr].g + pos * ms * diff[attr].g)), upto255(round(from[attr].b + pos * ms * diff[attr].b))].join(",") + ")";
											break;
										case "path":
											now = [];
											for (var i = 0, ii = from[attr].length; i < ii; i++) {
												now[i] = [from[attr][i][0]];
												for (var j = 1, jj = from[attr][i].length; j < jj; j++) {
													now[i][j] = +from[attr][i][j] + pos * ms * diff[attr][i][j];
												}
												now[i] = now[i].join(S);
											}
											now = now.join(S);
											break;
										case "transform":
											if (diff[attr].real) {
												now = [];
												for (i = 0, ii = from[attr].length; i < ii; i++) {
													now[i] = [from[attr][i][0]];
													for (j = 1, jj = from[attr][i].length; j < jj; j++) {
														now[i][j] = from[attr][i][j] + pos * ms * diff[attr][i][j];
													}
												}
											} else {
												var get = function get(i) {
													return +from[attr][i] + pos * ms * diff[attr][i];
												};
												// now = [["r", get(2), 0, 0], ["t", get(3), get(4)], ["s", get(0), get(1), 0, 0]];
												now = [["m", get(0), get(1), get(2), get(3), get(4), get(5)]];
											}
											break;
										case "csv":
											if (attr == "clip-rect") {
												now = [];
												i = 4;
												while (i--) {
													now[i] = +from[attr][i] + pos * ms * diff[attr][i];
												}
											}
											break;
										default:
											var from2 = [][concat](from[attr]);
											now = [];
											i = that.paper.customAttributes[attr].length;
											while (i--) {
												now[i] = +from2[i] + pos * ms * diff[attr][i];
											}
											break;
									}
									set[attr] = now;
								}
							}that.attr(set);
							(function (id, that, anim) {
								setTimeout(function () {
									eve("raphael.anim.frame." + id, that, anim);
								});
							})(that.id, that, e.anim);
						} else {
							(function (f, el, a) {
								setTimeout(function () {
									eve("raphael.anim.frame." + el.id, el, a);
									eve("raphael.anim.finish." + el.id, el, a);
									R.is(f, "function") && f.call(el);
								});
							})(e.callback, that, e.anim);
							that.attr(to);
							animationElements.splice(l--, 1);
							if (e.repeat > 1 && !e.next) {
								for (key in to) {
									if (to[has](key)) {
										init[key] = e.totalOrigin[key];
									}
								}e.el.attr(init);
								runAnimation(e.anim, e.el, e.anim.percents[0], null, e.totalOrigin, e.repeat - 1);
							}
							if (e.next && !e.stop) {
								runAnimation(e.anim, e.el, e.next, null, e.totalOrigin, e.repeat);
							}
						}
					}
					animationElements.length && requestAnimFrame(animation);
				},
				    upto255 = function upto255(color) {
					return color > 255 ? 255 : color < 0 ? 0 : color;
				};
				/*\
     * Element.animateWith
     [ method ]
     **
     * Acts similar to @Element.animate, but ensure that given animation runs in sync with another given element.
     **
     > Parameters
     **
     - el (object) element to sync with
     - anim (object) animation to sync with
     - params (object) #optional final attributes for the element, see also @Element.attr
     - ms (number) #optional number of milliseconds for animation to run
     - easing (string) #optional easing type. Accept on of @Raphael.easing_formulas or CSS format: `cubic&#x2010;bezier(XX,&#160;XX,&#160;XX,&#160;XX)`
     - callback (function) #optional callback function. Will be called at the end of animation.
     * or
     - element (object) element to sync with
     - anim (object) animation to sync with
     - animation (object) #optional animation object, see @Raphael.animation
     **
     = (object) original element
    \*/
				elproto.animateWith = function (el, anim, params, ms, easing, callback) {
					var element = this;
					if (element.removed) {
						callback && callback.call(element);
						return element;
					}
					var a = params instanceof Animation ? params : R.animation(params, ms, easing, callback),
					    x,
					    y;
					runAnimation(a, element, a.percents[0], null, element.attr());
					for (var i = 0, ii = animationElements.length; i < ii; i++) {
						if (animationElements[i].anim == anim && animationElements[i].el == el) {
							animationElements[ii - 1].start = animationElements[i].start;
							break;
						}
					}
					return element;
					//
					//
					// var a = params ? R.animation(params, ms, easing, callback) : anim,
					//     status = element.status(anim);
					// return this.animate(a).status(a, status * anim.ms / a.ms);
				};
				function CubicBezierAtTime(t, p1x, p1y, p2x, p2y, duration) {
					var cx = 3 * p1x,
					    bx = 3 * (p2x - p1x) - cx,
					    ax = 1 - cx - bx,
					    cy = 3 * p1y,
					    by = 3 * (p2y - p1y) - cy,
					    ay = 1 - cy - by;
					function sampleCurveX(t) {
						return ((ax * t + bx) * t + cx) * t;
					}
					function solve(x, epsilon) {
						var t = solveCurveX(x, epsilon);
						return ((ay * t + by) * t + cy) * t;
					}
					function solveCurveX(x, epsilon) {
						var t0, t1, t2, x2, d2, i;
						for (t2 = x, i = 0; i < 8; i++) {
							x2 = sampleCurveX(t2) - x;
							if (abs(x2) < epsilon) {
								return t2;
							}
							d2 = (3 * ax * t2 + 2 * bx) * t2 + cx;
							if (abs(d2) < 1e-6) {
								break;
							}
							t2 = t2 - x2 / d2;
						}
						t0 = 0;
						t1 = 1;
						t2 = x;
						if (t2 < t0) {
							return t0;
						}
						if (t2 > t1) {
							return t1;
						}
						while (t0 < t1) {
							x2 = sampleCurveX(t2);
							if (abs(x2 - x) < epsilon) {
								return t2;
							}
							if (x > x2) {
								t0 = t2;
							} else {
								t1 = t2;
							}
							t2 = (t1 - t0) / 2 + t0;
						}
						return t2;
					}
					return solve(t, 1 / (200 * duration));
				}
				elproto.onAnimation = function (f) {
					f ? eve.on("raphael.anim.frame." + this.id, f) : eve.unbind("raphael.anim.frame." + this.id);
					return this;
				};
				function Animation(anim, ms) {
					var percents = [],
					    newAnim = {};
					this.ms = ms;
					this.times = 1;
					if (anim) {
						for (var attr in anim) {
							if (anim[has](attr)) {
								newAnim[toFloat(attr)] = anim[attr];
								percents.push(toFloat(attr));
							}
						}percents.sort(sortByNumber);
					}
					this.anim = newAnim;
					this.top = percents[percents.length - 1];
					this.percents = percents;
				}
				/*\
     * Animation.delay
     [ method ]
     **
     * Creates a copy of existing animation object with given delay.
     **
     > Parameters
     **
     - delay (number) number of ms to pass between animation start and actual animation
     **
     = (object) new altered Animation object
     | var anim = Raphael.animation({cx: 10, cy: 20}, 2e3);
     | circle1.animate(anim); // run the given animation immediately
     | circle2.animate(anim.delay(500)); // run the given animation after 500 ms
    \*/
				Animation.prototype.delay = function (delay) {
					var a = new Animation(this.anim, this.ms);
					a.times = this.times;
					a.del = +delay || 0;
					return a;
				};
				/*\
     * Animation.repeat
     [ method ]
     **
     * Creates a copy of existing animation object with given repetition.
     **
     > Parameters
     **
     - repeat (number) number iterations of animation. For infinite animation pass `Infinity`
     **
     = (object) new altered Animation object
    \*/
				Animation.prototype.repeat = function (times) {
					var a = new Animation(this.anim, this.ms);
					a.del = this.del;
					a.times = math.floor(mmax(times, 0)) || 1;
					return a;
				};
				function runAnimation(anim, element, percent, status, totalOrigin, times) {
					percent = toFloat(percent);
					var params,
					    isInAnim,
					    isInAnimSet,
					    percents = [],
					    next,
					    prev,
					    timestamp,
					    ms = anim.ms,
					    from = {},
					    to = {},
					    diff = {};
					if (status) {
						for (i = 0, ii = animationElements.length; i < ii; i++) {
							var e = animationElements[i];
							if (e.el.id == element.id && e.anim == anim) {
								if (e.percent != percent) {
									animationElements.splice(i, 1);
									isInAnimSet = 1;
								} else {
									isInAnim = e;
								}
								element.attr(e.totalOrigin);
								break;
							}
						}
					} else {
						status = +to; // NaN
					}
					for (var i = 0, ii = anim.percents.length; i < ii; i++) {
						if (anim.percents[i] == percent || anim.percents[i] > status * anim.top) {
							percent = anim.percents[i];
							prev = anim.percents[i - 1] || 0;
							ms = ms / anim.top * (percent - prev);
							next = anim.percents[i + 1];
							params = anim.anim[percent];
							break;
						} else if (status) {
							element.attr(anim.anim[anim.percents[i]]);
						}
					}
					if (!params) {
						return;
					}
					if (!isInAnim) {
						for (var attr in params) {
							if (params[has](attr)) {
								if (availableAnimAttrs[has](attr) || element.paper.customAttributes[has](attr)) {
									from[attr] = element.attr(attr);
									from[attr] == null && (from[attr] = availableAttrs[attr]);
									to[attr] = params[attr];
									switch (availableAnimAttrs[attr]) {
										case nu:
											diff[attr] = (to[attr] - from[attr]) / ms;
											break;
										case "colour":
											from[attr] = R.getRGB(from[attr]);
											var toColour = R.getRGB(to[attr]);
											diff[attr] = {
												r: (toColour.r - from[attr].r) / ms,
												g: (toColour.g - from[attr].g) / ms,
												b: (toColour.b - from[attr].b) / ms
											};
											break;
										case "path":
											var pathes = path2curve(from[attr], to[attr]),
											    toPath = pathes[1];
											from[attr] = pathes[0];
											diff[attr] = [];
											for (i = 0, ii = from[attr].length; i < ii; i++) {
												diff[attr][i] = [0];
												for (var j = 1, jj = from[attr][i].length; j < jj; j++) {
													diff[attr][i][j] = (toPath[i][j] - from[attr][i][j]) / ms;
												}
											}
											break;
										case "transform":
											var _ = element._,
											    eq = equaliseTransform(_[attr], to[attr]);
											if (eq) {
												from[attr] = eq.from;
												to[attr] = eq.to;
												diff[attr] = [];
												diff[attr].real = true;
												for (i = 0, ii = from[attr].length; i < ii; i++) {
													diff[attr][i] = [from[attr][i][0]];
													for (j = 1, jj = from[attr][i].length; j < jj; j++) {
														diff[attr][i][j] = (to[attr][i][j] - from[attr][i][j]) / ms;
													}
												}
											} else {
												var m = element.matrix || new Matrix(),
												    to2 = {
													_: { transform: _.transform },
													getBBox: function getBBox() {
														return element.getBBox(1);
													}
												};
												from[attr] = [m.a, m.b, m.c, m.d, m.e, m.f];
												extractTransform(to2, to[attr]);
												to[attr] = to2._.transform;
												diff[attr] = [(to2.matrix.a - m.a) / ms, (to2.matrix.b - m.b) / ms, (to2.matrix.c - m.c) / ms, (to2.matrix.d - m.d) / ms, (to2.matrix.e - m.e) / ms, (to2.matrix.f - m.f) / ms];
												// from[attr] = [_.sx, _.sy, _.deg, _.dx, _.dy];
												// var to2 = {_:{}, getBBox: function () { return element.getBBox(); }};
												// extractTransform(to2, to[attr]);
												// diff[attr] = [
												//     (to2._.sx - _.sx) / ms,
												//     (to2._.sy - _.sy) / ms,
												//     (to2._.deg - _.deg) / ms,
												//     (to2._.dx - _.dx) / ms,
												//     (to2._.dy - _.dy) / ms
												// ];
											}
											break;
										case "csv":
											var values = Str(params[attr])[split](separator),
											    from2 = Str(from[attr])[split](separator);
											if (attr == "clip-rect") {
												from[attr] = from2;
												diff[attr] = [];
												i = from2.length;
												while (i--) {
													diff[attr][i] = (values[i] - from[attr][i]) / ms;
												}
											}
											to[attr] = values;
											break;
										default:
											values = [][concat](params[attr]);
											from2 = [][concat](from[attr]);
											diff[attr] = [];
											i = element.paper.customAttributes[attr].length;
											while (i--) {
												diff[attr][i] = ((values[i] || 0) - (from2[i] || 0)) / ms;
											}
											break;
									}
								}
							}
						}var easing = params.easing,
						    easyeasy = R.easing_formulas[easing];
						if (!easyeasy) {
							easyeasy = Str(easing).match(bezierrg);
							if (easyeasy && easyeasy.length == 5) {
								var curve = easyeasy;
								easyeasy = function easyeasy(t) {
									return CubicBezierAtTime(t, +curve[1], +curve[2], +curve[3], +curve[4], ms);
								};
							} else {
								easyeasy = pipe;
							}
						}
						timestamp = params.start || anim.start || +new Date();
						e = {
							anim: anim,
							percent: percent,
							timestamp: timestamp,
							start: timestamp + (anim.del || 0),
							status: 0,
							initstatus: status || 0,
							stop: false,
							ms: ms,
							easing: easyeasy,
							from: from,
							diff: diff,
							to: to,
							el: element,
							callback: params.callback,
							prev: prev,
							next: next,
							repeat: times || anim.times,
							origin: element.attr(),
							totalOrigin: totalOrigin
						};
						animationElements.push(e);
						if (status && !isInAnim && !isInAnimSet) {
							e.stop = true;
							e.start = new Date() - ms * status;
							if (animationElements.length == 1) {
								return animation();
							}
						}
						if (isInAnimSet) {
							e.start = new Date() - e.ms * status;
						}
						animationElements.length == 1 && requestAnimFrame(animation);
					} else {
						isInAnim.initstatus = status;
						isInAnim.start = new Date() - isInAnim.ms * status;
					}
					eve("raphael.anim.start." + element.id, element, anim);
				}
				/*\
     * Raphael.animation
     [ method ]
     **
     * Creates an animation object that can be passed to the @Element.animate or @Element.animateWith methods.
     * See also @Animation.delay and @Animation.repeat methods.
     **
     > Parameters
     **
     - params (object) final attributes for the element, see also @Element.attr
     - ms (number) number of milliseconds for animation to run
     - easing (string) #optional easing type. Accept one of @Raphael.easing_formulas or CSS format: `cubic&#x2010;bezier(XX,&#160;XX,&#160;XX,&#160;XX)`
     - callback (function) #optional callback function. Will be called at the end of animation.
     **
     = (object) @Animation
    \*/
				R.animation = function (params, ms, easing, callback) {
					if (params instanceof Animation) {
						return params;
					}
					if (R.is(easing, "function") || !easing) {
						callback = callback || easing || null;
						easing = null;
					}
					params = Object(params);
					ms = +ms || 0;
					var p = {},
					    json,
					    attr;
					for (attr in params) {
						if (params[has](attr) && toFloat(attr) != attr && toFloat(attr) + "%" != attr) {
							json = true;
							p[attr] = params[attr];
						}
					}if (!json) {
						// if percent-like syntax is used and end-of-all animation callback used
						if (callback) {
							// find the last one
							var lastKey = 0;
							for (var i in params) {
								var percent = toInt(i);
								if (params[has](i) && percent > lastKey) {
									lastKey = percent;
								}
							}
							lastKey += '%';
							// if already defined callback in the last keyframe, skip
							!params[lastKey].callback && (params[lastKey].callback = callback);
						}
						return new Animation(params, ms);
					} else {
						easing && (p.easing = easing);
						callback && (p.callback = callback);
						return new Animation({ 100: p }, ms);
					}
				};
				/*\
     * Element.animate
     [ method ]
     **
     * Creates and starts animation for given element.
     **
     > Parameters
     **
     - params (object) final attributes for the element, see also @Element.attr
     - ms (number) number of milliseconds for animation to run
     - easing (string) #optional easing type. Accept one of @Raphael.easing_formulas or CSS format: `cubic&#x2010;bezier(XX,&#160;XX,&#160;XX,&#160;XX)`
     - callback (function) #optional callback function. Will be called at the end of animation.
     * or
     - animation (object) animation object, see @Raphael.animation
     **
     = (object) original element
    \*/
				elproto.animate = function (params, ms, easing, callback) {
					var element = this;
					if (element.removed) {
						callback && callback.call(element);
						return element;
					}
					var anim = params instanceof Animation ? params : R.animation(params, ms, easing, callback);
					runAnimation(anim, element, anim.percents[0], null, element.attr());
					return element;
				};
				/*\
     * Element.setTime
     [ method ]
     **
     * Sets the status of animation of the element in milliseconds. Similar to @Element.status method.
     **
     > Parameters
     **
     - anim (object) animation object
     - value (number) number of milliseconds from the beginning of the animation
     **
     = (object) original element if `value` is specified
     * Note, that during animation following events are triggered:
     *
     * On each animation frame event `anim.frame.<id>`, on start `anim.start.<id>` and on end `anim.finish.<id>`.
    \*/
				elproto.setTime = function (anim, value) {
					if (anim && value != null) {
						this.status(anim, mmin(value, anim.ms) / anim.ms);
					}
					return this;
				};
				/*\
     * Element.status
     [ method ]
     **
     * Gets or sets the status of animation of the element.
     **
     > Parameters
     **
     - anim (object) #optional animation object
     - value (number) #optional 0 – 1. If specified, method works like a setter and sets the status of a given animation to the value. This will cause animation to jump to the given position.
     **
     = (number) status
     * or
     = (array) status if `anim` is not specified. Array of objects in format:
     o {
     o     anim: (object) animation object
     o     status: (number) status
     o }
     * or
     = (object) original element if `value` is specified
    \*/
				elproto.status = function (anim, value) {
					var out = [],
					    i = 0,
					    len,
					    e;
					if (value != null) {
						runAnimation(anim, this, -1, mmin(value, 1));
						return this;
					} else {
						len = animationElements.length;
						for (; i < len; i++) {
							e = animationElements[i];
							if (e.el.id == this.id && (!anim || e.anim == anim)) {
								if (anim) {
									return e.status;
								}
								out.push({
									anim: e.anim,
									status: e.status
								});
							}
						}
						if (anim) {
							return 0;
						}
						return out;
					}
				};
				/*\
     * Element.pause
     [ method ]
     **
     * Stops animation of the element with ability to resume it later on.
     **
     > Parameters
     **
     - anim (object) #optional animation object
     **
     = (object) original element
    \*/
				elproto.pause = function (anim) {
					for (var i = 0; i < animationElements.length; i++) {
						if (animationElements[i].el.id == this.id && (!anim || animationElements[i].anim == anim)) {
							if (eve("raphael.anim.pause." + this.id, this, animationElements[i].anim) !== false) {
								animationElements[i].paused = true;
							}
						}
					}return this;
				};
				/*\
     * Element.resume
     [ method ]
     **
     * Resumes animation if it was paused with @Element.pause method.
     **
     > Parameters
     **
     - anim (object) #optional animation object
     **
     = (object) original element
    \*/
				elproto.resume = function (anim) {
					for (var i = 0; i < animationElements.length; i++) {
						if (animationElements[i].el.id == this.id && (!anim || animationElements[i].anim == anim)) {
							var e = animationElements[i];
							if (eve("raphael.anim.resume." + this.id, this, e.anim) !== false) {
								delete e.paused;
								this.status(e.anim, e.status);
							}
						}
					}return this;
				};
				/*\
     * Element.stop
     [ method ]
     **
     * Stops animation of the element.
     **
     > Parameters
     **
     - anim (object) #optional animation object
     **
     = (object) original element
    \*/
				elproto.stop = function (anim) {
					for (var i = 0; i < animationElements.length; i++) {
						if (animationElements[i].el.id == this.id && (!anim || animationElements[i].anim == anim)) {
							if (eve("raphael.anim.stop." + this.id, this, animationElements[i].anim) !== false) {
								animationElements.splice(i--, 1);
							}
						}
					}return this;
				};
				function stopAnimation(paper) {
					for (var i = 0; i < animationElements.length; i++) {
						if (animationElements[i].el.paper == paper) {
							animationElements.splice(i--, 1);
						}
					}
				}
				eve.on("raphael.remove", stopAnimation);
				eve.on("raphael.clear", stopAnimation);
				elproto.toString = function () {
					return 'Rapha\xEBl\u2019s object';
				};

				// Set
				var Set = function Set(items) {
					this.items = [];
					this.length = 0;
					this.type = "set";
					if (items) {
						for (var i = 0, ii = items.length; i < ii; i++) {
							if (items[i] && (items[i].constructor == elproto.constructor || items[i].constructor == Set)) {
								this[this.items.length] = this.items[this.items.length] = items[i];
								this.length++;
							}
						}
					}
				},
				    setproto = Set.prototype;
				/*\
     * Set.push
     [ method ]
     **
     * Adds each argument to the current set.
     = (object) original element
    \*/
				setproto.push = function () {
					var item, len;
					for (var i = 0, ii = arguments.length; i < ii; i++) {
						item = arguments[i];
						if (item && (item.constructor == elproto.constructor || item.constructor == Set)) {
							len = this.items.length;
							this[len] = this.items[len] = item;
							this.length++;
						}
					}
					return this;
				};
				/*\
     * Set.pop
     [ method ]
     **
     * Removes last element and returns it.
     = (object) element
    \*/
				setproto.pop = function () {
					this.length && delete this[this.length--];
					return this.items.pop();
				};
				/*\
     * Set.forEach
     [ method ]
     **
     * Executes given function for each element in the set.
     *
     * If function returns `false` it will stop loop running.
     **
     > Parameters
     **
     - callback (function) function to run
     - thisArg (object) context object for the callback
     = (object) Set object
    \*/
				setproto.forEach = function (callback, thisArg) {
					for (var i = 0, ii = this.items.length; i < ii; i++) {
						if (callback.call(thisArg, this.items[i], i) === false) {
							return this;
						}
					}
					return this;
				};
				for (var method in elproto) {
					if (elproto[has](method)) {
						setproto[method] = function (methodname) {
							return function () {
								var arg = arguments;
								return this.forEach(function (el) {
									el[methodname][apply](el, arg);
								});
							};
						}(method);
					}
				}setproto.attr = function (name, value) {
					if (name && R.is(name, array) && R.is(name[0], "object")) {
						for (var j = 0, jj = name.length; j < jj; j++) {
							this.items[j].attr(name[j]);
						}
					} else {
						for (var i = 0, ii = this.items.length; i < ii; i++) {
							this.items[i].attr(name, value);
						}
					}
					return this;
				};
				/*\
     * Set.clear
     [ method ]
     **
     * Removes all elements from the set
    \*/
				setproto.clear = function () {
					while (this.length) {
						this.pop();
					}
				};
				/*\
     * Set.splice
     [ method ]
     **
     * Removes given element from the set
     **
     > Parameters
     **
     - index (number) position of the deletion
     - count (number) number of element to remove
     - insertion… (object) #optional elements to insert
     = (object) set elements that were deleted
    \*/
				setproto.splice = function (index, count, insertion) {
					index = index < 0 ? mmax(this.length + index, 0) : index;
					count = mmax(0, mmin(this.length - index, count));
					var tail = [],
					    todel = [],
					    args = [],
					    i;
					for (i = 2; i < arguments.length; i++) {
						args.push(arguments[i]);
					}
					for (i = 0; i < count; i++) {
						todel.push(this[index + i]);
					}
					for (; i < this.length - index; i++) {
						tail.push(this[index + i]);
					}
					var arglen = args.length;
					for (i = 0; i < arglen + tail.length; i++) {
						this.items[index + i] = this[index + i] = i < arglen ? args[i] : tail[i - arglen];
					}
					i = this.items.length = this.length -= count - arglen;
					while (this[i]) {
						delete this[i++];
					}
					return new Set(todel);
				};
				/*\
     * Set.exclude
     [ method ]
     **
     * Removes given element from the set
     **
     > Parameters
     **
     - element (object) element to remove
     = (boolean) `true` if object was found & removed from the set
    \*/
				setproto.exclude = function (el) {
					for (var i = 0, ii = this.length; i < ii; i++) {
						if (this[i] == el) {
							this.splice(i, 1);
							return true;
						}
					}
				};
				setproto.animate = function (params, ms, easing, callback) {
					(R.is(easing, "function") || !easing) && (callback = easing || null);
					var len = this.items.length,
					    i = len,
					    item,
					    set = this,
					    collector;
					if (!len) {
						return this;
					}
					callback && (collector = function collector() {
						! --len && callback.call(set);
					});
					easing = R.is(easing, string) ? easing : collector;
					var anim = R.animation(params, ms, easing, collector);
					item = this.items[--i].animate(anim);
					while (i--) {
						this.items[i] && !this.items[i].removed && this.items[i].animateWith(item, anim, anim);
						this.items[i] && !this.items[i].removed || len--;
					}
					return this;
				};
				setproto.insertAfter = function (el) {
					var i = this.items.length;
					while (i--) {
						this.items[i].insertAfter(el);
					}
					return this;
				};
				setproto.getBBox = function () {
					var x = [],
					    y = [],
					    x2 = [],
					    y2 = [];
					for (var i = this.items.length; i--;) {
						if (!this.items[i].removed) {
							var box = this.items[i].getBBox();
							x.push(box.x);
							y.push(box.y);
							x2.push(box.x + box.width);
							y2.push(box.y + box.height);
						}
					}x = mmin[apply](0, x);
					y = mmin[apply](0, y);
					x2 = mmax[apply](0, x2);
					y2 = mmax[apply](0, y2);
					return {
						x: x,
						y: y,
						x2: x2,
						y2: y2,
						width: x2 - x,
						height: y2 - y
					};
				};
				setproto.clone = function (s) {
					s = this.paper.set();
					for (var i = 0, ii = this.items.length; i < ii; i++) {
						s.push(this.items[i].clone());
					}
					return s;
				};
				setproto.toString = function () {
					return 'Rapha\xEBl\u2018s set';
				};

				setproto.glow = function (glowConfig) {
					var ret = this.paper.set();
					this.forEach(function (shape, index) {
						var g = shape.glow(glowConfig);
						if (g != null) {
							g.forEach(function (shape2, index2) {
								ret.push(shape2);
							});
						}
					});
					return ret;
				};

				/*\
     * Set.isPointInside
     [ method ]
     **
     * Determine if given point is inside this set’s elements
     **
     > Parameters
     **
     - x (number) x coordinate of the point
     - y (number) y coordinate of the point
     = (boolean) `true` if point is inside any of the set's elements
     \*/
				setproto.isPointInside = function (x, y) {
					var isPointInside = false;
					this.forEach(function (el) {
						if (el.isPointInside(x, y)) {
							isPointInside = true;
							return false; // stop loop
						}
					});
					return isPointInside;
				};

				/*\
     * Raphael.registerFont
     [ method ]
     **
     * Adds given font to the registered set of fonts for Raphaël. Should be used as an internal call from within Cufón’s font file.
     * Returns original parameter, so it could be used with chaining.
     # <a href="http://wiki.github.com/sorccu/cufon/about">More about Cufón and how to convert your font form TTF, OTF, etc to JavaScript file.</a>
     **
     > Parameters
     **
     - font (object) the font to register
     = (object) the font you passed in
     > Usage
     | Cufon.registerFont(Raphael.registerFont({…}));
    \*/
				R.registerFont = function (font) {
					if (!font.face) {
						return font;
					}
					this.fonts = this.fonts || {};
					var fontcopy = {
						w: font.w,
						face: {},
						glyphs: {}
					},
					    family = font.face["font-family"];
					for (var prop in font.face) {
						if (font.face[has](prop)) {
							fontcopy.face[prop] = font.face[prop];
						}
					}if (this.fonts[family]) {
						this.fonts[family].push(fontcopy);
					} else {
						this.fonts[family] = [fontcopy];
					}
					if (!font.svg) {
						fontcopy.face["units-per-em"] = toInt(font.face["units-per-em"], 10);
						for (var glyph in font.glyphs) {
							if (font.glyphs[has](glyph)) {
								var path = font.glyphs[glyph];
								fontcopy.glyphs[glyph] = {
									w: path.w,
									k: {},
									d: path.d && "M" + path.d.replace(/[mlcxtrv]/g, function (command) {
										return { l: "L", c: "C", x: "z", t: "m", r: "l", v: "c" }[command] || "M";
									}) + "z"
								};
								if (path.k) {
									for (var k in path.k) {
										if (path[has](k)) {
											fontcopy.glyphs[glyph].k[k] = path.k[k];
										}
									}
								}
							}
						}
					}
					return font;
				};
				/*\
     * Paper.getFont
     [ method ]
     **
     * Finds font object in the registered fonts by given parameters. You could specify only one word from the font name, like “Myriad” for “Myriad Pro”.
     **
     > Parameters
     **
     - family (string) font family name or any word from it
     - weight (string) #optional font weight
     - style (string) #optional font style
     - stretch (string) #optional font stretch
     = (object) the font object
     > Usage
     | paper.print(100, 100, "Test string", paper.getFont("Times", 800), 30);
    \*/
				paperproto.getFont = function (family, weight, style, stretch) {
					stretch = stretch || "normal";
					style = style || "normal";
					weight = +weight || { normal: 400, bold: 700, lighter: 300, bolder: 800 }[weight] || 400;
					if (!R.fonts) {
						return;
					}
					var font = R.fonts[family];
					if (!font) {
						var name = new RegExp("(^|\\s)" + family.replace(/[^\w\d\s+!~.:_-]/g, E) + "(\\s|$)", "i");
						for (var fontName in R.fonts) {
							if (R.fonts[has](fontName)) {
								if (name.test(fontName)) {
									font = R.fonts[fontName];
									break;
								}
							}
						}
					}
					var thefont;
					if (font) {
						for (var i = 0, ii = font.length; i < ii; i++) {
							thefont = font[i];
							if (thefont.face["font-weight"] == weight && (thefont.face["font-style"] == style || !thefont.face["font-style"]) && thefont.face["font-stretch"] == stretch) {
								break;
							}
						}
					}
					return thefont;
				};
				/*\
     * Paper.print
     [ method ]
     **
     * Creates path that represent given text written using given font at given position with given size.
     * Result of the method is path element that contains whole text as a separate path.
     **
     > Parameters
     **
     - x (number) x position of the text
     - y (number) y position of the text
     - string (string) text to print
     - font (object) font object, see @Paper.getFont
     - size (number) #optional size of the font, default is `16`
     - origin (string) #optional could be `"baseline"` or `"middle"`, default is `"middle"`
     - letter_spacing (number) #optional number in range `-1..1`, default is `0`
     - line_spacing (number) #optional number in range `1..3`, default is `1`
     = (object) resulting path element, which consist of all letters
     > Usage
     | var txt = r.print(10, 50, "print", r.getFont("Museo"), 30).attr({fill: "#fff"});
    \*/
				paperproto.print = function (x, y, string, font, size, origin, letter_spacing, line_spacing) {
					origin = origin || "middle"; // baseline|middle
					letter_spacing = mmax(mmin(letter_spacing || 0, 1), -1);
					line_spacing = mmax(mmin(line_spacing || 1, 3), 1);
					var letters = Str(string)[split](E),
					    shift = 0,
					    notfirst = 0,
					    path = E,
					    scale;
					R.is(font, "string") && (font = this.getFont(font));
					if (font) {
						scale = (size || 16) / font.face["units-per-em"];
						var bb = font.face.bbox[split](separator),
						    top = +bb[0],
						    lineHeight = bb[3] - bb[1],
						    shifty = 0,
						    height = +bb[1] + (origin == "baseline" ? lineHeight + +font.face.descent : lineHeight / 2);
						for (var i = 0, ii = letters.length; i < ii; i++) {
							if (letters[i] == "\n") {
								shift = 0;
								curr = 0;
								notfirst = 0;
								shifty += lineHeight * line_spacing;
							} else {
								var prev = notfirst && font.glyphs[letters[i - 1]] || {},
								    curr = font.glyphs[letters[i]];
								shift += notfirst ? (prev.w || font.w) + (prev.k && prev.k[letters[i]] || 0) + font.w * letter_spacing : 0;
								notfirst = 1;
							}
							if (curr && curr.d) {
								path += R.transformPath(curr.d, ["t", shift * scale, shifty * scale, "s", scale, scale, top, height, "t", (x - top) / scale, (y - height) / scale]);
							}
						}
					}
					return this.path(path).attr({
						fill: "#000",
						stroke: "none"
					});
				};

				/*\
     * Paper.add
     [ method ]
     **
     * Imports elements in JSON array in format `{type: type, <attributes>}`
     **
     > Parameters
     **
     - json (array)
     = (object) resulting set of imported elements
     > Usage
     | paper.add([
     |     {
     |         type: "circle",
     |         cx: 10,
     |         cy: 10,
     |         r: 5
     |     },
     |     {
     |         type: "rect",
     |         x: 10,
     |         y: 10,
     |         width: 10,
     |         height: 10,
     |         fill: "#fc0"
     |     }
     | ]);
    \*/
				paperproto.add = function (json) {
					if (R.is(json, "array")) {
						var res = this.set(),
						    i = 0,
						    ii = json.length,
						    j;
						for (; i < ii; i++) {
							j = json[i] || {};
							elements[has](j.type) && res.push(this[j.type]().attr(j));
						}
					}
					return res;
				};

				/*\
     * Raphael.format
     [ method ]
     **
     * Simple format function. Replaces construction of type “`{<number>}`” to the corresponding argument.
     **
     > Parameters
     **
     - token (string) string to format
     - … (string) rest of arguments will be treated as parameters for replacement
     = (string) formated string
     > Usage
     | var x = 10,
     |     y = 20,
     |     width = 40,
     |     height = 50;
     | // this will draw a rectangular shape equivalent to "M10,20h40v50h-40z"
     | paper.path(Raphael.format("M{0},{1}h{2}v{3}h{4}z", x, y, width, height, -width));
    \*/
				R.format = function (token, params) {
					var args = R.is(params, array) ? [0][concat](params) : arguments;
					token && R.is(token, string) && args.length - 1 && (token = token.replace(formatrg, function (str, i) {
						return args[++i] == null ? E : args[i];
					}));
					return token || E;
				};
				/*\
     * Raphael.fullfill
     [ method ]
     **
     * A little bit more advanced format function than @Raphael.format. Replaces construction of type “`{<name>}`” to the corresponding argument.
     **
     > Parameters
     **
     - token (string) string to format
     - json (object) object which properties will be used as a replacement
     = (string) formated string
     > Usage
     | // this will draw a rectangular shape equivalent to "M10,20h40v50h-40z"
     | paper.path(Raphael.fullfill("M{x},{y}h{dim.width}v{dim.height}h{dim['negative width']}z", {
     |     x: 10,
     |     y: 20,
     |     dim: {
     |         width: 40,
     |         height: 50,
     |         "negative width": -40
     |     }
     | }));
    \*/
				R.fullfill = function () {
					var tokenRegex = /\{([^\}]+)\}/g,
					    objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,
					    // matches .xxxxx or ["xxxxx"] to run over object properties
					replacer = function replacer(all, key, obj) {
						var res = obj;
						key.replace(objNotationRegex, function (all, name, quote, quotedName, isFunc) {
							name = name || quotedName;
							if (res) {
								if (name in res) {
									res = res[name];
								}
								typeof res == "function" && isFunc && (res = res());
							}
						});
						res = (res == null || res == obj ? all : res) + "";
						return res;
					};
					return function (str, obj) {
						return String(str).replace(tokenRegex, function (all, key) {
							return replacer(all, key, obj);
						});
					};
				}();
				/*\
     * Raphael.ninja
     [ method ]
     **
     * If you want to leave no trace of Raphaël (Well, Raphaël creates only one global variable `Raphael`, but anyway.) You can use `ninja` method.
     * Beware, that in this case plugins could stop working, because they are depending on global variable existence.
     **
     = (object) Raphael object
     > Usage
     | (function (local_raphael) {
     |     var paper = local_raphael(10, 10, 320, 200);
     |     …
     | })(Raphael.ninja());
    \*/
				R.ninja = function () {
					if (oldRaphael.was) {
						g.win.Raphael = oldRaphael.is;
					} else {
						// IE8 raises an error when deleting window property
						window.Raphael = undefined;
						try {
							delete window.Raphael;
						} catch (e) {}
					}
					return R;
				};
				/*\
     * Raphael.st
     [ property (object) ]
     **
     * You can add your own method to elements and sets. It is wise to add a set method for each element method
     * you added, so you will be able to call the same method on sets too.
     **
     * See also @Raphael.el.
     > Usage
     | Raphael.el.red = function () {
     |     this.attr({fill: "#f00"});
     | };
     | Raphael.st.red = function () {
     |     this.forEach(function (el) {
     |         el.red();
     |     });
     | };
     | // then use it
     | paper.set(paper.circle(100, 100, 20), paper.circle(110, 100, 20)).red();
    \*/
				R.st = setproto;

				eve.on("raphael.DOMload", function () {
					loaded = true;
				});

				// Firefox <3.6 fix: http://webreflection.blogspot.com/2009/11/195-chars-to-help-lazy-loading.html
				(function (doc, loaded, _f2) {
					if (doc.readyState == null && doc.addEventListener) {
						doc.addEventListener(loaded, _f2 = function f() {
							doc.removeEventListener(loaded, _f2, false);
							doc.readyState = "complete";
						}, false);
						doc.readyState = "loading";
					}
					function isLoaded() {
						/in/.test(doc.readyState) ? setTimeout(isLoaded, 9) : R.eve("raphael.DOMload");
					}
					isLoaded();
				})(document, "DOMContentLoaded");

				return R;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

			/***/
		},
		/* 2 */
		/***/function (module, exports, __webpack_require__) {

			var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__; // Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
			// 
			// Licensed under the Apache License, Version 2.0 (the "License");
			// you may not use this file except in compliance with the License.
			// You may obtain a copy of the License at
			// 
			// http://www.apache.org/licenses/LICENSE-2.0
			// 
			// Unless required by applicable law or agreed to in writing, software
			// distributed under the License is distributed on an "AS IS" BASIS,
			// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
			// See the License for the specific language governing permissions and
			// limitations under the License.
			// ┌────────────────────────────────────────────────────────────┐ \\
			// │ Eve 0.5.0 - JavaScript Events Library                      │ \\
			// ├────────────────────────────────────────────────────────────┤ \\
			// │ Author Dmitry Baranovskiy (http://dmitry.baranovskiy.com/) │ \\
			// └────────────────────────────────────────────────────────────┘ \\

			(function (glob) {
				var version = "0.5.0",
				    has = "hasOwnProperty",
				    separator = /[\.\/]/,
				    comaseparator = /\s*,\s*/,
				    wildcard = "*",
				    fun = function fun() {},
				    numsort = function numsort(a, b) {
					return a - b;
				},
				    current_event,
				    stop,
				    events = { n: {} },
				    firstDefined = function firstDefined() {
					for (var i = 0, ii = this.length; i < ii; i++) {
						if (typeof this[i] != "undefined") {
							return this[i];
						}
					}
				},
				    lastDefined = function lastDefined() {
					var i = this.length;
					while (--i) {
						if (typeof this[i] != "undefined") {
							return this[i];
						}
					}
				},
				    objtos = Object.prototype.toString,
				    Str = String,
				    isArray = Array.isArray || function (ar) {
					return ar instanceof Array || objtos.call(ar) == "[object Array]";
				};
				/*\
     * eve
     [ method ]
      * Fires event with given `name`, given scope and other parameters.
      > Arguments
      - name (string) name of the *event*, dot (`.`) or slash (`/`) separated
     - scope (object) context for the event handlers
     - varargs (...) the rest of arguments will be sent to event handlers
      = (object) array of returned values from the listeners. Array has two methods `.firstDefined()` and `.lastDefined()` to get first or last not `undefined` value.
    \*/
				var eve = function eve(name, scope) {
					var e = events,
					    oldstop = stop,
					    args = Array.prototype.slice.call(arguments, 2),
					    listeners = eve.listeners(name),
					    z = 0,
					    f = false,
					    l,
					    indexed = [],
					    queue = {},
					    out = [],
					    ce = current_event,
					    errors = [];
					out.firstDefined = firstDefined;
					out.lastDefined = lastDefined;
					current_event = name;
					stop = 0;
					for (var i = 0, ii = listeners.length; i < ii; i++) {
						if ("zIndex" in listeners[i]) {
							indexed.push(listeners[i].zIndex);
							if (listeners[i].zIndex < 0) {
								queue[listeners[i].zIndex] = listeners[i];
							}
						}
					}indexed.sort(numsort);
					while (indexed[z] < 0) {
						l = queue[indexed[z++]];
						out.push(l.apply(scope, args));
						if (stop) {
							stop = oldstop;
							return out;
						}
					}
					for (i = 0; i < ii; i++) {
						l = listeners[i];
						if ("zIndex" in l) {
							if (l.zIndex == indexed[z]) {
								out.push(l.apply(scope, args));
								if (stop) {
									break;
								}
								do {
									z++;
									l = queue[indexed[z]];
									l && out.push(l.apply(scope, args));
									if (stop) {
										break;
									}
								} while (l);
							} else {
								queue[l.zIndex] = l;
							}
						} else {
							out.push(l.apply(scope, args));
							if (stop) {
								break;
							}
						}
					}
					stop = oldstop;
					current_event = ce;
					return out;
				};
				// Undocumented. Debug only.
				eve._events = events;
				/*\
     * eve.listeners
     [ method ]
      * Internal method which gives you array of all event handlers that will be triggered by the given `name`.
      > Arguments
      - name (string) name of the event, dot (`.`) or slash (`/`) separated
      = (array) array of event handlers
    \*/
				eve.listeners = function (name) {
					var names = isArray(name) ? name : name.split(separator),
					    e = events,
					    item,
					    items,
					    k,
					    i,
					    ii,
					    j,
					    jj,
					    nes,
					    es = [e],
					    out = [];
					for (i = 0, ii = names.length; i < ii; i++) {
						nes = [];
						for (j = 0, jj = es.length; j < jj; j++) {
							e = es[j].n;
							items = [e[names[i]], e[wildcard]];
							k = 2;
							while (k--) {
								item = items[k];
								if (item) {
									nes.push(item);
									out = out.concat(item.f || []);
								}
							}
						}
						es = nes;
					}
					return out;
				};
				/*\
     * eve.separator
     [ method ]
      * If for some reasons you don’t like default separators (`.` or `/`) you can specify yours
     * here. Be aware that if you pass a string longer than one character it will be treated as
     * a list of characters.
      - separator (string) new separator. Empty string resets to default: `.` or `/`.
    \*/
				eve.separator = function (sep) {
					if (sep) {
						sep = Str(sep).replace(/(?=[\.\^\]\[\-])/g, "\\");
						sep = "[" + sep + "]";
						separator = new RegExp(sep);
					} else {
						separator = /[\.\/]/;
					}
				};
				/*\
     * eve.on
     [ method ]
     **
     * Binds given event handler with a given name. You can use wildcards “`*`” for the names:
     | eve.on("*.under.*", f);
     | eve("mouse.under.floor"); // triggers f
     * Use @eve to trigger the listener.
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
     **
     - name (array) if you don’t want to use separators, you can use array of strings
     - f (function) event handler function
     **
     = (function) returned function accepts a single numeric parameter that represents z-index of the handler. It is an optional feature and only used when you need to ensure that some subset of handlers will be invoked in a given order, despite of the order of assignment. 
     > Example:
     | eve.on("mouse", eatIt)(2);
     | eve.on("mouse", scream);
     | eve.on("mouse", catchIt)(1);
     * This will ensure that `catchIt` function will be called before `eatIt`.
     *
     * If you want to put your handler before non-indexed handlers, specify a negative value.
     * Note: I assume most of the time you don’t need to worry about z-index, but it’s nice to have this feature “just in case”.
    \*/
				eve.on = function (name, f) {
					if (typeof f != "function") {
						return function () {};
					}
					var names = isArray(name) ? isArray(name[0]) ? name : [name] : Str(name).split(comaseparator);
					for (var i = 0, ii = names.length; i < ii; i++) {
						(function (name) {
							var names = isArray(name) ? name : Str(name).split(separator),
							    e = events,
							    exist;
							for (var i = 0, ii = names.length; i < ii; i++) {
								e = e.n;
								e = e.hasOwnProperty(names[i]) && e[names[i]] || (e[names[i]] = { n: {} });
							}
							e.f = e.f || [];
							for (i = 0, ii = e.f.length; i < ii; i++) {
								if (e.f[i] == f) {
									exist = true;
									break;
								}
							}!exist && e.f.push(f);
						})(names[i]);
					}
					return function (zIndex) {
						if (+zIndex == +zIndex) {
							f.zIndex = +zIndex;
						}
					};
				};
				/*\
     * eve.f
     [ method ]
     **
     * Returns function that will fire given event with optional arguments.
     * Arguments that will be passed to the result function will be also
     * concated to the list of final arguments.
     | el.onclick = eve.f("click", 1, 2);
     | eve.on("click", function (a, b, c) {
     |     console.log(a, b, c); // 1, 2, [event object]
     | });
     > Arguments
     - event (string) event name
     - varargs (…) and any other arguments
     = (function) possible event handler function
    \*/
				eve.f = function (event) {
					var attrs = [].slice.call(arguments, 1);
					return function () {
						eve.apply(null, [event, null].concat(attrs).concat([].slice.call(arguments, 0)));
					};
				};
				/*\
     * eve.stop
     [ method ]
     **
     * Is used inside an event handler to stop the event, preventing any subsequent listeners from firing.
    \*/
				eve.stop = function () {
					stop = 1;
				};
				/*\
     * eve.nt
     [ method ]
     **
     * Could be used inside event handler to figure out actual name of the event.
     **
     > Arguments
     **
     - subname (string) #optional subname of the event
     **
     = (string) name of the event, if `subname` is not specified
     * or
     = (boolean) `true`, if current event’s name contains `subname`
    \*/
				eve.nt = function (subname) {
					var cur = isArray(current_event) ? current_event.join(".") : current_event;
					if (subname) {
						return new RegExp("(?:\\.|\\/|^)" + subname + "(?:\\.|\\/|$)").test(cur);
					}
					return cur;
				};
				/*\
     * eve.nts
     [ method ]
     **
     * Could be used inside event handler to figure out actual name of the event.
     **
     **
     = (array) names of the event
    \*/
				eve.nts = function () {
					return isArray(current_event) ? current_event : current_event.split(separator);
				};
				/*\
     * eve.off
     [ method ]
     **
     * Removes given function from the list of event listeners assigned to given name.
     * If no arguments specified all the events will be cleared.
     **
     > Arguments
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
    \*/
				/*\
     * eve.unbind
     [ method ]
     **
     * See @eve.off
    \*/
				eve.off = eve.unbind = function (name, f) {
					if (!name) {
						eve._events = events = { n: {} };
						return;
					}
					var names = isArray(name) ? isArray(name[0]) ? name : [name] : Str(name).split(comaseparator);
					if (names.length > 1) {
						for (var i = 0, ii = names.length; i < ii; i++) {
							eve.off(names[i], f);
						}
						return;
					}
					names = isArray(name) ? name : Str(name).split(separator);
					var e,
					    key,
					    splice,
					    i,
					    ii,
					    j,
					    jj,
					    cur = [events];
					for (i = 0, ii = names.length; i < ii; i++) {
						for (j = 0; j < cur.length; j += splice.length - 2) {
							splice = [j, 1];
							e = cur[j].n;
							if (names[i] != wildcard) {
								if (e[names[i]]) {
									splice.push(e[names[i]]);
								}
							} else {
								for (key in e) {
									if (e[has](key)) {
										splice.push(e[key]);
									}
								}
							}
							cur.splice.apply(cur, splice);
						}
					}
					for (i = 0, ii = cur.length; i < ii; i++) {
						e = cur[i];
						while (e.n) {
							if (f) {
								if (e.f) {
									for (j = 0, jj = e.f.length; j < jj; j++) {
										if (e.f[j] == f) {
											e.f.splice(j, 1);
											break;
										}
									}!e.f.length && delete e.f;
								}
								for (key in e.n) {
									if (e.n[has](key) && e.n[key].f) {
										var funcs = e.n[key].f;
										for (j = 0, jj = funcs.length; j < jj; j++) {
											if (funcs[j] == f) {
												funcs.splice(j, 1);
												break;
											}
										}!funcs.length && delete e.n[key].f;
									}
								}
							} else {
								delete e.f;
								for (key in e.n) {
									if (e.n[has](key) && e.n[key].f) {
										delete e.n[key].f;
									}
								}
							}
							e = e.n;
						}
					}
				};
				/*\
     * eve.once
     [ method ]
     **
     * Binds given event handler with a given name to only run once then unbind itself.
     | eve.once("login", f);
     | eve("login"); // triggers f
     | eve("login"); // no listeners
     * Use @eve to trigger the listener.
     **
     > Arguments
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
     **
     = (function) same return function as @eve.on
    \*/
				eve.once = function (name, f) {
					var f2 = function f2() {
						eve.off(name, f2);
						return f.apply(this, arguments);
					};
					return eve.on(name, f2);
				};
				/*\
     * eve.version
     [ property (string) ]
     **
     * Current version of the library.
    \*/
				eve.version = version;
				eve.toString = function () {
					return "You are running Eve " + version;
				};
				typeof module != "undefined" && module.exports ? module.exports = eve : true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
					return eve;
				}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : glob.eve = eve;
			})(this);

			/***/
		},
		/* 3 */
		/***/function (module, exports, __webpack_require__) {

			var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (R) {
				if (R && !R.svg) {
					return;
				}

				var has = "hasOwnProperty",
				    Str = String,
				    toFloat = parseFloat,
				    toInt = parseInt,
				    math = Math,
				    mmax = math.max,
				    abs = math.abs,
				    pow = math.pow,
				    separator = /[, ]+/,
				    eve = R.eve,
				    E = "",
				    S = " ";
				var xlink = "http://www.w3.org/1999/xlink",
				    markers = {
					block: "M5,0 0,2.5 5,5z",
					classic: "M5,0 0,2.5 5,5 3.5,3 3.5,2z",
					diamond: "M2.5,0 5,2.5 2.5,5 0,2.5z",
					open: "M6,1 1,3.5 6,6",
					oval: "M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"
				},
				    markerCounter = {};
				R.toString = function () {
					return "Your browser supports SVG.\nYou are running Rapha\xebl " + this.version;
				};
				var $ = function $(el, attr) {
					if (attr) {
						if (typeof el == "string") {
							el = $(el);
						}
						for (var key in attr) {
							if (attr[has](key)) {
								if (key.substring(0, 6) == "xlink:") {
									el.setAttributeNS(xlink, key.substring(6), Str(attr[key]));
								} else {
									el.setAttribute(key, Str(attr[key]));
								}
							}
						}
					} else {
						el = R._g.doc.createElementNS("http://www.w3.org/2000/svg", el);
						el.style && (el.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
					}
					return el;
				},
				    addGradientFill = function addGradientFill(element, gradient) {
					var type = "linear",
					    id = element.id + gradient,
					    fx = .5,
					    fy = .5,
					    o = element.node,
					    SVG = element.paper,
					    s = o.style,
					    el = R._g.doc.getElementById(id);
					if (!el) {
						gradient = Str(gradient).replace(R._radial_gradient, function (all, _fx, _fy) {
							type = "radial";
							if (_fx && _fy) {
								fx = toFloat(_fx);
								fy = toFloat(_fy);
								var dir = (fy > .5) * 2 - 1;
								pow(fx - .5, 2) + pow(fy - .5, 2) > .25 && (fy = math.sqrt(.25 - pow(fx - .5, 2)) * dir + .5) && fy != .5 && (fy = fy.toFixed(5) - 1e-5 * dir);
							}
							return E;
						});
						gradient = gradient.split(/\s*\-\s*/);
						if (type == "linear") {
							var angle = gradient.shift();
							angle = -toFloat(angle);
							if (isNaN(angle)) {
								return null;
							}
							var vector = [0, 0, math.cos(R.rad(angle)), math.sin(R.rad(angle))],
							    max = 1 / (mmax(abs(vector[2]), abs(vector[3])) || 1);
							vector[2] *= max;
							vector[3] *= max;
							if (vector[2] < 0) {
								vector[0] = -vector[2];
								vector[2] = 0;
							}
							if (vector[3] < 0) {
								vector[1] = -vector[3];
								vector[3] = 0;
							}
						}
						var dots = R._parseDots(gradient);
						if (!dots) {
							return null;
						}
						id = id.replace(/[\(\)\s,\xb0#]/g, "_");

						if (element.gradient && id != element.gradient.id) {
							SVG.defs.removeChild(element.gradient);
							delete element.gradient;
						}

						if (!element.gradient) {
							el = $(type + "Gradient", { id: id });
							element.gradient = el;
							$(el, type == "radial" ? {
								fx: fx,
								fy: fy
							} : {
								x1: vector[0],
								y1: vector[1],
								x2: vector[2],
								y2: vector[3],
								gradientTransform: element.matrix.invert()
							});
							SVG.defs.appendChild(el);
							for (var i = 0, ii = dots.length; i < ii; i++) {
								el.appendChild($("stop", {
									offset: dots[i].offset ? dots[i].offset : i ? "100%" : "0%",
									"stop-color": dots[i].color || "#fff",
									"stop-opacity": isFinite(dots[i].opacity) ? dots[i].opacity : 1
								}));
							}
						}
					}
					$(o, {
						fill: fillurl(id),
						opacity: 1,
						"fill-opacity": 1
					});
					s.fill = E;
					s.opacity = 1;
					s.fillOpacity = 1;
					return 1;
				},
				    isIE9or10 = function isIE9or10() {
					var mode = document.documentMode;
					return mode && (mode === 9 || mode === 10);
				},
				    fillurl = function fillurl(id) {
					if (isIE9or10()) {
						return "url('#" + id + "')";
					}
					var location = document.location;
					var locationString = location.protocol + '//' + location.host + location.pathname + location.search;
					return "url('" + locationString + "#" + id + "')";
				},
				    updatePosition = function updatePosition(o) {
					var bbox = o.getBBox(1);
					$(o.pattern, { patternTransform: o.matrix.invert() + " translate(" + bbox.x + "," + bbox.y + ")" });
				},
				    addArrow = function addArrow(o, value, isEnd) {
					if (o.type == "path") {
						var values = Str(value).toLowerCase().split("-"),
						    p = o.paper,
						    se = isEnd ? "end" : "start",
						    node = o.node,
						    attrs = o.attrs,
						    stroke = attrs["stroke-width"],
						    i = values.length,
						    type = "classic",
						    from,
						    to,
						    dx,
						    refX,
						    attr,
						    w = 3,
						    h = 3,
						    t = 5;
						while (i--) {
							switch (values[i]) {
								case "block":
								case "classic":
								case "oval":
								case "diamond":
								case "open":
								case "none":
									type = values[i];
									break;
								case "wide":
									h = 5;break;
								case "narrow":
									h = 2;break;
								case "long":
									w = 5;break;
								case "short":
									w = 2;break;
							}
						}
						if (type == "open") {
							w += 2;
							h += 2;
							t += 2;
							dx = 1;
							refX = isEnd ? 4 : 1;
							attr = {
								fill: "none",
								stroke: attrs.stroke
							};
						} else {
							refX = dx = w / 2;
							attr = {
								fill: attrs.stroke,
								stroke: "none"
							};
						}
						if (o._.arrows) {
							if (isEnd) {
								o._.arrows.endPath && markerCounter[o._.arrows.endPath]--;
								o._.arrows.endMarker && markerCounter[o._.arrows.endMarker]--;
							} else {
								o._.arrows.startPath && markerCounter[o._.arrows.startPath]--;
								o._.arrows.startMarker && markerCounter[o._.arrows.startMarker]--;
							}
						} else {
							o._.arrows = {};
						}
						if (type != "none") {
							var pathId = "raphael-marker-" + type,
							    markerId = "raphael-marker-" + se + type + w + h + "-obj" + o.id;
							if (!R._g.doc.getElementById(pathId)) {
								p.defs.appendChild($($("path"), {
									"stroke-linecap": "round",
									d: markers[type],
									id: pathId
								}));
								markerCounter[pathId] = 1;
							} else {
								markerCounter[pathId]++;
							}
							var marker = R._g.doc.getElementById(markerId),
							    use;
							if (!marker) {
								marker = $($("marker"), {
									id: markerId,
									markerHeight: h,
									markerWidth: w,
									orient: "auto",
									refX: refX,
									refY: h / 2
								});
								use = $($("use"), {
									"xlink:href": "#" + pathId,
									transform: (isEnd ? "rotate(180 " + w / 2 + " " + h / 2 + ") " : E) + "scale(" + w / t + "," + h / t + ")",
									"stroke-width": (1 / ((w / t + h / t) / 2)).toFixed(4)
								});
								marker.appendChild(use);
								p.defs.appendChild(marker);
								markerCounter[markerId] = 1;
							} else {
								markerCounter[markerId]++;
								use = marker.getElementsByTagName("use")[0];
							}
							$(use, attr);
							var delta = dx * (type != "diamond" && type != "oval");
							if (isEnd) {
								from = o._.arrows.startdx * stroke || 0;
								to = R.getTotalLength(attrs.path) - delta * stroke;
							} else {
								from = delta * stroke;
								to = R.getTotalLength(attrs.path) - (o._.arrows.enddx * stroke || 0);
							}
							attr = {};
							attr["marker-" + se] = "url(#" + markerId + ")";
							if (to || from) {
								attr.d = R.getSubpath(attrs.path, from, to);
							}
							$(node, attr);
							o._.arrows[se + "Path"] = pathId;
							o._.arrows[se + "Marker"] = markerId;
							o._.arrows[se + "dx"] = delta;
							o._.arrows[se + "Type"] = type;
							o._.arrows[se + "String"] = value;
						} else {
							if (isEnd) {
								from = o._.arrows.startdx * stroke || 0;
								to = R.getTotalLength(attrs.path) - from;
							} else {
								from = 0;
								to = R.getTotalLength(attrs.path) - (o._.arrows.enddx * stroke || 0);
							}
							o._.arrows[se + "Path"] && $(node, { d: R.getSubpath(attrs.path, from, to) });
							delete o._.arrows[se + "Path"];
							delete o._.arrows[se + "Marker"];
							delete o._.arrows[se + "dx"];
							delete o._.arrows[se + "Type"];
							delete o._.arrows[se + "String"];
						}
						for (attr in markerCounter) {
							if (markerCounter[has](attr) && !markerCounter[attr]) {
								var item = R._g.doc.getElementById(attr);
								item && item.parentNode.removeChild(item);
							}
						}
					}
				},
				    dasharray = {
					"-": [3, 1],
					".": [1, 1],
					"-.": [3, 1, 1, 1],
					"-..": [3, 1, 1, 1, 1, 1],
					". ": [1, 3],
					"- ": [4, 3],
					"--": [8, 3],
					"- .": [4, 3, 1, 3],
					"--.": [8, 3, 1, 3],
					"--..": [8, 3, 1, 3, 1, 3]
				},
				    addDashes = function addDashes(o, value, params) {
					value = dasharray[Str(value).toLowerCase()];
					if (value) {
						var width = o.attrs["stroke-width"] || "1",
						    butt = { round: width, square: width, butt: 0 }[o.attrs["stroke-linecap"] || params["stroke-linecap"]] || 0,
						    dashes = [],
						    i = value.length;
						while (i--) {
							dashes[i] = value[i] * width + (i % 2 ? 1 : -1) * butt;
						}
						$(o.node, { "stroke-dasharray": dashes.join(",") });
					} else {
						$(o.node, { "stroke-dasharray": "none" });
					}
				},
				    setFillAndStroke = function setFillAndStroke(o, params) {
					var node = o.node,
					    attrs = o.attrs,
					    vis = node.style.visibility;
					node.style.visibility = "hidden";
					for (var att in params) {
						if (params[has](att)) {
							if (!R._availableAttrs[has](att)) {
								continue;
							}
							var value = params[att];
							attrs[att] = value;
							switch (att) {
								case "blur":
									o.blur(value);
									break;
								case "title":
									var title = node.getElementsByTagName("title");

									// Use the existing <title>.
									if (title.length && (title = title[0])) {
										title.firstChild.nodeValue = value;
									} else {
										title = $("title");
										var val = R._g.doc.createTextNode(value);
										title.appendChild(val);
										node.appendChild(title);
									}
									break;
								case "href":
								case "target":
									var pn = node.parentNode;
									if (pn.tagName.toLowerCase() != "a") {
										var hl = $("a");
										pn.insertBefore(hl, node);
										hl.appendChild(node);
										pn = hl;
									}
									if (att == "target") {
										pn.setAttributeNS(xlink, "show", value == "blank" ? "new" : value);
									} else {
										pn.setAttributeNS(xlink, att, value);
									}
									break;
								case "cursor":
									node.style.cursor = value;
									break;
								case "transform":
									o.transform(value);
									break;
								case "arrow-start":
									addArrow(o, value);
									break;
								case "arrow-end":
									addArrow(o, value, 1);
									break;
								case "clip-rect":
									var rect = Str(value).split(separator);
									if (rect.length == 4) {
										o.clip && o.clip.parentNode.parentNode.removeChild(o.clip.parentNode);
										var el = $("clipPath"),
										    rc = $("rect");
										el.id = R.createUUID();
										$(rc, {
											x: rect[0],
											y: rect[1],
											width: rect[2],
											height: rect[3]
										});
										el.appendChild(rc);
										o.paper.defs.appendChild(el);
										$(node, { "clip-path": "url(#" + el.id + ")" });
										o.clip = rc;
									}
									if (!value) {
										var path = node.getAttribute("clip-path");
										if (path) {
											var clip = R._g.doc.getElementById(path.replace(/(^url\(#|\)$)/g, E));
											clip && clip.parentNode.removeChild(clip);
											$(node, { "clip-path": E });
											delete o.clip;
										}
									}
									break;
								case "path":
									if (o.type == "path") {
										$(node, { d: value ? attrs.path = R._pathToAbsolute(value) : "M0,0" });
										o._.dirty = 1;
										if (o._.arrows) {
											"startString" in o._.arrows && addArrow(o, o._.arrows.startString);
											"endString" in o._.arrows && addArrow(o, o._.arrows.endString, 1);
										}
									}
									break;
								case "width":
									node.setAttribute(att, value);
									o._.dirty = 1;
									if (attrs.fx) {
										att = "x";
										value = attrs.x;
									} else {
										break;
									}
								case "x":
									if (attrs.fx) {
										value = -attrs.x - (attrs.width || 0);
									}
								case "rx":
									if (att == "rx" && o.type == "rect") {
										break;
									}
								case "cx":
									node.setAttribute(att, value);
									o.pattern && updatePosition(o);
									o._.dirty = 1;
									break;
								case "height":
									node.setAttribute(att, value);
									o._.dirty = 1;
									if (attrs.fy) {
										att = "y";
										value = attrs.y;
									} else {
										break;
									}
								case "y":
									if (attrs.fy) {
										value = -attrs.y - (attrs.height || 0);
									}
								case "ry":
									if (att == "ry" && o.type == "rect") {
										break;
									}
								case "cy":
									node.setAttribute(att, value);
									o.pattern && updatePosition(o);
									o._.dirty = 1;
									break;
								case "r":
									if (o.type == "rect") {
										$(node, { rx: value, ry: value });
									} else {
										node.setAttribute(att, value);
									}
									o._.dirty = 1;
									break;
								case "src":
									if (o.type == "image") {
										node.setAttributeNS(xlink, "href", value);
									}
									break;
								case "stroke-width":
									if (o._.sx != 1 || o._.sy != 1) {
										value /= mmax(abs(o._.sx), abs(o._.sy)) || 1;
									}
									node.setAttribute(att, value);
									if (attrs["stroke-dasharray"]) {
										addDashes(o, attrs["stroke-dasharray"], params);
									}
									if (o._.arrows) {
										"startString" in o._.arrows && addArrow(o, o._.arrows.startString);
										"endString" in o._.arrows && addArrow(o, o._.arrows.endString, 1);
									}
									break;
								case "stroke-dasharray":
									addDashes(o, value, params);
									break;
								case "fill":
									var isURL = Str(value).match(R._ISURL);
									if (isURL) {
										el = $("pattern");
										var ig = $("image");
										el.id = R.createUUID();
										$(el, { x: 0, y: 0, patternUnits: "userSpaceOnUse", height: 1, width: 1 });
										$(ig, { x: 0, y: 0, "xlink:href": isURL[1] });
										el.appendChild(ig);

										(function (el) {
											R._preload(isURL[1], function () {
												var w = this.offsetWidth,
												    h = this.offsetHeight;
												$(el, { width: w, height: h });
												$(ig, { width: w, height: h });
											});
										})(el);
										o.paper.defs.appendChild(el);
										$(node, { fill: "url(#" + el.id + ")" });
										o.pattern = el;
										o.pattern && updatePosition(o);
										break;
									}
									var clr = R.getRGB(value);
									if (!clr.error) {
										delete params.gradient;
										delete attrs.gradient;
										!R.is(attrs.opacity, "undefined") && R.is(params.opacity, "undefined") && $(node, { opacity: attrs.opacity });
										!R.is(attrs["fill-opacity"], "undefined") && R.is(params["fill-opacity"], "undefined") && $(node, { "fill-opacity": attrs["fill-opacity"] });
									} else if ((o.type == "circle" || o.type == "ellipse" || Str(value).charAt() != "r") && addGradientFill(o, value)) {
										if ("opacity" in attrs || "fill-opacity" in attrs) {
											var gradient = R._g.doc.getElementById(node.getAttribute("fill").replace(/^url\(#|\)$/g, E));
											if (gradient) {
												var stops = gradient.getElementsByTagName("stop");
												$(stops[stops.length - 1], { "stop-opacity": ("opacity" in attrs ? attrs.opacity : 1) * ("fill-opacity" in attrs ? attrs["fill-opacity"] : 1) });
											}
										}
										attrs.gradient = value;
										attrs.fill = "none";
										break;
									}
									clr[has]("opacity") && $(node, { "fill-opacity": clr.opacity > 1 ? clr.opacity / 100 : clr.opacity });
								case "stroke":
									clr = R.getRGB(value);
									node.setAttribute(att, clr.hex);
									att == "stroke" && clr[has]("opacity") && $(node, { "stroke-opacity": clr.opacity > 1 ? clr.opacity / 100 : clr.opacity });
									if (att == "stroke" && o._.arrows) {
										"startString" in o._.arrows && addArrow(o, o._.arrows.startString);
										"endString" in o._.arrows && addArrow(o, o._.arrows.endString, 1);
									}
									break;
								case "gradient":
									(o.type == "circle" || o.type == "ellipse" || Str(value).charAt() != "r") && addGradientFill(o, value);
									break;
								case "opacity":
									if (attrs.gradient && !attrs[has]("stroke-opacity")) {
										$(node, { "stroke-opacity": value > 1 ? value / 100 : value });
									}
								// fall
								case "fill-opacity":
									if (attrs.gradient) {
										gradient = R._g.doc.getElementById(node.getAttribute("fill").replace(/^url\(#|\)$/g, E));
										if (gradient) {
											stops = gradient.getElementsByTagName("stop");
											$(stops[stops.length - 1], { "stop-opacity": value });
										}
										break;
									}
								default:
									att == "font-size" && (value = toInt(value, 10) + "px");
									var cssrule = att.replace(/(\-.)/g, function (w) {
										return w.substring(1).toUpperCase();
									});
									node.style[cssrule] = value;
									o._.dirty = 1;
									node.setAttribute(att, value);
									break;
							}
						}
					}

					tuneText(o, params);
					node.style.visibility = vis;
				},
				    leading = 1.2,
				    tuneText = function tuneText(el, params) {
					if (el.type != "text" || !(params[has]("text") || params[has]("font") || params[has]("font-size") || params[has]("x") || params[has]("y"))) {
						return;
					}
					var a = el.attrs,
					    node = el.node,
					    fontSize = node.firstChild ? toInt(R._g.doc.defaultView.getComputedStyle(node.firstChild, E).getPropertyValue("font-size"), 10) : 10;

					if (params[has]("text")) {
						a.text = params.text;
						while (node.firstChild) {
							node.removeChild(node.firstChild);
						}
						var texts = Str(params.text).split("\n"),
						    tspans = [],
						    tspan;
						for (var i = 0, ii = texts.length; i < ii; i++) {
							tspan = $("tspan");
							i && $(tspan, { dy: fontSize * leading, x: a.x });
							tspan.appendChild(R._g.doc.createTextNode(texts[i]));
							node.appendChild(tspan);
							tspans[i] = tspan;
						}
					} else {
						tspans = node.getElementsByTagName("tspan");
						for (i = 0, ii = tspans.length; i < ii; i++) {
							if (i) {
								$(tspans[i], { dy: fontSize * leading, x: a.x });
							} else {
								$(tspans[0], { dy: 0 });
							}
						}
					}
					$(node, { x: a.x, y: a.y });
					el._.dirty = 1;
					var bb = el._getBBox(),
					    dif = a.y - (bb.y + bb.height / 2);
					dif && R.is(dif, "finite") && $(tspans[0], { dy: dif });
				},
				    getRealNode = function getRealNode(node) {
					if (node.parentNode && node.parentNode.tagName.toLowerCase() === "a") {
						return node.parentNode;
					} else {
						return node;
					}
				},
				    Element = function Element(node, svg) {
					var X = 0,
					    Y = 0;
					/*\
      * Element.node
      [ property (object) ]
      **
      * Gives you a reference to the DOM object, so you can assign event handlers or just mess around.
      **
      * Note: Don’t mess with it.
      > Usage
      | // draw a circle at coordinate 10,10 with radius of 10
      | var c = paper.circle(10, 10, 10);
      | c.node.onclick = function () {
      |     c.attr("fill", "red");
      | };
     \*/
					this[0] = this.node = node;
					/*\
      * Element.raphael
      [ property (object) ]
      **
      * Internal reference to @Raphael object. In case it is not available.
      > Usage
      | Raphael.el.red = function () {
      |     var hsb = this.paper.raphael.rgb2hsb(this.attr("fill"));
      |     hsb.h = 1;
      |     this.attr({fill: this.paper.raphael.hsb2rgb(hsb).hex});
      | }
     \*/
					node.raphael = true;
					/*\
      * Element.id
      [ property (number) ]
      **
      * Unique id of the element. Especially useful when you want to listen to events of the element,
      * because all events are fired in format `<module>.<action>.<id>`. Also useful for @Paper.getById method.
     \*/
					this.id = guid();
					node.raphaelid = this.id;

					/**
     * Method that returns a 5 letter/digit id, enough for 36^5 = 60466176 elements
     * @returns {string} id
     */
					function guid() {
						return ("0000" + (Math.random() * Math.pow(36, 5) << 0).toString(36)).slice(-5);
					}

					this.matrix = R.matrix();
					this.realPath = null;
					/*\
      * Element.paper
      [ property (object) ]
      **
      * Internal reference to “paper” where object drawn. Mainly for use in plugins and element extensions.
      > Usage
      | Raphael.el.cross = function () {
      |     this.attr({fill: "red"});
      |     this.paper.path("M10,10L50,50M50,10L10,50")
      |         .attr({stroke: "red"});
      | }
     \*/
					this.paper = svg;
					this.attrs = this.attrs || {};
					this._ = {
						transform: [],
						sx: 1,
						sy: 1,
						deg: 0,
						dx: 0,
						dy: 0,
						dirty: 1
					};
					!svg.bottom && (svg.bottom = this);
					/*\
      * Element.prev
      [ property (object) ]
      **
      * Reference to the previous element in the hierarchy.
     \*/
					this.prev = svg.top;
					svg.top && (svg.top.next = this);
					svg.top = this;
					/*\
      * Element.next
      [ property (object) ]
      **
      * Reference to the next element in the hierarchy.
     \*/
					this.next = null;
				},
				    elproto = R.el;

				Element.prototype = elproto;
				elproto.constructor = Element;

				R._engine.path = function (pathString, SVG) {
					var el = $("path");
					SVG.canvas && SVG.canvas.appendChild(el);
					var p = new Element(el, SVG);
					p.type = "path";
					setFillAndStroke(p, {
						fill: "none",
						stroke: "#000",
						path: pathString
					});
					return p;
				};
				/*\
     * Element.rotate
     [ method ]
     **
     * Deprecated! Use @Element.transform instead.
     * Adds rotation by given angle around given point to the list of
     * transformations of the element.
     > Parameters
     - deg (number) angle in degrees
     - cx (number) #optional x coordinate of the centre of rotation
     - cy (number) #optional y coordinate of the centre of rotation
     * If cx & cy aren’t specified centre of the shape is used as a point of rotation.
     = (object) @Element
    \*/
				elproto.rotate = function (deg, cx, cy) {
					if (this.removed) {
						return this;
					}
					deg = Str(deg).split(separator);
					if (deg.length - 1) {
						cx = toFloat(deg[1]);
						cy = toFloat(deg[2]);
					}
					deg = toFloat(deg[0]);
					cy == null && (cx = cy);
					if (cx == null || cy == null) {
						var bbox = this.getBBox(1);
						cx = bbox.x + bbox.width / 2;
						cy = bbox.y + bbox.height / 2;
					}
					this.transform(this._.transform.concat([["r", deg, cx, cy]]));
					return this;
				};
				/*\
     * Element.scale
     [ method ]
     **
     * Deprecated! Use @Element.transform instead.
     * Adds scale by given amount relative to given point to the list of
     * transformations of the element.
     > Parameters
     - sx (number) horisontal scale amount
     - sy (number) vertical scale amount
     - cx (number) #optional x coordinate of the centre of scale
     - cy (number) #optional y coordinate of the centre of scale
     * If cx & cy aren’t specified centre of the shape is used instead.
     = (object) @Element
    \*/
				elproto.scale = function (sx, sy, cx, cy) {
					if (this.removed) {
						return this;
					}
					sx = Str(sx).split(separator);
					if (sx.length - 1) {
						sy = toFloat(sx[1]);
						cx = toFloat(sx[2]);
						cy = toFloat(sx[3]);
					}
					sx = toFloat(sx[0]);
					sy == null && (sy = sx);
					cy == null && (cx = cy);
					if (cx == null || cy == null) {
						var bbox = this.getBBox(1);
					}
					cx = cx == null ? bbox.x + bbox.width / 2 : cx;
					cy = cy == null ? bbox.y + bbox.height / 2 : cy;
					this.transform(this._.transform.concat([["s", sx, sy, cx, cy]]));
					return this;
				};
				/*\
     * Element.translate
     [ method ]
     **
     * Deprecated! Use @Element.transform instead.
     * Adds translation by given amount to the list of transformations of the element.
     > Parameters
     - dx (number) horisontal shift
     - dy (number) vertical shift
     = (object) @Element
    \*/
				elproto.translate = function (dx, dy) {
					if (this.removed) {
						return this;
					}
					dx = Str(dx).split(separator);
					if (dx.length - 1) {
						dy = toFloat(dx[1]);
					}
					dx = toFloat(dx[0]) || 0;
					dy = +dy || 0;
					this.transform(this._.transform.concat([["t", dx, dy]]));
					return this;
				};
				/*\
     * Element.transform
     [ method ]
     **
     * Adds transformation to the element which is separate to other attributes,
     * i.e. translation doesn’t change `x` or `y` of the rectange. The format
     * of transformation string is similar to the path string syntax:
     | "t100,100r30,100,100s2,2,100,100r45s1.5"
     * Each letter is a command. There are four commands: `t` is for translate, `r` is for rotate, `s` is for
     * scale and `m` is for matrix.
     *
     * There are also alternative “absolute” translation, rotation and scale: `T`, `R` and `S`. They will not take previous transformation into account. For example, `...T100,0` will always move element 100 px horisontally, while `...t100,0` could move it vertically if there is `r90` before. Just compare results of `r90t100,0` and `r90T100,0`.
     *
     * So, the example line above could be read like “translate by 100, 100; rotate 30° around 100, 100; scale twice around 100, 100;
     * rotate 45° around centre; scale 1.5 times relative to centre”. As you can see rotate and scale commands have origin
     * coordinates as optional parameters, the default is the centre point of the element.
     * Matrix accepts six parameters.
     > Usage
     | var el = paper.rect(10, 20, 300, 200);
     | // translate 100, 100, rotate 45°, translate -100, 0
     | el.transform("t100,100r45t-100,0");
     | // if you want you can append or prepend transformations
     | el.transform("...t50,50");
     | el.transform("s2...");
     | // or even wrap
     | el.transform("t50,50...t-50-50");
     | // to reset transformation call method with empty string
     | el.transform("");
     | // to get current value call it without parameters
     | console.log(el.transform());
     > Parameters
     - tstr (string) #optional transformation string
     * If tstr isn’t specified
     = (string) current transformation string
     * else
     = (object) @Element
    \*/
				elproto.transform = function (tstr) {
					var _ = this._;
					if (tstr == null) {
						return _.transform;
					}
					R._extractTransform(this, tstr);

					this.clip && $(this.clip, { transform: this.matrix.invert() });
					this.pattern && updatePosition(this);
					this.node && $(this.node, { transform: this.matrix });

					if (_.sx != 1 || _.sy != 1) {
						var sw = this.attrs[has]("stroke-width") ? this.attrs["stroke-width"] : 1;
						this.attr({ "stroke-width": sw });
					}

					return this;
				};
				/*\
     * Element.hide
     [ method ]
     **
     * Makes element invisible. See @Element.show.
     = (object) @Element
    \*/
				elproto.hide = function () {
					if (!this.removed) this.node.style.display = "none";
					return this;
				};
				/*\
     * Element.show
     [ method ]
     **
     * Makes element visible. See @Element.hide.
     = (object) @Element
    \*/
				elproto.show = function () {
					if (!this.removed) this.node.style.display = "";
					return this;
				};
				/*\
     * Element.remove
     [ method ]
     **
     * Removes element from the paper.
    \*/
				elproto.remove = function () {
					var node = getRealNode(this.node);
					if (this.removed || !node.parentNode) {
						return;
					}
					var paper = this.paper;
					paper.__set__ && paper.__set__.exclude(this);
					eve.unbind("raphael.*.*." + this.id);
					if (this.gradient) {
						paper.defs.removeChild(this.gradient);
					}
					R._tear(this, paper);

					node.parentNode.removeChild(node);

					// Remove custom data for element
					this.removeData();

					for (var i in this) {
						this[i] = typeof this[i] == "function" ? R._removedFactory(i) : null;
					}
					this.removed = true;
				};
				elproto._getBBox = function () {
					if (this.node.style.display == "none") {
						this.show();
						var hide = true;
					}
					var canvasHidden = false,
					    containerStyle;
					if (this.paper.canvas.parentElement) {
						containerStyle = this.paper.canvas.parentElement.style;
					} //IE10+ can't find parentElement
					else if (this.paper.canvas.parentNode) {
							containerStyle = this.paper.canvas.parentNode.style;
						}

					if (containerStyle && containerStyle.display == "none") {
						canvasHidden = true;
						containerStyle.display = "";
					}
					var bbox = {};
					try {
						bbox = this.node.getBBox();
					} catch (e) {
						// Firefox 3.0.x, 25.0.1 (probably more versions affected) play badly here - possible fix
						bbox = {
							x: this.node.clientLeft,
							y: this.node.clientTop,
							width: this.node.clientWidth,
							height: this.node.clientHeight
						};
					} finally {
						bbox = bbox || {};
						if (canvasHidden) {
							containerStyle.display = "none";
						}
					}
					hide && this.hide();
					return bbox;
				};
				/*\
     * Element.attr
     [ method ]
     **
     * Sets the attributes of the element.
     > Parameters
     - attrName (string) attribute’s name
     - value (string) value
     * or
     - params (object) object of name/value pairs
     * or
     - attrName (string) attribute’s name
     * or
     - attrNames (array) in this case method returns array of current values for given attribute names
     = (object) @Element if attrsName & value or params are passed in.
     = (...) value of the attribute if only attrsName is passed in.
     = (array) array of values of the attribute if attrsNames is passed in.
     = (object) object of attributes if nothing is passed in.
     > Possible parameters
     # <p>Please refer to the <a href="http://www.w3.org/TR/SVG/" title="The W3C Recommendation for the SVG language describes these properties in detail.">SVG specification</a> for an explanation of these parameters.</p>
     o arrow-end (string) arrowhead on the end of the path. The format for string is `<type>[-<width>[-<length>]]`. Possible types: `classic`, `block`, `open`, `oval`, `diamond`, `none`, width: `wide`, `narrow`, `medium`, length: `long`, `short`, `midium`.
     o clip-rect (string) comma or space separated values: x, y, width and height
     o cursor (string) CSS type of the cursor
     o cx (number) the x-axis coordinate of the center of the circle, or ellipse
     o cy (number) the y-axis coordinate of the center of the circle, or ellipse
     o fill (string) colour, gradient or image
     o fill-opacity (number)
     o font (string)
     o font-family (string)
     o font-size (number) font size in pixels
     o font-weight (string)
     o height (number)
     o href (string) URL, if specified element behaves as hyperlink
     o opacity (number)
     o path (string) SVG path string format
     o r (number) radius of the circle, ellipse or rounded corner on the rect
     o rx (number) horisontal radius of the ellipse
     o ry (number) vertical radius of the ellipse
     o src (string) image URL, only works for @Element.image element
     o stroke (string) stroke colour
     o stroke-dasharray (string) [“”, “none”, “`-`”, “`.`”, “`-.`”, “`-..`”, “`. `”, “`- `”, “`--`”, “`- .`”, “`--.`”, “`--..`”]
     o stroke-linecap (string) [“`butt`”, “`square`”, “`round`”]
     o stroke-linejoin (string) [“`bevel`”, “`round`”, “`miter`”]
     o stroke-miterlimit (number)
     o stroke-opacity (number)
     o stroke-width (number) stroke width in pixels, default is '1'
     o target (string) used with href
     o text (string) contents of the text element. Use `\n` for multiline text
     o text-anchor (string) [“`start`”, “`middle`”, “`end`”], default is “`middle`”
     o title (string) will create tooltip with a given text
     o transform (string) see @Element.transform
     o width (number)
     o x (number)
     o y (number)
     > Gradients
     * Linear gradient format: “`‹angle›-‹colour›[-‹colour›[:‹offset›]]*-‹colour›`”, example: “`90-#fff-#000`” – 90°
     * gradient from white to black or “`0-#fff-#f00:20-#000`” – 0° gradient from white via red (at 20%) to black.
     *
     * radial gradient: “`r[(‹fx›, ‹fy›)]‹colour›[-‹colour›[:‹offset›]]*-‹colour›`”, example: “`r#fff-#000`” –
     * gradient from white to black or “`r(0.25, 0.75)#fff-#000`” – gradient from white to black with focus point
     * at 0.25, 0.75. Focus point coordinates are in 0..1 range. Radial gradients can only be applied to circles and ellipses.
     > Path String
     # <p>Please refer to <a href="http://www.w3.org/TR/SVG/paths.html#PathData" title="Details of a path’s data attribute’s format are described in the SVG specification.">SVG documentation regarding path string</a>. Raphaël fully supports it.</p>
     > Colour Parsing
     # <ul>
     #     <li>Colour name (“<code>red</code>”, “<code>green</code>”, “<code>cornflowerblue</code>”, etc)</li>
     #     <li>#••• — shortened HTML colour: (“<code>#000</code>”, “<code>#fc0</code>”, etc)</li>
     #     <li>#•••••• — full length HTML colour: (“<code>#000000</code>”, “<code>#bd2300</code>”)</li>
     #     <li>rgb(•••, •••, •••) — red, green and blue channels’ values: (“<code>rgb(200,&nbsp;100,&nbsp;0)</code>”)</li>
     #     <li>rgb(•••%, •••%, •••%) — same as above, but in %: (“<code>rgb(100%,&nbsp;175%,&nbsp;0%)</code>”)</li>
     #     <li>rgba(•••, •••, •••, •••) — red, green and blue channels’ values: (“<code>rgba(200,&nbsp;100,&nbsp;0, .5)</code>”)</li>
     #     <li>rgba(•••%, •••%, •••%, •••%) — same as above, but in %: (“<code>rgba(100%,&nbsp;175%,&nbsp;0%, 50%)</code>”)</li>
     #     <li>hsb(•••, •••, •••) — hue, saturation and brightness values: (“<code>hsb(0.5,&nbsp;0.25,&nbsp;1)</code>”)</li>
     #     <li>hsb(•••%, •••%, •••%) — same as above, but in %</li>
     #     <li>hsba(•••, •••, •••, •••) — same as above, but with opacity</li>
     #     <li>hsl(•••, •••, •••) — almost the same as hsb, see <a href="http://en.wikipedia.org/wiki/HSL_and_HSV" title="HSL and HSV - Wikipedia, the free encyclopedia">Wikipedia page</a></li>
     #     <li>hsl(•••%, •••%, •••%) — same as above, but in %</li>
     #     <li>hsla(•••, •••, •••, •••) — same as above, but with opacity</li>
     #     <li>Optionally for hsb and hsl you could specify hue as a degree: “<code>hsl(240deg,&nbsp;1,&nbsp;.5)</code>” or, if you want to go fancy, “<code>hsl(240°,&nbsp;1,&nbsp;.5)</code>”</li>
     # </ul>
    \*/
				elproto.attr = function (name, value) {
					if (this.removed) {
						return this;
					}
					if (name == null) {
						var res = {};
						for (var a in this.attrs) {
							if (this.attrs[has](a)) {
								res[a] = this.attrs[a];
							}
						}res.gradient && res.fill == "none" && (res.fill = res.gradient) && delete res.gradient;
						res.transform = this._.transform;
						return res;
					}
					if (value == null && R.is(name, "string")) {
						if (name == "fill" && this.attrs.fill == "none" && this.attrs.gradient) {
							return this.attrs.gradient;
						}
						if (name == "transform") {
							return this._.transform;
						}
						var names = name.split(separator),
						    out = {};
						for (var i = 0, ii = names.length; i < ii; i++) {
							name = names[i];
							if (name in this.attrs) {
								out[name] = this.attrs[name];
							} else if (R.is(this.paper.customAttributes[name], "function")) {
								out[name] = this.paper.customAttributes[name].def;
							} else {
								out[name] = R._availableAttrs[name];
							}
						}
						return ii - 1 ? out : out[names[0]];
					}
					if (value == null && R.is(name, "array")) {
						out = {};
						for (i = 0, ii = name.length; i < ii; i++) {
							out[name[i]] = this.attr(name[i]);
						}
						return out;
					}
					if (value != null) {
						var params = {};
						params[name] = value;
					} else if (name != null && R.is(name, "object")) {
						params = name;
					}
					for (var key in params) {
						eve("raphael.attr." + key + "." + this.id, this, params[key]);
					}
					for (key in this.paper.customAttributes) {
						if (this.paper.customAttributes[has](key) && params[has](key) && R.is(this.paper.customAttributes[key], "function")) {
							var par = this.paper.customAttributes[key].apply(this, [].concat(params[key]));
							this.attrs[key] = params[key];
							for (var subkey in par) {
								if (par[has](subkey)) {
									params[subkey] = par[subkey];
								}
							}
						}
					}setFillAndStroke(this, params);
					return this;
				};
				/*\
     * Element.toFront
     [ method ]
     **
     * Moves the element so it is the closest to the viewer’s eyes, on top of other elements.
     = (object) @Element
    \*/
				elproto.toFront = function () {
					if (this.removed) {
						return this;
					}
					var node = getRealNode(this.node);
					node.parentNode.appendChild(node);
					var svg = this.paper;
					svg.top != this && R._tofront(this, svg);
					return this;
				};
				/*\
     * Element.toBack
     [ method ]
     **
     * Moves the element so it is the furthest from the viewer’s eyes, behind other elements.
     = (object) @Element
    \*/
				elproto.toBack = function () {
					if (this.removed) {
						return this;
					}
					var node = getRealNode(this.node);
					var parentNode = node.parentNode;
					parentNode.insertBefore(node, parentNode.firstChild);
					R._toback(this, this.paper);
					var svg = this.paper;
					return this;
				};
				/*\
     * Element.insertAfter
     [ method ]
     **
     * Inserts current object after the given one.
     = (object) @Element
    \*/
				elproto.insertAfter = function (element) {
					if (this.removed || !element) {
						return this;
					}

					var node = getRealNode(this.node);
					var afterNode = getRealNode(element.node || element[element.length - 1].node);
					if (afterNode.nextSibling) {
						afterNode.parentNode.insertBefore(node, afterNode.nextSibling);
					} else {
						afterNode.parentNode.appendChild(node);
					}
					R._insertafter(this, element, this.paper);
					return this;
				};
				/*\
     * Element.insertBefore
     [ method ]
     **
     * Inserts current object before the given one.
     = (object) @Element
    \*/
				elproto.insertBefore = function (element) {
					if (this.removed || !element) {
						return this;
					}

					var node = getRealNode(this.node);
					var beforeNode = getRealNode(element.node || element[0].node);
					beforeNode.parentNode.insertBefore(node, beforeNode);
					R._insertbefore(this, element, this.paper);
					return this;
				};
				elproto.blur = function (size) {
					// Experimental. No Safari support. Use it on your own risk.
					var t = this;
					if (+size !== 0) {
						var fltr = $("filter"),
						    blur = $("feGaussianBlur");
						t.attrs.blur = size;
						fltr.id = R.createUUID();
						$(blur, { stdDeviation: +size || 1.5 });
						fltr.appendChild(blur);
						t.paper.defs.appendChild(fltr);
						t._blur = fltr;
						$(t.node, { filter: "url(#" + fltr.id + ")" });
					} else {
						if (t._blur) {
							t._blur.parentNode.removeChild(t._blur);
							delete t._blur;
							delete t.attrs.blur;
						}
						t.node.removeAttribute("filter");
					}
					return t;
				};
				R._engine.circle = function (svg, x, y, r) {
					var el = $("circle");
					svg.canvas && svg.canvas.appendChild(el);
					var res = new Element(el, svg);
					res.attrs = { cx: x, cy: y, r: r, fill: "none", stroke: "#000" };
					res.type = "circle";
					$(el, res.attrs);
					return res;
				};
				R._engine.rect = function (svg, x, y, w, h, r) {
					var el = $("rect");
					svg.canvas && svg.canvas.appendChild(el);
					var res = new Element(el, svg);
					res.attrs = { x: x, y: y, width: w, height: h, rx: r || 0, ry: r || 0, fill: "none", stroke: "#000" };
					res.type = "rect";
					$(el, res.attrs);
					return res;
				};
				R._engine.ellipse = function (svg, x, y, rx, ry) {
					var el = $("ellipse");
					svg.canvas && svg.canvas.appendChild(el);
					var res = new Element(el, svg);
					res.attrs = { cx: x, cy: y, rx: rx, ry: ry, fill: "none", stroke: "#000" };
					res.type = "ellipse";
					$(el, res.attrs);
					return res;
				};
				R._engine.image = function (svg, src, x, y, w, h) {
					var el = $("image");
					$(el, { x: x, y: y, width: w, height: h, preserveAspectRatio: "none" });
					el.setAttributeNS(xlink, "href", src);
					svg.canvas && svg.canvas.appendChild(el);
					var res = new Element(el, svg);
					res.attrs = { x: x, y: y, width: w, height: h, src: src };
					res.type = "image";
					return res;
				};
				R._engine.text = function (svg, x, y, text) {
					var el = $("text");
					svg.canvas && svg.canvas.appendChild(el);
					var res = new Element(el, svg);
					res.attrs = {
						x: x,
						y: y,
						"text-anchor": "middle",
						text: text,
						"font-family": R._availableAttrs["font-family"],
						"font-size": R._availableAttrs["font-size"],
						stroke: "none",
						fill: "#000"
					};
					res.type = "text";
					setFillAndStroke(res, res.attrs);
					return res;
				};
				R._engine.setSize = function (width, height) {
					this.width = width || this.width;
					this.height = height || this.height;
					this.canvas.setAttribute("width", this.width);
					this.canvas.setAttribute("height", this.height);
					if (this._viewBox) {
						this.setViewBox.apply(this, this._viewBox);
					}
					return this;
				};
				R._engine.create = function () {
					var con = R._getContainer.apply(0, arguments),
					    container = con && con.container,
					    x = con.x,
					    y = con.y,
					    width = con.width,
					    height = con.height;
					if (!container) {
						throw new Error("SVG container not found.");
					}
					var cnvs = $("svg"),
					    css = "overflow:hidden;",
					    isFloating;
					x = x || 0;
					y = y || 0;
					width = width || 512;
					height = height || 342;
					$(cnvs, {
						height: height,
						version: 1.1,
						width: width,
						xmlns: "http://www.w3.org/2000/svg",
						"xmlns:xlink": "http://www.w3.org/1999/xlink"
					});
					if (container == 1) {
						cnvs.style.cssText = css + "position:absolute;left:" + x + "px;top:" + y + "px";
						R._g.doc.body.appendChild(cnvs);
						isFloating = 1;
					} else {
						cnvs.style.cssText = css + "position:relative";
						if (container.firstChild) {
							container.insertBefore(cnvs, container.firstChild);
						} else {
							container.appendChild(cnvs);
						}
					}
					container = new R._Paper();
					container.width = width;
					container.height = height;
					container.canvas = cnvs;
					container.clear();
					container._left = container._top = 0;
					isFloating && (container.renderfix = function () {});
					container.renderfix();
					return container;
				};
				R._engine.setViewBox = function (x, y, w, h, fit) {
					eve("raphael.setViewBox", this, this._viewBox, [x, y, w, h, fit]);
					var paperSize = this.getSize(),
					    size = mmax(w / paperSize.width, h / paperSize.height),
					    top = this.top,
					    aspectRatio = fit ? "xMidYMid meet" : "xMinYMin",
					    vb,
					    sw;
					if (x == null) {
						if (this._vbSize) {
							size = 1;
						}
						delete this._vbSize;
						vb = "0 0 " + this.width + S + this.height;
					} else {
						this._vbSize = size;
						vb = x + S + y + S + w + S + h;
					}
					$(this.canvas, {
						viewBox: vb,
						preserveAspectRatio: aspectRatio
					});
					while (size && top) {
						sw = "stroke-width" in top.attrs ? top.attrs["stroke-width"] : 1;
						top.attr({ "stroke-width": sw });
						top._.dirty = 1;
						top._.dirtyT = 1;
						top = top.prev;
					}
					this._viewBox = [x, y, w, h, !!fit];
					return this;
				};
				/*\
     * Paper.renderfix
     [ method ]
     **
     * Fixes the issue of Firefox and IE9 regarding subpixel rendering. If paper is dependent
     * on other elements after reflow it could shift half pixel which cause for lines to lost their crispness.
     * This method fixes the issue.
     **
       Special thanks to Mariusz Nowak (http://www.medikoo.com/) for this method.
    \*/
				R.prototype.renderfix = function () {
					var cnvs = this.canvas,
					    s = cnvs.style,
					    pos;
					try {
						pos = cnvs.getScreenCTM() || cnvs.createSVGMatrix();
					} catch (e) {
						pos = cnvs.createSVGMatrix();
					}
					var left = -pos.e % 1,
					    top = -pos.f % 1;
					if (left || top) {
						if (left) {
							this._left = (this._left + left) % 1;
							s.left = this._left + "px";
						}
						if (top) {
							this._top = (this._top + top) % 1;
							s.top = this._top + "px";
						}
					}
				};
				/*\
     * Paper.clear
     [ method ]
     **
     * Clears the paper, i.e. removes all the elements.
    \*/
				R.prototype.clear = function () {
					R.eve("raphael.clear", this);
					var c = this.canvas;
					while (c.firstChild) {
						c.removeChild(c.firstChild);
					}
					this.bottom = this.top = null;
					(this.desc = $("desc")).appendChild(R._g.doc.createTextNode("Created with Rapha\xebl " + R.version));
					c.appendChild(this.desc);
					c.appendChild(this.defs = $("defs"));
				};
				/*\
     * Paper.remove
     [ method ]
     **
     * Removes the paper from the DOM.
    \*/
				R.prototype.remove = function () {
					eve("raphael.remove", this);
					this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
					for (var i in this) {
						this[i] = typeof this[i] == "function" ? R._removedFactory(i) : null;
					}
				};
				var setproto = R.st;
				for (var method in elproto) {
					if (elproto[has](method) && !setproto[has](method)) {
						setproto[method] = function (methodname) {
							return function () {
								var arg = arguments;
								return this.forEach(function (el) {
									el[methodname].apply(el, arg);
								});
							};
						}(method);
					}
				}
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

			/***/
		},
		/* 4 */
		/***/function (module, exports, __webpack_require__) {

			var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (R) {
				if (R && !R.vml) {
					return;
				}

				var has = "hasOwnProperty",
				    Str = String,
				    toFloat = parseFloat,
				    math = Math,
				    round = math.round,
				    mmax = math.max,
				    mmin = math.min,
				    abs = math.abs,
				    fillString = "fill",
				    separator = /[, ]+/,
				    eve = R.eve,
				    ms = " progid:DXImageTransform.Microsoft",
				    S = " ",
				    E = "",
				    map = { M: "m", L: "l", C: "c", Z: "x", m: "t", l: "r", c: "v", z: "x" },
				    bites = /([clmz]),?([^clmz]*)/gi,
				    blurregexp = / progid:\S+Blur\([^\)]+\)/g,
				    val = /-?[^,\s-]+/g,
				    cssDot = "position:absolute;left:0;top:0;width:1px;height:1px;behavior:url(#default#VML)",
				    zoom = 21600,
				    pathTypes = { path: 1, rect: 1, image: 1 },
				    ovalTypes = { circle: 1, ellipse: 1 },
				    path2vml = function path2vml(path) {
					var total = /[ahqstv]/ig,
					    command = R._pathToAbsolute;
					Str(path).match(total) && (command = R._path2curve);
					total = /[clmz]/g;
					if (command == R._pathToAbsolute && !Str(path).match(total)) {
						var res = Str(path).replace(bites, function (all, command, args) {
							var vals = [],
							    isMove = command.toLowerCase() == "m",
							    res = map[command];
							args.replace(val, function (value) {
								if (isMove && vals.length == 2) {
									res += vals + map[command == "m" ? "l" : "L"];
									vals = [];
								}
								vals.push(round(value * zoom));
							});
							return res + vals;
						});
						return res;
					}
					var pa = command(path),
					    p,
					    r;
					res = [];
					for (var i = 0, ii = pa.length; i < ii; i++) {
						p = pa[i];
						r = pa[i][0].toLowerCase();
						r == "z" && (r = "x");
						for (var j = 1, jj = p.length; j < jj; j++) {
							r += round(p[j] * zoom) + (j != jj - 1 ? "," : E);
						}
						res.push(r);
					}
					return res.join(S);
				},
				    compensation = function compensation(deg, dx, dy) {
					var m = R.matrix();
					m.rotate(-deg, .5, .5);
					return {
						dx: m.x(dx, dy),
						dy: m.y(dx, dy)
					};
				},
				    setCoords = function setCoords(p, sx, sy, dx, dy, deg) {
					var _ = p._,
					    m = p.matrix,
					    fillpos = _.fillpos,
					    o = p.node,
					    s = o.style,
					    y = 1,
					    flip = "",
					    dxdy,
					    kx = zoom / sx,
					    ky = zoom / sy;
					s.visibility = "hidden";
					if (!sx || !sy) {
						return;
					}
					o.coordsize = abs(kx) + S + abs(ky);
					s.rotation = deg * (sx * sy < 0 ? -1 : 1);
					if (deg) {
						var c = compensation(deg, dx, dy);
						dx = c.dx;
						dy = c.dy;
					}
					sx < 0 && (flip += "x");
					sy < 0 && (flip += " y") && (y = -1);
					s.flip = flip;
					o.coordorigin = dx * -kx + S + dy * -ky;
					if (fillpos || _.fillsize) {
						var fill = o.getElementsByTagName(fillString);
						fill = fill && fill[0];
						o.removeChild(fill);
						if (fillpos) {
							c = compensation(deg, m.x(fillpos[0], fillpos[1]), m.y(fillpos[0], fillpos[1]));
							fill.position = c.dx * y + S + c.dy * y;
						}
						if (_.fillsize) {
							fill.size = _.fillsize[0] * abs(sx) + S + _.fillsize[1] * abs(sy);
						}
						o.appendChild(fill);
					}
					s.visibility = "visible";
				};
				R.toString = function () {
					return 'Your browser doesn\u2019t support SVG. Falling down to VML.\nYou are running Rapha\xEBl ' + this.version;
				};
				var addArrow = function addArrow(o, value, isEnd) {
					var values = Str(value).toLowerCase().split("-"),
					    se = isEnd ? "end" : "start",
					    i = values.length,
					    type = "classic",
					    w = "medium",
					    h = "medium";
					while (i--) {
						switch (values[i]) {
							case "block":
							case "classic":
							case "oval":
							case "diamond":
							case "open":
							case "none":
								type = values[i];
								break;
							case "wide":
							case "narrow":
								h = values[i];break;
							case "long":
							case "short":
								w = values[i];break;
						}
					}
					var stroke = o.node.getElementsByTagName("stroke")[0];
					stroke[se + "arrow"] = type;
					stroke[se + "arrowlength"] = w;
					stroke[se + "arrowwidth"] = h;
				},
				    setFillAndStroke = function setFillAndStroke(o, params) {
					// o.paper.canvas.style.display = "none";
					o.attrs = o.attrs || {};
					var node = o.node,
					    a = o.attrs,
					    s = node.style,
					    xy,
					    newpath = pathTypes[o.type] && (params.x != a.x || params.y != a.y || params.width != a.width || params.height != a.height || params.cx != a.cx || params.cy != a.cy || params.rx != a.rx || params.ry != a.ry || params.r != a.r),
					    isOval = ovalTypes[o.type] && (a.cx != params.cx || a.cy != params.cy || a.r != params.r || a.rx != params.rx || a.ry != params.ry),
					    res = o;

					for (var par in params) {
						if (params[has](par)) {
							a[par] = params[par];
						}
					}if (newpath) {
						a.path = R._getPath[o.type](o);
						o._.dirty = 1;
					}
					params.href && (node.href = params.href);
					params.title && (node.title = params.title);
					params.target && (node.target = params.target);
					params.cursor && (s.cursor = params.cursor);
					"blur" in params && o.blur(params.blur);
					if (params.path && o.type == "path" || newpath) {
						node.path = path2vml(~Str(a.path).toLowerCase().indexOf("r") ? R._pathToAbsolute(a.path) : a.path);
						o._.dirty = 1;
						if (o.type == "image") {
							o._.fillpos = [a.x, a.y];
							o._.fillsize = [a.width, a.height];
							setCoords(o, 1, 1, 0, 0, 0);
						}
					}
					"transform" in params && o.transform(params.transform);
					if (isOval) {
						var cx = +a.cx,
						    cy = +a.cy,
						    rx = +a.rx || +a.r || 0,
						    ry = +a.ry || +a.r || 0;
						node.path = R.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x", round((cx - rx) * zoom), round((cy - ry) * zoom), round((cx + rx) * zoom), round((cy + ry) * zoom), round(cx * zoom));
						o._.dirty = 1;
					}
					if ("clip-rect" in params) {
						var rect = Str(params["clip-rect"]).split(separator);
						if (rect.length == 4) {
							rect[2] = +rect[2] + +rect[0];
							rect[3] = +rect[3] + +rect[1];
							var div = node.clipRect || R._g.doc.createElement("div"),
							    dstyle = div.style;
							dstyle.clip = R.format("rect({1}px {2}px {3}px {0}px)", rect);
							if (!node.clipRect) {
								dstyle.position = "absolute";
								dstyle.top = 0;
								dstyle.left = 0;
								dstyle.width = o.paper.width + "px";
								dstyle.height = o.paper.height + "px";
								node.parentNode.insertBefore(div, node);
								div.appendChild(node);
								node.clipRect = div;
							}
						}
						if (!params["clip-rect"]) {
							node.clipRect && (node.clipRect.style.clip = "auto");
						}
					}
					if (o.textpath) {
						var textpathStyle = o.textpath.style;
						params.font && (textpathStyle.font = params.font);
						params["font-family"] && (textpathStyle.fontFamily = '"' + params["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g, E) + '"');
						params["font-size"] && (textpathStyle.fontSize = params["font-size"]);
						params["font-weight"] && (textpathStyle.fontWeight = params["font-weight"]);
						params["font-style"] && (textpathStyle.fontStyle = params["font-style"]);
					}
					if ("arrow-start" in params) {
						addArrow(res, params["arrow-start"]);
					}
					if ("arrow-end" in params) {
						addArrow(res, params["arrow-end"], 1);
					}
					if (params.opacity != null || params.fill != null || params.src != null || params.stroke != null || params["stroke-width"] != null || params["stroke-opacity"] != null || params["fill-opacity"] != null || params["stroke-dasharray"] != null || params["stroke-miterlimit"] != null || params["stroke-linejoin"] != null || params["stroke-linecap"] != null) {
						var fill = node.getElementsByTagName(fillString),
						    newfill = false;
						fill = fill && fill[0];
						!fill && (newfill = fill = createNode(fillString));
						if (o.type == "image" && params.src) {
							fill.src = params.src;
						}
						params.fill && (fill.on = true);
						if (fill.on == null || params.fill == "none" || params.fill === null) {
							fill.on = false;
						}
						if (fill.on && params.fill) {
							var isURL = Str(params.fill).match(R._ISURL);
							if (isURL) {
								fill.parentNode == node && node.removeChild(fill);
								fill.rotate = true;
								fill.src = isURL[1];
								fill.type = "tile";
								var bbox = o.getBBox(1);
								fill.position = bbox.x + S + bbox.y;
								o._.fillpos = [bbox.x, bbox.y];

								R._preload(isURL[1], function () {
									o._.fillsize = [this.offsetWidth, this.offsetHeight];
								});
							} else {
								fill.color = R.getRGB(params.fill).hex;
								fill.src = E;
								fill.type = "solid";
								if (R.getRGB(params.fill).error && (res.type in { circle: 1, ellipse: 1 } || Str(params.fill).charAt() != "r") && addGradientFill(res, params.fill, fill)) {
									a.fill = "none";
									a.gradient = params.fill;
									fill.rotate = false;
								}
							}
						}
						if ("fill-opacity" in params || "opacity" in params) {
							var opacity = ((+a["fill-opacity"] + 1 || 2) - 1) * ((+a.opacity + 1 || 2) - 1) * ((+R.getRGB(params.fill).o + 1 || 2) - 1);
							opacity = mmin(mmax(opacity, 0), 1);
							fill.opacity = opacity;
							if (fill.src) {
								fill.color = "none";
							}
						}
						node.appendChild(fill);
						var stroke = node.getElementsByTagName("stroke") && node.getElementsByTagName("stroke")[0],
						    newstroke = false;
						!stroke && (newstroke = stroke = createNode("stroke"));
						if (params.stroke && params.stroke != "none" || params["stroke-width"] || params["stroke-opacity"] != null || params["stroke-dasharray"] || params["stroke-miterlimit"] || params["stroke-linejoin"] || params["stroke-linecap"]) {
							stroke.on = true;
						}
						(params.stroke == "none" || params.stroke === null || stroke.on == null || params.stroke == 0 || params["stroke-width"] == 0) && (stroke.on = false);
						var strokeColor = R.getRGB(params.stroke);
						stroke.on && params.stroke && (stroke.color = strokeColor.hex);
						opacity = ((+a["stroke-opacity"] + 1 || 2) - 1) * ((+a.opacity + 1 || 2) - 1) * ((+strokeColor.o + 1 || 2) - 1);
						var width = (toFloat(params["stroke-width"]) || 1) * .75;
						opacity = mmin(mmax(opacity, 0), 1);
						params["stroke-width"] == null && (width = a["stroke-width"]);
						params["stroke-width"] && (stroke.weight = width);
						width && width < 1 && (opacity *= width) && (stroke.weight = 1);
						stroke.opacity = opacity;

						params["stroke-linejoin"] && (stroke.joinstyle = params["stroke-linejoin"] || "miter");
						stroke.miterlimit = params["stroke-miterlimit"] || 8;
						params["stroke-linecap"] && (stroke.endcap = params["stroke-linecap"] == "butt" ? "flat" : params["stroke-linecap"] == "square" ? "square" : "round");
						if ("stroke-dasharray" in params) {
							var dasharray = {
								"-": "shortdash",
								".": "shortdot",
								"-.": "shortdashdot",
								"-..": "shortdashdotdot",
								". ": "dot",
								"- ": "dash",
								"--": "longdash",
								"- .": "dashdot",
								"--.": "longdashdot",
								"--..": "longdashdotdot"
							};
							stroke.dashstyle = dasharray[has](params["stroke-dasharray"]) ? dasharray[params["stroke-dasharray"]] : E;
						}
						newstroke && node.appendChild(stroke);
					}
					if (res.type == "text") {
						res.paper.canvas.style.display = E;
						var span = res.paper.span,
						    m = 100,
						    fontSize = a.font && a.font.match(/\d+(?:\.\d*)?(?=px)/);
						s = span.style;
						a.font && (s.font = a.font);
						a["font-family"] && (s.fontFamily = a["font-family"]);
						a["font-weight"] && (s.fontWeight = a["font-weight"]);
						a["font-style"] && (s.fontStyle = a["font-style"]);
						fontSize = toFloat(a["font-size"] || fontSize && fontSize[0]) || 10;
						s.fontSize = fontSize * m + "px";
						res.textpath.string && (span.innerHTML = Str(res.textpath.string).replace(/</g, "&#60;").replace(/&/g, "&#38;").replace(/\n/g, "<br>"));
						var brect = span.getBoundingClientRect();
						res.W = a.w = (brect.right - brect.left) / m;
						res.H = a.h = (brect.bottom - brect.top) / m;
						// res.paper.canvas.style.display = "none";
						res.X = a.x;
						res.Y = a.y + res.H / 2;

						("x" in params || "y" in params) && (res.path.v = R.format("m{0},{1}l{2},{1}", round(a.x * zoom), round(a.y * zoom), round(a.x * zoom) + 1));
						var dirtyattrs = ["x", "y", "text", "font", "font-family", "font-weight", "font-style", "font-size"];
						for (var d = 0, dd = dirtyattrs.length; d < dd; d++) {
							if (dirtyattrs[d] in params) {
								res._.dirty = 1;
								break;
							}
						} // text-anchor emulation
						switch (a["text-anchor"]) {
							case "start":
								res.textpath.style["v-text-align"] = "left";
								res.bbx = res.W / 2;
								break;
							case "end":
								res.textpath.style["v-text-align"] = "right";
								res.bbx = -res.W / 2;
								break;
							default:
								res.textpath.style["v-text-align"] = "center";
								res.bbx = 0;
								break;
						}
						res.textpath.style["v-text-kern"] = true;
					}
					// res.paper.canvas.style.display = E;
				},
				    addGradientFill = function addGradientFill(o, gradient, fill) {
					o.attrs = o.attrs || {};
					var attrs = o.attrs,
					    pow = Math.pow,
					    opacity,
					    oindex,
					    type = "linear",
					    fxfy = ".5 .5";
					o.attrs.gradient = gradient;
					gradient = Str(gradient).replace(R._radial_gradient, function (all, fx, fy) {
						type = "radial";
						if (fx && fy) {
							fx = toFloat(fx);
							fy = toFloat(fy);
							pow(fx - .5, 2) + pow(fy - .5, 2) > .25 && (fy = math.sqrt(.25 - pow(fx - .5, 2)) * ((fy > .5) * 2 - 1) + .5);
							fxfy = fx + S + fy;
						}
						return E;
					});
					gradient = gradient.split(/\s*\-\s*/);
					if (type == "linear") {
						var angle = gradient.shift();
						angle = -toFloat(angle);
						if (isNaN(angle)) {
							return null;
						}
					}
					var dots = R._parseDots(gradient);
					if (!dots) {
						return null;
					}
					o = o.shape || o.node;
					if (dots.length) {
						o.removeChild(fill);
						fill.on = true;
						fill.method = "none";
						fill.color = dots[0].color;
						fill.color2 = dots[dots.length - 1].color;
						var clrs = [];
						for (var i = 0, ii = dots.length; i < ii; i++) {
							dots[i].offset && clrs.push(dots[i].offset + S + dots[i].color);
						}
						fill.colors = clrs.length ? clrs.join() : "0% " + fill.color;
						if (type == "radial") {
							fill.type = "gradientTitle";
							fill.focus = "100%";
							fill.focussize = "0 0";
							fill.focusposition = fxfy;
							fill.angle = 0;
						} else {
							// fill.rotate= true;
							fill.type = "gradient";
							fill.angle = (270 - angle) % 360;
						}
						o.appendChild(fill);
					}
					return 1;
				},
				    Element = function Element(node, vml) {
					this[0] = this.node = node;
					node.raphael = true;
					this.id = R._oid++;
					node.raphaelid = this.id;
					this.X = 0;
					this.Y = 0;
					this.attrs = {};
					this.paper = vml;
					this.matrix = R.matrix();
					this._ = {
						transform: [],
						sx: 1,
						sy: 1,
						dx: 0,
						dy: 0,
						deg: 0,
						dirty: 1,
						dirtyT: 1
					};
					!vml.bottom && (vml.bottom = this);
					this.prev = vml.top;
					vml.top && (vml.top.next = this);
					vml.top = this;
					this.next = null;
				};
				var elproto = R.el;

				Element.prototype = elproto;
				elproto.constructor = Element;
				elproto.transform = function (tstr) {
					if (tstr == null) {
						return this._.transform;
					}
					var vbs = this.paper._viewBoxShift,
					    vbt = vbs ? "s" + [vbs.scale, vbs.scale] + "-1-1t" + [vbs.dx, vbs.dy] : E,
					    oldt;
					if (vbs) {
						oldt = tstr = Str(tstr).replace(/\.{3}|\u2026/g, this._.transform || E);
					}
					R._extractTransform(this, vbt + tstr);
					var matrix = this.matrix.clone(),
					    skew = this.skew,
					    o = this.node,
					    split,
					    isGrad = ~Str(this.attrs.fill).indexOf("-"),
					    isPatt = !Str(this.attrs.fill).indexOf("url(");
					matrix.translate(1, 1);
					if (isPatt || isGrad || this.type == "image") {
						skew.matrix = "1 0 0 1";
						skew.offset = "0 0";
						split = matrix.split();
						if (isGrad && split.noRotation || !split.isSimple) {
							o.style.filter = matrix.toFilter();
							var bb = this.getBBox(),
							    bbt = this.getBBox(1),
							    dx = bb.x - bbt.x,
							    dy = bb.y - bbt.y;
							o.coordorigin = dx * -zoom + S + dy * -zoom;
							setCoords(this, 1, 1, dx, dy, 0);
						} else {
							o.style.filter = E;
							setCoords(this, split.scalex, split.scaley, split.dx, split.dy, split.rotate);
						}
					} else {
						o.style.filter = E;
						skew.matrix = Str(matrix);
						skew.offset = matrix.offset();
					}
					if (oldt !== null) {
						// empty string value is true as well
						this._.transform = oldt;
						R._extractTransform(this, oldt);
					}
					return this;
				};
				elproto.rotate = function (deg, cx, cy) {
					if (this.removed) {
						return this;
					}
					if (deg == null) {
						return;
					}
					deg = Str(deg).split(separator);
					if (deg.length - 1) {
						cx = toFloat(deg[1]);
						cy = toFloat(deg[2]);
					}
					deg = toFloat(deg[0]);
					cy == null && (cx = cy);
					if (cx == null || cy == null) {
						var bbox = this.getBBox(1);
						cx = bbox.x + bbox.width / 2;
						cy = bbox.y + bbox.height / 2;
					}
					this._.dirtyT = 1;
					this.transform(this._.transform.concat([["r", deg, cx, cy]]));
					return this;
				};
				elproto.translate = function (dx, dy) {
					if (this.removed) {
						return this;
					}
					dx = Str(dx).split(separator);
					if (dx.length - 1) {
						dy = toFloat(dx[1]);
					}
					dx = toFloat(dx[0]) || 0;
					dy = +dy || 0;
					if (this._.bbox) {
						this._.bbox.x += dx;
						this._.bbox.y += dy;
					}
					this.transform(this._.transform.concat([["t", dx, dy]]));
					return this;
				};
				elproto.scale = function (sx, sy, cx, cy) {
					if (this.removed) {
						return this;
					}
					sx = Str(sx).split(separator);
					if (sx.length - 1) {
						sy = toFloat(sx[1]);
						cx = toFloat(sx[2]);
						cy = toFloat(sx[3]);
						isNaN(cx) && (cx = null);
						isNaN(cy) && (cy = null);
					}
					sx = toFloat(sx[0]);
					sy == null && (sy = sx);
					cy == null && (cx = cy);
					if (cx == null || cy == null) {
						var bbox = this.getBBox(1);
					}
					cx = cx == null ? bbox.x + bbox.width / 2 : cx;
					cy = cy == null ? bbox.y + bbox.height / 2 : cy;

					this.transform(this._.transform.concat([["s", sx, sy, cx, cy]]));
					this._.dirtyT = 1;
					return this;
				};
				elproto.hide = function () {
					!this.removed && (this.node.style.display = "none");
					return this;
				};
				elproto.show = function () {
					!this.removed && (this.node.style.display = E);
					return this;
				};
				// Needed to fix the vml setViewBox issues
				elproto.auxGetBBox = R.el.getBBox;
				elproto.getBBox = function () {
					var b = this.auxGetBBox();
					if (this.paper && this.paper._viewBoxShift) {
						var c = {};
						var z = 1 / this.paper._viewBoxShift.scale;
						c.x = b.x - this.paper._viewBoxShift.dx;
						c.x *= z;
						c.y = b.y - this.paper._viewBoxShift.dy;
						c.y *= z;
						c.width = b.width * z;
						c.height = b.height * z;
						c.x2 = c.x + c.width;
						c.y2 = c.y + c.height;
						return c;
					}
					return b;
				};
				elproto._getBBox = function () {
					if (this.removed) {
						return {};
					}
					return {
						x: this.X + (this.bbx || 0) - this.W / 2,
						y: this.Y - this.H,
						width: this.W,
						height: this.H
					};
				};
				elproto.remove = function () {
					if (this.removed || !this.node.parentNode) {
						return;
					}
					this.paper.__set__ && this.paper.__set__.exclude(this);
					R.eve.unbind("raphael.*.*." + this.id);
					R._tear(this, this.paper);
					this.node.parentNode.removeChild(this.node);
					this.shape && this.shape.parentNode.removeChild(this.shape);
					for (var i in this) {
						this[i] = typeof this[i] == "function" ? R._removedFactory(i) : null;
					}
					this.removed = true;
				};
				elproto.attr = function (name, value) {
					if (this.removed) {
						return this;
					}
					if (name == null) {
						var res = {};
						for (var a in this.attrs) {
							if (this.attrs[has](a)) {
								res[a] = this.attrs[a];
							}
						}res.gradient && res.fill == "none" && (res.fill = res.gradient) && delete res.gradient;
						res.transform = this._.transform;
						return res;
					}
					if (value == null && R.is(name, "string")) {
						if (name == fillString && this.attrs.fill == "none" && this.attrs.gradient) {
							return this.attrs.gradient;
						}
						var names = name.split(separator),
						    out = {};
						for (var i = 0, ii = names.length; i < ii; i++) {
							name = names[i];
							if (name in this.attrs) {
								out[name] = this.attrs[name];
							} else if (R.is(this.paper.customAttributes[name], "function")) {
								out[name] = this.paper.customAttributes[name].def;
							} else {
								out[name] = R._availableAttrs[name];
							}
						}
						return ii - 1 ? out : out[names[0]];
					}
					if (this.attrs && value == null && R.is(name, "array")) {
						out = {};
						for (i = 0, ii = name.length; i < ii; i++) {
							out[name[i]] = this.attr(name[i]);
						}
						return out;
					}
					var params;
					if (value != null) {
						params = {};
						params[name] = value;
					}
					value == null && R.is(name, "object") && (params = name);
					for (var key in params) {
						eve("raphael.attr." + key + "." + this.id, this, params[key]);
					}
					if (params) {
						for (key in this.paper.customAttributes) {
							if (this.paper.customAttributes[has](key) && params[has](key) && R.is(this.paper.customAttributes[key], "function")) {
								var par = this.paper.customAttributes[key].apply(this, [].concat(params[key]));
								this.attrs[key] = params[key];
								for (var subkey in par) {
									if (par[has](subkey)) {
										params[subkey] = par[subkey];
									}
								}
							}
						} // this.paper.canvas.style.display = "none";
						if (params.text && this.type == "text") {
							this.textpath.string = params.text;
						}
						setFillAndStroke(this, params);
						// this.paper.canvas.style.display = E;
					}
					return this;
				};
				elproto.toFront = function () {
					!this.removed && this.node.parentNode.appendChild(this.node);
					this.paper && this.paper.top != this && R._tofront(this, this.paper);
					return this;
				};
				elproto.toBack = function () {
					if (this.removed) {
						return this;
					}
					if (this.node.parentNode.firstChild != this.node) {
						this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild);
						R._toback(this, this.paper);
					}
					return this;
				};
				elproto.insertAfter = function (element) {
					if (this.removed) {
						return this;
					}
					if (element.constructor == R.st.constructor) {
						element = element[element.length - 1];
					}
					if (element.node.nextSibling) {
						element.node.parentNode.insertBefore(this.node, element.node.nextSibling);
					} else {
						element.node.parentNode.appendChild(this.node);
					}
					R._insertafter(this, element, this.paper);
					return this;
				};
				elproto.insertBefore = function (element) {
					if (this.removed) {
						return this;
					}
					if (element.constructor == R.st.constructor) {
						element = element[0];
					}
					element.node.parentNode.insertBefore(this.node, element.node);
					R._insertbefore(this, element, this.paper);
					return this;
				};
				elproto.blur = function (size) {
					var s = this.node.runtimeStyle,
					    f = s.filter;
					f = f.replace(blurregexp, E);
					if (+size !== 0) {
						this.attrs.blur = size;
						s.filter = f + S + ms + ".Blur(pixelradius=" + (+size || 1.5) + ")";
						s.margin = R.format("-{0}px 0 0 -{0}px", round(+size || 1.5));
					} else {
						s.filter = f;
						s.margin = 0;
						delete this.attrs.blur;
					}
					return this;
				};

				R._engine.path = function (pathString, vml) {
					var el = createNode("shape");
					el.style.cssText = cssDot;
					el.coordsize = zoom + S + zoom;
					el.coordorigin = vml.coordorigin;
					var p = new Element(el, vml),
					    attr = { fill: "none", stroke: "#000" };
					pathString && (attr.path = pathString);
					p.type = "path";
					p.path = [];
					p.Path = E;
					setFillAndStroke(p, attr);
					vml.canvas && vml.canvas.appendChild(el);
					var skew = createNode("skew");
					skew.on = true;
					el.appendChild(skew);
					p.skew = skew;
					p.transform(E);
					return p;
				};
				R._engine.rect = function (vml, x, y, w, h, r) {
					var path = R._rectPath(x, y, w, h, r),
					    res = vml.path(path),
					    a = res.attrs;
					res.X = a.x = x;
					res.Y = a.y = y;
					res.W = a.width = w;
					res.H = a.height = h;
					a.r = r;
					a.path = path;
					res.type = "rect";
					return res;
				};
				R._engine.ellipse = function (vml, x, y, rx, ry) {
					var res = vml.path(),
					    a = res.attrs;
					res.X = x - rx;
					res.Y = y - ry;
					res.W = rx * 2;
					res.H = ry * 2;
					res.type = "ellipse";
					setFillAndStroke(res, {
						cx: x,
						cy: y,
						rx: rx,
						ry: ry
					});
					return res;
				};
				R._engine.circle = function (vml, x, y, r) {
					var res = vml.path(),
					    a = res.attrs;
					res.X = x - r;
					res.Y = y - r;
					res.W = res.H = r * 2;
					res.type = "circle";
					setFillAndStroke(res, {
						cx: x,
						cy: y,
						r: r
					});
					return res;
				};
				R._engine.image = function (vml, src, x, y, w, h) {
					var path = R._rectPath(x, y, w, h),
					    res = vml.path(path).attr({ stroke: "none" }),
					    a = res.attrs,
					    node = res.node,
					    fill = node.getElementsByTagName(fillString)[0];
					a.src = src;
					res.X = a.x = x;
					res.Y = a.y = y;
					res.W = a.width = w;
					res.H = a.height = h;
					a.path = path;
					res.type = "image";
					fill.parentNode == node && node.removeChild(fill);
					fill.rotate = true;
					fill.src = src;
					fill.type = "tile";
					res._.fillpos = [x, y];
					res._.fillsize = [w, h];
					node.appendChild(fill);
					setCoords(res, 1, 1, 0, 0, 0);
					return res;
				};
				R._engine.text = function (vml, x, y, text) {
					var el = createNode("shape"),
					    path = createNode("path"),
					    o = createNode("textpath");
					x = x || 0;
					y = y || 0;
					text = text || "";
					path.v = R.format("m{0},{1}l{2},{1}", round(x * zoom), round(y * zoom), round(x * zoom) + 1);
					path.textpathok = true;
					o.string = Str(text);
					o.on = true;
					el.style.cssText = cssDot;
					el.coordsize = zoom + S + zoom;
					el.coordorigin = "0 0";
					var p = new Element(el, vml),
					    attr = {
						fill: "#000",
						stroke: "none",
						font: R._availableAttrs.font,
						text: text
					};
					p.shape = el;
					p.path = path;
					p.textpath = o;
					p.type = "text";
					p.attrs.text = Str(text);
					p.attrs.x = x;
					p.attrs.y = y;
					p.attrs.w = 1;
					p.attrs.h = 1;
					setFillAndStroke(p, attr);
					el.appendChild(o);
					el.appendChild(path);
					vml.canvas.appendChild(el);
					var skew = createNode("skew");
					skew.on = true;
					el.appendChild(skew);
					p.skew = skew;
					p.transform(E);
					return p;
				};
				R._engine.setSize = function (width, height) {
					var cs = this.canvas.style;
					this.width = width;
					this.height = height;
					width == +width && (width += "px");
					height == +height && (height += "px");
					cs.width = width;
					cs.height = height;
					cs.clip = "rect(0 " + width + " " + height + " 0)";
					if (this._viewBox) {
						R._engine.setViewBox.apply(this, this._viewBox);
					}
					return this;
				};
				R._engine.setViewBox = function (x, y, w, h, fit) {
					R.eve("raphael.setViewBox", this, this._viewBox, [x, y, w, h, fit]);
					var paperSize = this.getSize(),
					    width = paperSize.width,
					    height = paperSize.height,
					    H,
					    W;
					if (fit) {
						H = height / h;
						W = width / w;
						if (w * H < width) {
							x -= (width - w * H) / 2 / H;
						}
						if (h * W < height) {
							y -= (height - h * W) / 2 / W;
						}
					}
					this._viewBox = [x, y, w, h, !!fit];
					this._viewBoxShift = {
						dx: -x,
						dy: -y,
						scale: paperSize
					};
					this.forEach(function (el) {
						el.transform("...");
					});
					return this;
				};
				var createNode;
				R._engine.initWin = function (win) {
					var doc = win.document;
					if (doc.styleSheets.length < 31) {
						doc.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
					} else {
						// no more room, add to the existing one
						// http://msdn.microsoft.com/en-us/library/ms531194%28VS.85%29.aspx
						doc.styleSheets[0].addRule(".rvml", "behavior:url(#default#VML)");
					}
					try {
						!doc.namespaces.rvml && doc.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
						createNode = function createNode(tagName) {
							return doc.createElement('<rvml:' + tagName + ' class="rvml">');
						};
					} catch (e) {
						createNode = function createNode(tagName) {
							return doc.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
						};
					}
				};
				R._engine.initWin(R._g.win);
				R._engine.create = function () {
					var con = R._getContainer.apply(0, arguments),
					    container = con.container,
					    height = con.height,
					    s,
					    width = con.width,
					    x = con.x,
					    y = con.y;
					if (!container) {
						throw new Error("VML container not found.");
					}
					var res = new R._Paper(),
					    c = res.canvas = R._g.doc.createElement("div"),
					    cs = c.style;
					x = x || 0;
					y = y || 0;
					width = width || 512;
					height = height || 342;
					res.width = width;
					res.height = height;
					width == +width && (width += "px");
					height == +height && (height += "px");
					res.coordsize = zoom * 1e3 + S + zoom * 1e3;
					res.coordorigin = "0 0";
					res.span = R._g.doc.createElement("span");
					res.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;";
					c.appendChild(res.span);
					cs.cssText = R.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden", width, height);
					if (container == 1) {
						R._g.doc.body.appendChild(c);
						cs.left = x + "px";
						cs.top = y + "px";
						cs.position = "absolute";
					} else {
						if (container.firstChild) {
							container.insertBefore(c, container.firstChild);
						} else {
							container.appendChild(c);
						}
					}
					res.renderfix = function () {};
					return res;
				};
				R.prototype.clear = function () {
					R.eve("raphael.clear", this);
					this.canvas.innerHTML = E;
					this.span = R._g.doc.createElement("span");
					this.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
					this.canvas.appendChild(this.span);
					this.bottom = this.top = null;
				};
				R.prototype.remove = function () {
					R.eve("raphael.remove", this);
					this.canvas.parentNode.removeChild(this.canvas);
					for (var i in this) {
						this[i] = typeof this[i] == "function" ? R._removedFactory(i) : null;
					}
					return true;
				};

				var setproto = R.st;
				for (var method in elproto) {
					if (elproto[has](method) && !setproto[has](method)) {
						setproto[method] = function (methodname) {
							return function () {
								var arg = arguments;
								return this.forEach(function (el) {
									el[methodname].apply(el, arg);
								});
							};
						}(method);
					}
				}
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

			/***/
		}
		/******/])
	);
});
;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(458)(module)))

/***/ }),

/***/ 458:
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ 459:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//矩阵常用计算，经过计算以后返回一个矩阵对象
//包含的内容
/*
AStart返回A*矩阵，A*为代数余子式组成的矩阵，返回一个新的矩阵对象
AInverse返回A逆矩阵，返回一个新的矩阵对象
rankA返回A的秩
transpose返回AT矩阵，AT为矩阵的转置，返回一个新的矩阵对象
shape返回矩阵的行列信息
add矩阵的加法计算。可以是个数字也可以是两个矩阵相加，返回一个新的矩阵对象
multiply矩阵的乘法计算。可以是个数字也可以是两个矩阵相乘，返回一个新的矩阵对象
*/
var Metix = function () {
    function Metix(data, row, col) {
        _classCallCheck(this, Metix);

        this.orgin = Metix.makeMetix(data, 'row', row, col);
        this.row = row;
        this.col = col;
    }

    //a*


    _createClass(Metix, [{
        key: "AStart",
        value: function AStart() {
            var newA = [];
            for (var i = 0; i < this.row; i++) {
                for (var j = 0; j < this.col; j++) {
                    //console.log(Metix.modA(this.orgin,i, j))
                    newA.push(Metix.modA(this.orgin, i, j));
                }
            }
            return new Metix(newA, this.row, this.col);
        }

        //a-1

    }, {
        key: "AInverse",
        value: function AInverse() {
            var data = Metix.rankA(this.orgin, this.row, this.col);
            if (data) {
                var newA = [];
                // console.log()
                var temp = this.AStart().transpose().orgin;
                for (var i = 0; i < this.row; i++) {
                    for (var j = 0; j < this.col; j++) {
                        // console.log(temp[i][j])
                        newA.push(temp[i][j] / data);
                    }
                }
                return new Metix(newA, this.row, this.col);
            } else {
                return null;
            }
        }

        //|a|

    }, {
        key: "rankA",
        value: function rankA() {
            return Metix.rankA(this.orgin, this.row, this.col);
        }

        //at

    }, {
        key: "transpose",
        value: function transpose() {
            var newA = [];
            for (var i = 0; i < this.col; i++) {
                for (var j = 0; j < this.row; j++) {
                    newA.push(this.orgin[j][i]);
                }
            }
            return new Metix(newA, this.col, this.row);
        }
    }, {
        key: "shape",
        value: function shape() {
            return {
                row: this.row,
                col: this.col
            };
        }
    }, {
        key: "add",
        value: function add(value) {
            var newA = [];
            switch (typeof value === "undefined" ? "undefined" : _typeof(value)) {
                case "object":
                    for (var i = 0; i < this.row; i++) {
                        for (var j = 0; j < this.col; j++) {
                            newA[i].push(this.orgin[i][j] + (value[i][j] ? value[i][j] : 0));
                        }
                    }
                    break;
                case "number":
                    for (var _i = 0; _i < this.row; _i++) {
                        for (var _j = 0; _j < this.col; _j++) {
                            newA[_i].push(this.orgin[_i][_j] + value);
                        }
                    }
                    break;
            }
            return new Metix(newA, this.row, this.col);
        }
    }, {
        key: "multiply",
        value: function multiply(value) {
            var aa = [];
            switch (typeof value === "undefined" ? "undefined" : _typeof(value)) {
                case "object":
                    //console.log(this.orgin,value)
                    var newA = Metix.metixMultiply(this.orgin, value);
                    for (var i = 0; i < newA.length; i++) {
                        for (var j = 0; j < newA[i].length; j++) {
                            aa.push(newA[i][j]);
                        }
                    }
                    return new Metix(aa, newA.length, newA[0].length);
                    break;
                case "number":
                    for (var _i2 = 0; _i2 < this.row; _i2++) {
                        for (var _j2 = 0; _j2 < this.col; _j2++) {
                            aa.push(this.orgin[_i2][_j2] * value);
                        }
                    }
                    return new Metix(aa, this.row, this.col);
                    break;
            }
        }
    }], [{
        key: "modA",
        value: function modA(value, rr, rc) {
            var newA = [];
            for (var i = 0; i < value.length; i++) {
                if (i != rr) {
                    newA.push([]);
                    for (var j = 0; j < value[i].length; j++) {
                        if (j != rc) {
                            newA[newA.length - 1].push(value[i][j]);
                        }
                    }
                }
            }

            var randk = Math.pow(-1, rr * 1 + rc * 1) * Metix.rankA(newA, value.length - 1, value[0].length - 1);
            //console.log(randk, rr, rc, newA)
            return randk;
        }
    }, {
        key: "rankA",
        value: function rankA(ctA, row, col) {
            var leftNum = 0;
            if (row == 1 && col == 1) {
                return ctA[0][0];
            }
            if (row == 2 && col == 2) {
                return ctA[0][0] * ctA[1][1] - ctA[0][1] * ctA[1][0];
            }
            for (var i = 0; i < col; i++) {
                var num = 1;
                for (var j = 0; j < row; j++) {
                    var qianz = j + i > col - 1 ? j + i - col : j + i;
                    num = num * ctA[j][qianz];
                }
                leftNum += num;
            }
            var rightNum = 0;
            for (var _i3 = col - 1; _i3 >= 0; _i3--) {
                var num2 = 1;
                for (var _j3 = 0; _j3 < row; _j3++) {
                    var qianz1 = _i3 - _j3 < 0 ? col + _i3 - _j3 : _i3 - _j3;
                    num2 = num2 * ctA[_j3][qianz1];
                }
                rightNum += num2;
            }
            // console.log(ctA, rightNum, leftNum)
            return leftNum - rightNum;
        }
    }, {
        key: "makeMetix",
        value: function makeMetix(value, type, row, col) {
            var rA = [];
            if (type == 'row') {
                for (var i = 0; i < row; i++) {
                    rA[i] = [];
                    for (var j = 0; j < col; j++) {
                        rA[i].push(value[i * col + j]);
                    }
                }
            } else {
                for (var _i4 = 0; _i4 < col; _i4++) {
                    rA[_i4] = [];
                    for (var _j4 = 0; _j4 < row; _j4++) {
                        rA[_i4].push(value[_i4 + _j4 * col]);
                    }
                }
            }
            return rA;
        }
    }, {
        key: "metixMultiply",
        value: function metixMultiply(mA, mB) {
            if (_typeof(mA[0]) != 'object' && _typeof(mB[0]) != 'object') {
                return [];
            }
            var rA = [];
            for (var i = 0; i < mA.length; i++) {
                rA[i] = [];
                for (var j = 0; j < mB.length; j++) {
                    rA[i].push(Metix.Multiply(mA[i], mB[j]));
                }
            }
            return rA;
        }
    }, {
        key: "Multiply",
        value: function Multiply(mA, mB) {
            //console.log(mA,mB)
            if (mA.length != mB.length) {
                return null;
            }
            var num = 0;
            for (var i = 0; i < mA.length; i++) {
                num += mA[i] * mB[i];
            }
            //console.log(num)
            return num;
        }
    }]);

    return Metix;
}();

window.Metix = window.Metix || Metix;
module.exports = window.Metix;

/***/ }),

/***/ 460:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase  */
var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance */
var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode  */
/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function __aw__(s) {
  return binl2hex(core_md5(str2binl(s), s.length * chrsz));
}
function b64_md5(s) {
  return binl2b64(core_md5(str2binl(s), s.length * chrsz));
}
function str_md5(s) {
  return binl2str(core_md5(str2binl(s), s.length * chrsz));
}
function hex_hmac_md5(key, data) {
  return binl2hex(core_hmac_md5(key, data));
}
function b64_hmac_md5(key, data) {
  return binl2b64(core_hmac_md5(key, data));
}
function str_hmac_md5(key, data) {
  return binl2str(core_hmac_md5(key, data));
}
/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test() {
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}
/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[(len + 64 >>> 9 << 4) + 14] = len;
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;
  for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
    d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
    d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);
}
/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t) {
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}
function md5_ff(a, b, c, d, x, s, t) {
  return md5_cmn(b & c | ~b & d, a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t) {
  return md5_cmn(b & d | c & ~d, a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t) {
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t) {
  return md5_cmn(c ^ (b | ~d), a, b, x, s, t);
}
/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data) {
  var bkey = str2binl(key);
  if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);
  var ipad = Array(16),
      opad = Array(16);
  for (var i = 0; i < 16; i++) {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }
  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xFFFF;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str) {
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for (var i = 0; i < str.length * chrsz; i += chrsz) {
    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << i % 32;
  }return bin;
}
/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin) {
  var str = "";
  var mask = (1 << chrsz) - 1;
  for (var i = 0; i < bin.length * 32; i += chrsz) {
    str += String.fromCharCode(bin[i >> 5] >>> i % 32 & mask);
  }return str;
}
/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray) {
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for (var i = 0; i < binarray.length * 4; i++) {
    str += hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 + 4 & 0xF) + hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 & 0xF);
  }
  return str;
}
/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray) {
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for (var i = 0; i < binarray.length * 4; i += 3) {
    var triplet = (binarray[i >> 2] >> 8 * (i % 4) & 0xFF) << 16 | (binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4) & 0xFF) << 8 | binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4) & 0xFF;
    for (var j = 0; j < 4; j++) {
      if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;else str += tab.charAt(triplet >> 6 * (3 - j) & 0x3F);
    }
  }
  return str;
}
window.__aw__ = window.__aw__ || __aw__;
module.exports = __aw__;

/***/ }),

/***/ 461:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 *  base64.js
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */
;(function (global, factory) {
    ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory(global) :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : factory(global);
})(typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : undefined, function (global) {
    'use strict';
    // existing version for noConflict()

    global = global || {};
    var _Base64 = global.Base64;
    var version = "2.5.1";
    // if node.js and NOT React Native, we use Buffer
    var buffer;
    if (typeof module !== 'undefined' && module.exports) {
        try {
            buffer = eval("require('buffer').Buffer");
        } catch (err) {
            buffer = undefined;
        }
    }
    // constants
    var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function (bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) {
            t[bin.charAt(i)] = i;
        }return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function cb_utob(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c : cc < 0x800 ? fromCharCode(0xc0 | cc >>> 6) + fromCharCode(0x80 | cc & 0x3f) : fromCharCode(0xe0 | cc >>> 12 & 0x0f) + fromCharCode(0x80 | cc >>> 6 & 0x3f) + fromCharCode(0x80 | cc & 0x3f);
        } else {
            var cc = 0x10000 + (c.charCodeAt(0) - 0xD800) * 0x400 + (c.charCodeAt(1) - 0xDC00);
            return fromCharCode(0xf0 | cc >>> 18 & 0x07) + fromCharCode(0x80 | cc >>> 12 & 0x3f) + fromCharCode(0x80 | cc >>> 6 & 0x3f) + fromCharCode(0x80 | cc & 0x3f);
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function utob(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function cb_encode(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
            ord = ccc.charCodeAt(0) << 16 | (ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8 | (ccc.length > 2 ? ccc.charCodeAt(2) : 0),
            chars = [b64chars.charAt(ord >>> 18), b64chars.charAt(ord >>> 12 & 63), padlen >= 2 ? '=' : b64chars.charAt(ord >>> 6 & 63), padlen >= 1 ? '=' : b64chars.charAt(ord & 63)];
        return chars.join('');
    };
    var btoa = global.btoa ? function (b) {
        return global.btoa(b);
    } : function (b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = function _encode(u) {
        var isUint8Array = Object.prototype.toString.call(u) === '[object Uint8Array]';
        return isUint8Array ? u.toString('base64') : btoa(utob(String(u)));
    };
    var encode = function encode(u, urisafe) {
        return !urisafe ? _encode(u) : _encode(String(u)).replace(/[+\/]/g, function (m0) {
            return m0 == '+' ? '-' : '_';
        }).replace(/=/g, '');
    };
    var encodeURI = function encodeURI(u) {
        return encode(u, true);
    };
    // decoder stuff
    var re_btou = new RegExp(['[\xC0-\xDF][\x80-\xBF]', '[\xE0-\xEF][\x80-\xBF]{2}', '[\xF0-\xF7][\x80-\xBF]{3}'].join('|'), 'g');
    var cb_btou = function cb_btou(cccc) {
        switch (cccc.length) {
            case 4:
                var cp = (0x07 & cccc.charCodeAt(0)) << 18 | (0x3f & cccc.charCodeAt(1)) << 12 | (0x3f & cccc.charCodeAt(2)) << 6 | 0x3f & cccc.charCodeAt(3),
                    offset = cp - 0x10000;
                return fromCharCode((offset >>> 10) + 0xD800) + fromCharCode((offset & 0x3FF) + 0xDC00);
            case 3:
                return fromCharCode((0x0f & cccc.charCodeAt(0)) << 12 | (0x3f & cccc.charCodeAt(1)) << 6 | 0x3f & cccc.charCodeAt(2));
            default:
                return fromCharCode((0x1f & cccc.charCodeAt(0)) << 6 | 0x3f & cccc.charCodeAt(1));
        }
    };
    var btou = function btou(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function cb_decode(cccc) {
        var len = cccc.length,
            padlen = len % 4,
            n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0) | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0) | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0) | (len > 3 ? b64tab[cccc.charAt(3)] : 0),
            chars = [fromCharCode(n >>> 16), fromCharCode(n >>> 8 & 0xff), fromCharCode(n & 0xff)];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var _atob = global.atob ? function (a) {
        return global.atob(a);
    } : function (a) {
        return a.replace(/\S{1,4}/g, cb_decode);
    };
    var atob = function atob(a) {
        return _atob(String(a).replace(/[^A-Za-z0-9\+\/]/g, ''));
    };
    var _decode = buffer ? buffer.from && Uint8Array && buffer.from !== Uint8Array.from ? function (a) {
        return (a.constructor === buffer.constructor ? a : buffer.from(a, 'base64')).toString();
    } : function (a) {
        return (a.constructor === buffer.constructor ? a : new buffer(a, 'base64')).toString();
    } : function (a) {
        return btou(_atob(a));
    };
    var decode = function decode(a) {
        return _decode(String(a).replace(/[-_]/g, function (m0) {
            return m0 == '-' ? '+' : '/';
        }).replace(/[^A-Za-z0-9\+\/]/g, ''));
    };
    var noConflict = function noConflict() {
        var Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };
    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict,
        __buffer__: buffer
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function noEnum(v) {
            return { value: v, enumerable: false, writable: true, configurable: true };
        };
        global.Base64.extendString = function () {
            Object.defineProperty(String.prototype, 'fromBase64', noEnum(function () {
                return decode(this);
            }));
            Object.defineProperty(String.prototype, 'toBase64', noEnum(function (urisafe) {
                return encode(this, urisafe);
            }));
            Object.defineProperty(String.prototype, 'toBase64URI', noEnum(function () {
                return encode(this, true);
            }));
        };
    }
    //
    // export Base64 to the namespace
    //
    if (global['Meteor']) {
        // Meteor.js
        Base64 = global.Base64;
    }
    // module.exports and AMD are mutually exclusive.
    // module.exports has precedence.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.Base64 = global.Base64;
    } else if (true) {
        // AMD. Register as an anonymous module.
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
            return global.Base64;
        }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
    // that's it!
    return { Base64: global.Base64 };
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(55)))

/***/ }),

/***/ 462:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function eventMo() {
    var event = {};
    event._event = {};
    event._id = 0;
    event._dispatch = function (name, params) {
        var nowmpdel = name.split('.');
        var now = event._event;
        for (var i = 0; i < nowmpdel.length; i++) {
            if (!now[nowmpdel[i]]) {
                //console.log('fun not find',nowmpdel[i])
            } else {
                now = now[nowmpdel[i]];
            }
            //console.log(now.fun,'nowfun',name)
            if (i == nowmpdel.length - 1) {
                if (typeof now.fun === 'function') {
                    now.fun(params);
                } else {
                    // console.log('no function',now.fun)
                }
            }
        }
    };
    event._addEvent = function (name, callback) {
        var nowmpdel = name.split('.');
        var now = event._event;
        for (var i = 0; i < nowmpdel.length; i++) {
            if (!now[nowmpdel[i]]) {
                now[nowmpdel[i]] = {};
            }
            now = now[nowmpdel[i]];
            if (i == nowmpdel.length - 1) {
                now.fun = callback;
                event._id += 1;
                now.id = event._id;
                now.name = name;
            }
        }
        return now;
    };
    event._delEvent = function (name) {
        var nowmpdel = value.split('.');
        var now = event._event;
        for (var i = 0; i < nowmpdel.length; i++) {
            if (i == nowmpdel.length - 1) {
                delete now[nowmpdel[i]];
            }
            now = now[nowmpdel[i]];
        }
    };
    return event;
}
window.Interstellar = window.Interstellar || {};
window.Interstellar.event = window.Interstellar.event || eventMo;
module.exports = eventMo;

/***/ }),

/***/ 463:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var tool = {
    //千分位
    numFormat: function numFormat(num) {
        var num = (num || 0).toString(),
            result = '';
        while (num.length > 3) {
            result = ',' + num.slice(-3) + result;
            num = num.slice(0, num.length - 3);
        }
        if (num) {
            result = num + result;
        }
        return result;
    },
    //数组求和
    sumArray: function sumArray(value) {
        return eval(value.join("+"));
    },
    //深度克隆
    objetClone: function objetClone(value) {
        return value ? JSON.parse(JSON.stringify(value)) : null;
    },

    //添加对象
    addObject: function addObject(value, who) {
        for (var k in value) {
            if (value[k]) {
                who[k] = value[k];
            }
        }
    },
    calAngel: function calAngel(line1, line2) {
        var k1 = (line1.start.y - line1.end.y) / (line1.start.x - line1.end.x);
        var k2 = (line2.start.y - line2.end.y) / (line2.start.x - line2.end.x);
        console.log('COBB角度工具计算角度', k1, k2, line1, line2);
        return (180 * Math.atan(Math.abs((k1 - k2) / (1 + k1 * k2))) / Math.PI).toFixed(2);
    },
    calDis: function calDis(pa) {
        var k1 = (pa[0].start.y - pa[1].start.y) / (pa[0].start.x - pa[1].start.x);
        var b1 = pa[0].start.y - k1 * pa[0].start.x;
        var dis = (k1 * pa[2].start.x - pa[2].start.y + b1) / Math.pow(k1 * k1 + 1, 0.5);
        return Math.abs(dis).toFixed(2);
    },

    //url处理转换成文件名
    changeToName: function changeToName(value, type) {
        type = type ? type : "jpg";
        var rex = new RegExp("(\\/0*\\d{1,}.\\w{3,}$)", "g");
        var url = value ? value.split('?')[0].match(rex)[0] : "";
        var pointNUm = url ? url.split('.')[0].replace('/', '') * 1 : -1;
        //let pointNUm = posArr[posArr.length - 1].indexOf('.')
        return pointNUm; //posArr[posArr.length - 1].replace('.' + type, '') * 1
    },
    //url正则
    checkUrl: function checkUrl(urlString) {
        if (urlString != "") {
            var reg = /[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
            if (!reg.test(urlString)) {
                return false;
                //alert("不是正确的网址吧，请注意检查一下");
            } else {
                return true;
            }
        } else {
            return false;
        }
    },
    //长数组对比
    comparison: function comparison(oldA, newA) {
        if (!oldA) {
            if (newA) {
                return { 'noldA': newA, 'newA': newA, 'changeOld': [] };
            } else {
                return null;
            }
        }
        var str = JSON.stringify(oldA).replace(/]$/, ',]');
        var newOld = [];
        for (var i = 0; i < newA.length; i++) {
            var idstr = '"id":' + '"' + newA[i].id + '",';
            var indexIX = str.lastIndexOf(idstr);
            var temp = '';
            if (indexIX != -1) {
                temp = str.substr(indexIX);
                var newT = "{" + temp.substr(0, temp.indexOf('},{"id"')) + "}";
                if (newT != JSON.stringify(newA[i])) {
                    newOld.push(newA[i].id);
                    str = str.replace(newT, JSON.stringify(newA[i]));
                }
            }
        }
        return { oldA: JSON.parse(str.replace(/,]$/, ']')), 'changeOld': newOld, newA: newA };
    },

    stripscript: function stripscript(s) {
        var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
            regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

        if (regEn.test(s) || regCn.test(s)) {
            //alert("名称不能包含特殊字符.");
            return false;
        }
        return true;
    },
    //时间转换
    time: function time(data, fromat) {
        var datavalue = data;
        if (typeof datavalue == 'number') {
            datavalue = new Date(data);
        }
        if (fromat && fromat.length != 0) {
            fromat = fromat.replace(/yyyy/g, datavalue.getFullYear());
            fromat = fromat.replace(/mm/g, ('0' + (datavalue.getMonth() * 1 + 1)).slice(-2));
            fromat = fromat.replace(/dd/g, ('0' + datavalue.getDate() * 1).slice(-2));
            fromat = fromat.replace(/HH/g, ('0' + datavalue.getHours() * 1).slice(-2));
            fromat = fromat.replace(/MM/g, ('0' + datavalue.getMinutes() * 1).slice(-2));
            fromat = fromat.replace(/ss/g, ('0' + datavalue.getSeconds() * 1).slice(-2));
        } else {
            data.getFullYear() + "-" + ('0' + (data.getMonth() * 1 + 1)).slice(-2) + '-' + ('0' + data.getDate()).slice(-2);
        }
        return fromat;
    },
    timestr: function timestr(data, value) {
        value = value || [{ num: 4, zf: '-' }, { num: 2, zf: '-' }, { num: 2, zf: ' ' }, { num: 2, zf: ':' }, { num: 2, zf: ':' }, { num: 2, zf: '' }];
        var str = "";
        var st = 0;
        for (var i = 0; i < value.length; i++) {
            str += data.substr(st, value[i].num) + value[i].zf;
            st += value[i].num;
        }
        return str;
    },


    //设置文本框的光标
    set_text_value_position: function set_text_value_position(objId, spos) {
        var tobj = document.getElementById(objId);
        if (spos < 0) spos = tobj.value.length;
        if (tobj.setSelectionRange) {
            //兼容火狐,谷歌
            setTimeout(function () {
                tobj.setSelectionRange(spos, spos);
                tobj.focus();
            }, 0);
        } else if (tobj.createTextRange) {
            //兼容IE
            var rng = tobj.createTextRange();
            rng.move('character', spos);
            rng.select();
        }
    },
    //获取文本框的光标
    get_txt_value_position: function get_txt_value_position(objId) {
        var oTxt1 = document.getElementById(objId);
        var cursurPosition = -1;
        if (oTxt1.selectionStart) {
            //非IE浏览器
            cursurPosition = oTxt1.selectionStart;
        } else {
            //IE
            var range = document.selection.createRange();
            range.moveStart("character", -oTxt1.value.length);
            cursurPosition = range.text.length;
        }
        return cursurPosition;
        //alert(cursurPosition);
    },
    //数字装换
    changeNumtoChina: function changeNumtoChina(value) {
        var numC = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三'];
        return numC[value - 1];
    },

    //y轴单位转化
    getUnit: function getUnit(value, num) {
        if (value * 1 < 10000 && value >= 0) {
            if (value * 1 == 0) {
                return 0.00000000.toFixed(num ? num : 2);
            }
            return value.toFixed(num ? num : 2);
        } else if (value * 1 >= 10000 && value * 1 < 100000000) {
            return (value * 1 / 10000).toFixed(num ? num : 2) + '万';
        } else if (value * 1 >= 100000000) {
            return (value * 1 / 100000000).toFixed(num ? num : 2) + '亿';
        }
        if (value < 0 && value * 1 > -10000) {
            return value.toFixed(num ? num : 0);
        } else if (value * 1 <= -10000 && value * 1 > -100000000) {
            return (value * 1 / 10000).toFixed(num ? num : 2) + '万';
        } else if (value * 1 <= -100000000) {
            return (value * 1 / 10000).toFixed(num ? num : 2) + '亿';
        }
    },
    //单位的另外转换模式

    getUnitNew: function getUnitNew(value, max, min) {
        var objeC = {};
        if (min == 0) {
            objeC = Tool.getChuUnit(max);
        } else if (min > 0) {
            objeC = Tool.getChuUnit(min * 10);
        } else if (min < 0) {
            if (max > 0) {
                if (value > 0) {
                    objeC = Tool.getChuUnit(max);
                } else {
                    objeC = Tool.getChuUnit(Math.abs(min));
                }
            } else if (max <= 0) {
                objeC = Tool.getChuUnit(Math.abs(min));
            }
        }
        return value / objeC.chushu + objeC.danwei;
    },

    getChuUnit: function getChuUnit(value) {
        var chushu = 0;
        var danwei = '';
        if (value >= 100000000) {
            chushu = 100000000;
            danwei = '亿';
        } else if (value < 100000000 & value >= 10000) {
            chushu = 10000;
            danwei = '万';
        } else {
            chushu = 1;
        }
        return {
            chushu: chushu,
            danwei: danwei
        };
    },

    //对象克隆
    clone: function clone(value) {
        var temp = {};
        for (var k in value) {
            if (value[k] != undefined || value[k] != null) {
                temp[k] = value[k];
            }
        }
        return temp;
    },
    //纯数值转换 format
    //[显示模式，小数位，千分位，单位]
    //所有的值都可以为空
    //显示模式分为： ‘显示数值’ ‘显示百分数’  这两种
    //顺序是先单位，随后小数位，随后千分位
    //单位代表以什么单位聚合，有4种情况  默认，无，万，千
    //小数位为保留几位小数
    //千分位为在数值上面增加，
    changeNumberByFromat: function changeNumberByFromat(value, format) {
        if (!value && value != 0) {
            return '--';
        }
        value = value * 1;
        var endNum;
        if (format[0] == "显示百分数") {
            endNum = (value * 100).toFixed(format[1] ? format[1] : 0) + "%";
        } else {
            switch (format[3]) {
                case "无":
                    endNum = value.toFixed(format[1] ? format[1] : 0);
                    break;
                case "万":
                    endNum = (value / 10000).toFixed(format[1] ? format[1] : 0) + "万";
                    break;
                case "亿":
                    endNum = (value / 100000000).toFixed(format[1] ? format[1] : 0) + "亿";
                    break;
                default:
                    endNum = Tool.getUnit(value, format[1] ? format[1] : 0);
                    break;

            }
            if (format[2] == 1) {
                var num;
                if (format[1] && format[1] != 0) {
                    num = endNum.split('.')[0] * 1;
                } else {
                    num = endNum.match(/[0-9]{1,}/g)[0];
                }
                endNum = endNum.replace(num, Tool.numFormat(num));
            }
        }
        return endNum;
    },

    GetDateStr: function GetDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期，不足10补0
        var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
        return y + "-" + m + "-" + d;
    },
    //表单验证
    verify: function verify(form) {
        var wrapper, item, checking, hint, reg, length, temp, i;
        var scrollTopList = [];
        var minTop;
        var data = {};
        var flag;
        var datatype = 'str';
        form.find('.verify-hint').not('.calc-hint').remove();
        form.find('.input-group').map(function () {
            wrapper = ES.selctorDoc(this);

            item = wrapper.find('input').not('[type="file"]');
            datatype = wrapper.attr('datatype') ? wrapper.attr('datatype') : 'str';
            hint = '';
            flag = true;
            switch (datatype) {
                case 'num':
                    value = 0;
                    value = Number(item.val());
                    if (isNaN(value)) {
                        hint = "该项仅可输入数字";
                    }
                    break;
                case 'str':
                    value = '';
                    value = item.val();
                    break;
                case 's':
                    value = 0;
                    value = new Date(item.val()).getTime() / 1000;
                    break;
                case 'obj':
                    value = {};
                    item.map(function () {
                        value[ES.selctorDoc(this).attr('name')] = $(this).val();
                    });
                    break;
                case 'arr':
                    value = [];
                    item.map(function () {
                        if (ES.selctorDoc(this).val()) {
                            value.push(ES.selctorDoc(this).val());
                        }
                    });
                    break;
                case 'arr-obj':
                    value = [];
                    wrapper.find('.upload-section').map(function () {
                        temp = {};
                        $(this).find('input').not('[type="file"]').map(function () {
                            if (ES.selctorDoc(this).val()) {
                                temp[ES.selctorDoc(this).attr('name')] = $(this).val();
                            }
                        });
                        if (Tool.justifyLength(temp)) {
                            value.push(temp);
                        }
                    });
                    break;
                case 'checkbox':
                    value = [];
                    item.map(function () {
                        if (ES.selctorDoc(this).prop('checked')) {
                            value.push(Number(ES.selctorDoc(this).val()));
                        }
                    });
                    break;
                // radio结果需要另外转为Number
                case 'radio':
                    value = wrapper.find('input:checked').val() || '';
                    break;
            }
            if (wrapper.hasClass('required')) {
                checking = wrapper.attr('check') ? wrapper.attr('check').split('|') : [];
                for (i in checking) {
                    reg = null;
                    if (!hint) {
                        switch (checking[i]) {
                            case 'empty':
                                hint = Tool.justifyLength(value) > 0 ? '' : '必填';
                                break;
                            case 'length':
                                length = wrapper.attr('length') || '';
                                if (length) {
                                    reg = /^[\u4e00-\u9fa5]+$/;
                                    var nwole = 0;
                                    for (var i = 0; i < value.length; i++) {
                                        if (reg.test(value.substr(i, 1))) {
                                            nwole += 2;
                                        } else {
                                            nwole += 1;
                                        }
                                    }
                                    if (Number(length) && nwole > length) {
                                        hint = '请输入' + length + '个字符或者' + Math.floor(length / 2) + '个中文字符';
                                    }
                                }
                                break;
                            case 'email':
                                reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                                if (value) {
                                    hint = reg.test(value) ? '' : '请输入正确的邮箱地址';
                                }
                                break;
                            case 'tel':
                                reg = /^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/;
                                if (value) {
                                    hint = reg.test(value) ? '' : '请输入11位正确的手机格式号码';
                                }
                                break;
                            case 'qq':
                                reg = /^[1-9]\d{1,}/;
                                if (value) {
                                    hint = reg.test(value) ? '' : '该项仅可输入数字';
                                }
                                break;
                            case 'contactMan':
                                reg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
                                if (value) {
                                    hint = reg.test(value) ? '' : '该项仅可输入中文或字母';
                                }
                                break;
                            case 'url':
                                reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
                                if (value) {
                                    hint = reg.test(value) ? '' : '请输入正确的url地址';
                                }
                                break;
                            default:
                                if (reg) {
                                    try {
                                        reg = eval(checking[i]);
                                    } catch (e) {
                                        reg = '';
                                    }
                                    if (reg) {
                                        hint = reg.test(value) ? '' : '请正确填入该项';
                                    }
                                }
                                break;
                        }
                    }
                    if (hint) {
                        if (wrapper.find('.calc-hint').length == 0) {
                            wrapper.append('<span class="verify-hint">' + hint + '</span>');
                        }
                        scrollTopList.push(wrapper.offset().top);
                        flag = false;
                        break;
                    }
                }
            }
            if (flag) {
                if (wrapper.attr('name')) {
                    data[wrapper.attr('name')] = value;
                }
            }
        });
        if (scrollTopList.length) {
            minTop = Math.min.apply(null, scrollTopList);
            minTop = minTop > 100 ? minTop - 100 : 0;
            ES.selctorDoc("body").animate({
                scrollTop: minTop
            }, 100);
            return null;
        } else {
            if (wrapper.find('.calc-hint').length != 0) {
                return null;
            }
            return data;
        }
    },
    //验证长度
    justifyLength: function justifyLength(obj) {
        var count = 0;
        if (obj.length || obj.length == 0) {
            count = obj.length;
        } else if (typeof obj === 'number') {
            count = obj;
        } else {
            for (var i in obj) {
                count++;
            }
        }
        return count;
    },
    getNowPos: function getNowPos(pos, hs, screen) {
        var nowPos = {};
        if (hs) {
            nowPos.x = pos.x;
            nowPos.y = pos.y - 100;
        } else {
            nowPos.x = pos.x - 170;
            nowPos.y = pos.y - 60;
        }
        for (var i = 0; i < screen.length; i++) {
            var info = screen[i];
            if (nowPos.x > info.x && nowPos.x < info.x + info.w && nowPos.y > info.y && nowPos.y < info.y + info.h) {
                return i;
            }
        }
        return null;
    },
    removeArrayElement: function removeArrayElement(arr, el) {
        if (arr && arr.length != 0) {
            var str = ',' + arr.toString() + ',';
            str = str.replace(',' + el + ',', ',');
            return str.pslit(',');
        } else {
            return [];
        }
    },

    changeImageToBase64: function changeImageToBase64(imgs) {
        var canvas = document.createElement('canvas');
        canvas.width = imgs.width;
        canvas.height = imgs.width;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(imgs, 0, 0);
        return canvas.toDataURL("image/png"); //.replace('data:image/png;base64,','');
    },

    //获得data
    dataToObject: function dataToObject(value, data, key) {
        //var newD = data
        for (var i = 0; i < value.length; i++) {
            if (!data[key]) {
                data[key] = [];
            }
            data[key].push(value[i].key);
            if (typeof value[i].value != 'number' && typeof value[i].value != 'string') {
                //data[value[i].key] = []
                Tool.dataToObject(value[i].value, data, value[i].key);
            } else {
                data[value[i].key] = value[i].value;
            }
        }
    },
    checkForm: function checkForm(dom, type) {
        var hint = '';
        if (dom.find('.inputBox').dom) {
            var check = dom.find('.inputBox').attr('check');
            var title = dom.find('.inputBox').attr('title') ? dom.find('.inputBox').attr('title') : '';
            var error = dom.find('.inputBox').attr('error');
            var length = parseInt(dom.find('.inputBox').attr('length'));
            var checkArr = check ? check.split('|') : [];
            var check_reg = dom.find('input').attr('reg');
            var text = dom.find('.inputBox').val();
            if (checkArr.length > 0) {
                $.each(checkArr, function (idx, val) {
                    switch (val) {
                        case 'empty':
                            if (text.length > 0) {
                                if (text.trim() == "") {
                                    if (title) {
                                        hint = title + '必填';
                                    } else {
                                        hint = '必填';
                                    }
                                    return;
                                } else {
                                    hint = '';
                                    dom.find('.verify-hint').remove();
                                }
                            } else {
                                if (title) {
                                    hint = title + '必填';
                                } else {
                                    hint = '必填';
                                }
                                return;
                            }
                            //app.local.set("empty", hint)
                            break;
                        case 'length':
                            var reg = /^[\u4e00-\u9fa5]+$/;
                            var nwole = 0;
                            for (var i = 0; i < text.length; i++) {
                                if (reg.test(text.substr(i, 1))) {
                                    nwole += 2;
                                } else {
                                    nwole += 1;
                                }
                            }
                            if (nwole > length || nwole <= 0) {
                                if (error) {
                                    hint = error;
                                } else {
                                    hint = '请输入1到' + length + '位字符';
                                }
                                return;
                            } else {
                                hint = '';
                                dom.find('.verify-hint').remove();
                            }
                            break;
                        case 'phone':
                            var reg = /^1[345789]\d{9}$/;
                            if (text != '') {
                                if (!reg.test(text)) {
                                    hint = '请输入正确的11位手机号码';
                                    return;
                                } else {
                                    hint = '';
                                    dom.find('.verify-hint').remove();
                                }
                            } else {
                                hint = '请输入正确的11位手机号码';
                                return;
                            }
                            break;
                        case 'num':
                            var reg = check_reg ? check_reg : /^\d*\.?\d+$/;
                            if (text != '') {
                                if (!eval(reg).test(text)) {
                                    if (error) {
                                        hint = error;
                                        return;
                                    } else {
                                        hint = '请输入数字';
                                    }
                                } else {
                                    hint = '';
                                    dom.find('.verify-hint').remove();
                                }
                            } else {
                                hint = error ? error : '请输入数字';
                                dom.find('.verify-hint').remove();
                                return;
                            }
                            break;
                        case 'int':
                            //正整数
                            var reg = check_reg ? check_reg : /^[1-9]\d*$/;
                            if (text != '') {
                                if (!eval(reg).test(text)) {
                                    if (error) {
                                        hint = error;
                                    } else {
                                        hint = '请输入大于等于1的整数';
                                    }
                                } else {
                                    hint = '';
                                    dom.find('.verify-hint').remove();
                                }
                            } else {
                                // hint = error?error:'请输入大于等于1的整数';
                                // dom.find('.verify-hint').remove()
                                return;
                            }
                            break;
                    }
                });
            }
        } else if (dom.find('.drop-down').dom) {
            var check1 = dom.find('.drop-down').parent().attr('check');
            if (check1) {
                var title1 = dom.find('.drop-down').parent().attr('title') ? dom.find('.drop-down').parent().attr('title') : '';
                if (dom.find('.selected1 .nowname').attr('data-idx') == '' || dom.find('.selected1 .nowname').attr('data-idx') == undefined) {
                    dom.find('.verify-hint').remove();
                    hint = '请选择' + title1;
                } else {
                    dom.find('.verify-hint').remove();
                }
            }
        } else if (dom.find('.duoxuanxlk').dom) {
            var check1 = dom.find('.duoxuanxlk').parent().attr('check');
            if (check1) {
                var title1 = dom.find('.duoxuanxlk').parent().attr('title') ? dom.find('.duoxuanxlk').parent().attr('title') : '';
                if (!dom.find('.choose').dom) {
                    dom.find('.verify-hint').remove();
                    hint = '请选择' + title1;
                } else {
                    dom.find('.verify-hint').remove();
                }
            }
        } else if (dom.find('.chooseData').dom) {
            var check1 = dom.find('.chooseData').parent().attr('check');
            if (check1) {
                var title1 = dom.find('.chooseData').parent().attr('title');
                if (dom.find('.Timers').html() == title1) {
                    dom.find('.verify-hint').remove();
                    hint = '请选择' + title1;
                } else {
                    dom.find('.verify-hint').remove();
                }
            }
        } else if (dom.find('.radio-box').dom) {
            var check1 = dom.attr('check');
            if (check1) {
                var title1 = dom.attr('title');
                if (dom.find('.choose').dom) {
                    dom.find('.verify-hint').remove();
                } else {
                    dom.find('.verify-hint').remove();
                    hint = '请选择' + title1;
                }
            }
        }
        if (type != '') {
            if (hint != '') {
                return hint;
            } else {
                return '';
            }
        } else {
            if (hint != '') {
                dom.find('.verify-hint').remove();
                dom.append('<span class="verify-hint">' + hint + '</span>');
            } else {
                return true;
            }
        }
    },
    getSigleId: function getSigleId() {
        var stum = Math.floor(Math.random() * new Date().getTime());
        var pos = Math.floor(Math.random() * 3) + 1;
        if (stum % 2 == 0) {
            return "bcd" + String(stum).substr(0, pos) + "ab" + String(stum).substr(pos + 1);
        } else {
            return "wty" + String(stum).substr(0, pos) + "xy" + String(stum).substr(pos + 1);
        }
    },

    guid: function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : r & 0x3 | 0x8;
            return v.toString(16);
        });
    },
    //[{val:'',idx:''}格式
    configxlkformat: function configxlkformat(value) {
        var arr = [];
        value.children.forEach(function (val, idx) {
            var obj = {
                idx: val.value,
                val: val.name
            };
            arr.push(obj);
        });
        return arr;
    },
    //{name:value}格式
    configobjformat: function configobjformat(value) {
        var obj = {};
        value.children.forEach(function (val, idx) {
            obj[val.value] = val.name;
        });
        return obj;
    },
    downfile: function downfile(url, app) {
        app.loading.show();
        setTimeout(function () {
            app.loading.hide();
        }, 1000);
        var a = document.createElement("a");
        var url = url + '&accessToken=' + window.localStorage.accessToken;
        a.href = url;
        a.click();
    },
    getFileType: function getFileType(filePath) {
        var startIndex = filePath.lastIndexOf(".");
        if (startIndex != -1) return filePath.substring(startIndex + 1, filePath.length).toLowerCase();else return "";
    }
};

window.Tool = window.Tool || tool;
module.exports = window.tool;

/***/ }),

/***/ 464:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var es6 = {
    Deferred: function Deferred() {
        var promiseS = {};
        var tempPromise;
        var callBackFun;
        promiseS.resolve = function (value) {
            tempPromise = new Promise(function (resolve, reject) {
                if (value) {
                    resolve(value);
                }
            });
            tempPromise.then(function (value) {
                doneBackFun(value);
            });
        };
        promiseS.reject = function (err) {
            tempPromise = new Promise(function (resolve, reject) {
                if (err) {
                    reject(err);
                }
            });
            tempPromise.then(function (value) {
                doneBackFun(value);
            });
        };
        promiseS.then = promiseS.done = function (callback) {
            callBackFun = callback;
        };

        function doneBackFun(param) {
            if (typeof callBackFun == 'function') {
                callBackFun(param);
                tempPromise = null;
            }
        }
        return promiseS;
    },
    ajax: function ajax(options) {
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        var opt = {
            type: options.type || 'get',
            url: options.url || '',

            async: options.async == false ? false : true,
            dataType: options.dataType || 'json',
            questring: options.questring || '',
            contentType: options.contentType || "application/x-www-form-urlencoded"
        };
        var str = '';
        if (opt.contentType.lastIndexOf("application/x-www-form-urlencoded") != -1) {
            for (var i in options.questring) {
                str += i + '=' + options.questring[i] + '&';
            }
            opt.questring = str.replace(/&$/g, '');
        }
        if (options.type == 'get' || options.type == 'GET') {
            if (typeof opt.questring == "string") {
                if (opt.questring) {
                    opt.questring = opt.questring.replace(/{/g, "").replace(/}/g, "").replace(/:/g, "=");
                    opt.url = opt.url + "?" + opt.questring;
                }
            } else {
                for (var _i in options.questring) {
                    str += _i + '=' + options.questring[_i] + '&';
                }
                opt.url = opt.url + "?" + str.replace(/&$/g, '');
            }
        } else {
            if (opt.questring) {
                opt.questring = JSON.stringify(opt.questring);
            }
        }

        return new Promise(function (resolve, reject) {
            xhr.open(opt.type, opt.url, opt.async);
            xhr.onreadystatechange = function () {
                // loadingHide
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        if (xhr.responseText) {
                            if (opt.dataType === 'json') {
                                var data = JSON.parse(xhr.responseText);
                            } else {
                                var data = xhr.responseText;
                            }
                            // if (afterAjxIntercept(data))
                            resolve(data);
                        } else {
                            reject(new Error('no data'));
                        }
                    } else {
                        reject(new Error(xhr.status || 'Server is fail.'));
                    }
                }
            };
            xhr.onerror = function () {
                // loadingHide
                reject(new Error(xhr.status || 'Server is fail.'));
            };
            if (window.localStorage.accessToken) {
                xhr.setRequestHeader("accessToken", window.localStorage.accessToken);
            }
            xhr.setRequestHeader("Content-type", opt.contentType);
            xhr.send(opt.questring);
        });
    },

    getBroswer: function getBroswer() {
        var sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/edge\/([\d.]+)/)) ? sys.edge = s[1] : (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? sys.ie = s[1] : (s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] : (s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] : (s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] : (s = ua.match(/opera.([\d.]+)/)) ? sys.opera = s[1] : (s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;
        if (sys.edge) return {
            broswer: "Edge",
            version: sys.edge
        };
        if (sys.ie) return {
            broswer: "IE",
            version: sys.ie
        };
        if (sys.firefox) return {
            broswer: "Firefox",
            version: sys.firefox
        };
        if (sys.chrome) return {
            broswer: "Chrome",
            version: sys.chrome
        };
        if (sys.opera) return {
            broswer: "Opera",
            version: sys.opera
        };
        if (sys.safari) return {
            broswer: "Safari",
            version: sys.safari
        };
        return {
            broswer: "",
            version: "0"
        };
    },
    eventPool: [],
    screenWH: function screenWH() {
        return {
            screenwidth: window.screen.width,
            screenheight: window.screen.height
        };
    },
    selctorDoc: function selctorDoc(selctor, parent) {
        var domname = selctor;
        var eventA = {};
        var query = {};

        function findDom(name, doc) {
            if (doc) {
                return doc.querySelectorAll(name);
            } else {
                return [];
            }
        }

        function parentE(element) {
            return element.parentNode;
        }

        function addEvent(element, e, fn) {
            if (typeof fn == 'function' && element) {
                var hascodeD = hashCode(element.outerHTML);
                //console.log(element)
                ES.eventPool.push({
                    e: element,
                    type: e,
                    fn: fn
                });
                if (element.addEventListener) {
                    element.addEventListener(e, fn, false);
                } else {
                    element.attachEvent("on" + e, fn);
                }
            }
        }

        function removeEvent(element, e) {
            //console.log(element,e,eventPool)
            if (element) {
                for (var j = 0; j < ES.eventPool.length; j++) {
                    //console.log(eventPool[j],e,"=================")
                    if (ES.eventPool[j]) {

                        if (ES.eventPool[j].e == element && ES.eventPool[j].type == e) {
                            //console.log(element,e,"=================")
                            if (element.addEventListener) {
                                element.removeEventListener(ES.eventPool[j].type, ES.eventPool[j].fn, false);
                            } else {
                                element.detachEvent("on" + ES.eventPool[j].type, ES.eventPool[j].fn);
                            }
                            ES.eventPool[j] = null;
                        }
                    }
                }
                ES.eventPool.filter(function (d) {
                    return d;
                });
            }
        }

        function setAllBox(element) {
            var tempNode = element;
            if (tempNode == window) {
                tempNode = document.documentElement;
            }
            if (tempNode == document) {
                tempNode = document.body;
            }
            if (element) {
                return {
                    clientWidth: tempNode.clientWidth, //元素的可见高度
                    clientHeight: tempNode.clientHeight, //元素的可见宽度
                    offsetHeight: tempNode.offsetHeight, //元素的高度
                    offsetWidth: tempNode.offsetWidth, //元素的宽度
                    offsetLeft: tempNode.offsetLeft, //元素的水平偏移位置
                    offsetParent: tempNode.offsetParent, //元素的偏移容器
                    offsetTop: tempNode.offsetTop, //元素的垂直偏移位置
                    scrollHeight: tempNode.scrollHeight, //元素的整体高度
                    scrollLeft: tempNode.scrollLeft, //元素左边缘与视图之间的距离
                    scrollTop: tempNode.scrollTop, //元素上边缘与视图之间的距离
                    scrollWidth: tempNode.scrollWidth //元素的整体宽度
                };
            } else {
                return {
                    clientWidth: 0, //元素的可见高度
                    clientHeight: 0, //元素的可见宽度
                    offsetHeight: 0, //元素的高度
                    offsetWidth: 0, //元素的宽度
                    offsetLeft: 0, //元素的水平偏移位置
                    offsetParent: 0, //元素的偏移容器
                    offsetTop: 0, //元素的垂直偏移位置
                    scrollHeight: 0, //元素的整体高度
                    scrollLeft: 0, //元素左边缘与视图之间的距离
                    scrollTop: 0, //元素上边缘与视图之间的距离
                    scrollWidth: 0 //元素的整体宽度
                };
            }
        }
        //将html转化为hascode
        function hashCode(strKey) {
            if (!strKey) {
                return null;
            }
            var hash = 0;
            for (var i = 0; i < strKey.length; i++) {
                hash = hash * 31 + strKey.charCodeAt(i);
                hash = intValue(hash);
            }
            return hash;
        }

        function intValue(num) {
            var MAX_VALUE = 0x7fffffff;
            var MIN_VALUE = -0x80000000;
            if (num > MAX_VALUE || num < MIN_VALUE) {
                return num &= 0xFFFFFFFF;
            }
            return num;
        }
        //-----------------
        function domCollect(dom) {
            if (dom == window) {
                return [{
                    dom: dom.document.body
                }];
            }
            if (dom == document) {
                return [{
                    dom: dom
                }];
            }
            // console.log(dom)
            if (!dom) {
                return [{
                    dom: null
                }];
            }
            if (dom.length == undefined || dom.length == null) {
                return [{
                    dom: dom
                }];
            }
            if (dom.toString().lastIndexOf('HTML') != -1) {
                return [{
                    dom: dom
                }];
            }

            return dom;
        }

        function cloneNode(value) {
            if (typeof value == "string") {
                var tempDIV = document.createElement('div');
                tempDIV.innerHTML = value;
                var cloneO = tempDIV.cloneNode(true).childNodes;
                return [].concat(_toConsumableArray(cloneO));
            }
            return null;
        }

        function changeToQueryObject(nodeList) {
            var tempArray = [].concat(_toConsumableArray(nodeList));
            var returnArray = [];
            tempArray.map(function (item) {
                returnArray.push(ES.selctorDoc(item));
            });
            return returnArray;
        }

        function deepClone(obj) {
            var proto = Object.getPrototypeOf(obj);
            return Object.assign({}, Object.create(proto), obj);
        }

        function translate(value) {
            if (typeof value == 'string') {
                if (value.lastIndexOf('left') != -1) {
                    return value.replace('-l', 'L');
                }
                if (value.lastIndexOf('top') != -1) {
                    return value.replace('-t', 'T');
                }
                if (value.lastIndexOf('right') != -1) {
                    return value.replace('-r', 'R');
                }
                if (value.lastIndexOf('bottom') != -1) {
                    return value.replace('-b', 'B');
                }
                return value;
            }
            return value;
        }

        function getNextparent(dom, tempNode, className) {

            var pnode = parentE(dom);
            //console.log(pnode)
            if (pnode) {
                if (className) {
                    if (ES.selctorDoc(pnode).hasClass(className)) {
                        tempNode.push(ES.selctorDoc(pnode));
                    }
                } else {
                    tempNode.push(ES.selctorDoc(pnode));
                }
                getNextparent(ES.selctorDoc(pnode).dom, tempNode, className);
            }
        }
        //--------------------------------------------------------------
        //---------------------------共有函数---------------------------
        query.init = function (name, doc) {
            var array = [];
            if (typeof domname === 'string') {
                var nameArray = domname.split(' ');
                var parentDom = doc ? doc : document;
                var dom = findDom(domname, parentDom);
                array = changeToQueryObject(dom);
                return array;
            }
        };
        //---------------------------dom节点查找---------------------------
        query.find = function (name) {
            var tempNodeList;
            var tempDom = domCollect(this.dom);
            tempDom.map(function (item) {
                var nodeList = findDom(name, item.dom);
                if (nodeList.length) {
                    if (!tempNodeList) {
                        tempNodeList = changeToQueryObject(nodeList);
                    } else {
                        tempNodeList = tempNodeList.concat(changeToQueryObject(nodeList));
                    }
                }
            });
            var obj = deepClone(this);
            obj.dom = tempNodeList;
            return obj;
        };
        query.parent = function () {
            if (this.dom == document || this.dom == window) {} else {
                var tempNode = [];
                var dom = domCollect(this.dom);
                dom.map(function (item) {
                    var pnode = parentE(item.dom);
                    //console.log(pnode)
                    if (pnode) {
                        tempNode.push(ES.selctorDoc(pnode));
                    }
                });
                var obj = deepClone(this);
                obj.dom = tempNode;
                return obj;
            }
        };
        query.parents = function (className) {
            if (this.dom == document || this.dom == window) {} else {
                var tempNode = [];
                var dom = domCollect(this.dom);
                dom.map(function (item) {
                    getNextparent(item.dom, tempNode, className);
                });
                /*dom.map(function(item) {
                    let pnode = parentE(item.dom)
                    //console.log(pnode)
                    if (pnode) {
                        tempNode.push(ES.selctorDoc(pnode))
                    }
                })*/
                var obj = deepClone(this);
                obj.dom = tempNode;
                //console.log(obj)
                return obj;
            }
        };
        query.eq = function (index) {
            var dom = domCollect(this.dom);
            var obj = deepClone(this);
            if (index < 0) {
                obj.dom = [dom[dom.length + index]];
            } else {
                obj.dom = [dom[index]];
            }
            return obj;
        };
        query.firstchildren = function (name) {
            var tempNodeList = [];
            var tempDom = domCollect(this.dom);
            //console.log(tempDom)
            tempDom.map(function (item) {
                var nodeList = item.dom.querySelector(name);
                if (nodeList) {
                    tempNodeList.push(ES.selctorDoc(nodeList));
                }
            });
            var obj = deepClone(this);
            obj.dom = tempNodeList;
            return obj;
        };
        //---------------------------属性---------------------------
        query.attr = function (attrName, value) {
            if (this.dom == document || this.dom == window) {
                var tempDom = this.dom == window ? this.dom.document.body : this.dom.body;
                if (value != undefined && value != null) {
                    tempDom.setAttribute(attrName, value);
                } else {
                    return tempDom.getAttribute(attrName);
                }
            } else {
                var tempDom = domCollect(this.dom);
                if (value != undefined && value != null) {
                    var tempDom = domCollect(this.dom);
                    tempDom.map(function (item) {
                        item.dom.setAttribute(attrName, value);
                    });
                } else {
                    var tempDomObj = tempDom[tempDom.length - 1].dom;
                    if (tempDomObj && tempDomObj.getAttribute) {
                        return tempDomObj.getAttribute(attrName);
                    }
                }
            }
        };
        query.removeAttr = function (attrName) {
            if (this.dom == document || this.dom == window) {
                var tempDom = this.dom == window ? this.dom.document.body : this.dom.body;
                tempDom.removeAttribute(attrName);
            } else {
                var _tempDom = domCollect(this.dom);
                _tempDom.map(function (item) {
                    item.dom.removeAttribute(attrName);
                });
            }
        };
        query.val = function (value) {
            if (this.dom != window && this.dom != document) {
                if (value != null && value != undefined) {
                    if (this.dom.length) {
                        this.dom.map(function (item) {
                            item.dom.value = value;
                        });
                    } else {
                        this.dom.value = value;
                    }
                } else {
                    var tempDom = domCollect(this.dom);
                    var dom = tempDom[tempDom.length - 1].dom;
                    if (dom.selectedIndex || dom.selectedIndex == 0) {
                        var index = dom.selectedIndex;
                        return dom.options[index].value ? dom.options[index].value : dom.options[index].text;
                    }
                    return tempDom[tempDom.length - 1].dom.value;
                }
            }
        };
        query.box = function () {
            if (this.dom != window && this.dom != document) {
                var dom = domCollect(this.dom);
                if (dom && dom[dom.length - 1]) {
                    return setAllBox(dom[dom.length - 1].dom);
                } else {
                    return setAllBox();
                }
            } else {
                return setAllBox(this.dom);
            }
        };
        query.hide = function () {
            var dom = domCollect(this.dom);
            dom.map(function (item) {
                if (item.dom) {
                    item.dom.style.display = 'none';
                }
            });
        };
        query.show = function () {
            var dom = domCollect(this.dom);
            dom.map(function (item) {
                if (item.dom) {
                    item.dom.style.display = 'block';
                }
            });
        };
        //---------------------------样式---------------------------
        query.addClass = function (className) {
            if (this.dom == document || this.dom == window) {
                var tempDom = this.dom == window ? this.dom.document.body : this.dom.body;
                var nowName = tempdom.className ? tempdom.className : '';
                nowName += ' ' + className;
                tempdom.setAttribute('class', nowName);
            } else {
                var _tempDom2 = domCollect(this.dom);
                _tempDom2.map(function (item) {
                    if (item.dom) {
                        var nowName = item.dom.className ? item.dom.className : '';
                        nowName = nowName ? nowName : '';
                        nowName += ' ' + className;
                        item.dom.setAttribute('class', nowName);
                    }
                });
            }
        };
        query.removeClass = function (className) {
            if (this.dom == document || this.dom == window) {
                var tempDom = this.dom == window ? this.dom.document.body : this.dom.body;
                var nowName = tempDom.getAttribute('class') ? ' ' + tempDom.getAttribute('class') + ' ' : '';
                var patt1 = new RegExp(' ' + className + " ", "g");
                nowName = nowName.replace(/ /g, "  ").replace(patt1, ' ').replace(/  /g, " ");
                tempDom.setAttribute('class', nowName);
            } else {
                var _tempDom3 = domCollect(this.dom);
                _tempDom3.map(function (item) {
                    if (item.dom) {
                        var nowName = item.dom.getAttribute('class') ? ' ' + item.dom.getAttribute('class') + ' ' : '';
                        var patt1 = new RegExp(' ' + className + " ", "g");
                        nowName = nowName.replace(/ /g, "  ").replace(patt1, ' ').replace(/  /g, " ");
                        item.dom.setAttribute('class', nowName);
                    }
                });
            }
        };
        query.hasClass = function (className) {
            var tempDom = void 0;
            var nowName = void 0;
            if (this.dom == document || this.dom == window) {
                tempDom = this.dom == window ? this.dom.document.body : this.dom.body;
            } else {
                var tempDDom = domCollect(this.dom);
                tempDom = tempDDom[tempDDom.length - 1].dom;
            }
            nowName = tempDom.className ? ' ' + tempDom.className + " " : '';
            if (nowName) {
                if (nowName.lastIndexOf(' ' + className + ' ') != -1) {
                    return true;
                }
            }
            return false;
        };
        query.css = function (value) {
            if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object' && !value.length) {
                var dom = domCollect(this.dom);
                dom.map(function (item) {
                    if (item.dom) {
                        for (var _i2 in value) {
                            var data = value[_i2];
                            if (typeof value[_i2] != 'string' && _i2 != 'opacity') {
                                data = value[_i2] + 'px';
                            }
                            _i2 = translate(_i2);
                            //console.log(item.dom.style)
                            if (item.dom.style[_i2] != null || item.dom.style[_i2] != undefined) {
                                item.dom.style[_i2] = data;
                            }
                        }
                    }
                });
            }
        };
        //---------------------------事件操作---------------------------
        query.on = function (event, callFun) {
            if (this.dom == document || this.dom == window) {
                addEvent(this.dom, event, callFun);
            } else {
                // console.log(this)
                var tempDDom = domCollect(this.dom);
                tempDDom.map(function (item) {
                    if (typeof callFun == 'function') {
                        addEvent(item.dom, event, callFun);
                    }
                });
            }
        };
        query.off = function (event) {
            //console.log("here")
            if (this.dom == document || this.dom == window) {
                removeEvent(this.dom, event);
            } else {
                var tempDDom = domCollect(this.dom);
                tempDDom.map(function (item) {
                    if (item.dom) {
                        removeEvent(item.dom, event);
                    }
                });
            }
            //console.log('there')
        };
        query.resize = function (callfun) {
            if (this.dom == window && typeof callfun == 'function') {
                window.onresize = callfun;
            }
        };
        query.hashchange = function (callfun) {
            if (this.dom == window && typeof callfun == 'function') {
                window.onhashchange = callfun;
            }
        };
        query.focus = function (callfun) {
            if ((this.dom != window || this.dom != document) && typeof callfun == 'function') {
                this.dom.map(function (item) {
                    if (item.dom) {
                        item.dom.onfocus = callfun;
                    }
                });
            }
        };
        query.blur = function (callfun) {
            if ((this.dom != window || this.dom != document) && typeof callfun == 'function') {
                this.dom.map(function (item) {
                    if (item.dom) {
                        item.dom.onblur = callfun;
                    }
                });
            }
        };
        query.change = function (callfun) {
            if ((this.dom != window || this.dom != document) && typeof callfun == 'function') {
                this.dom.map(function (item) {
                    if (item.dom) {
                        item.dom.onchange = callfun;
                    }
                });
            }
        };
        query.keydown = function (callfun) {
            if ((this.dom != window || this.dom != document) && typeof callfun == 'function') {
                this.dom.map(function (item) {
                    if (item.dom) {
                        item.dom.onkeydown = callfun;
                    }
                });
            }
        };
        query.click = function () {
            var dom = domCollect(this.dom);
            dom.map(function (item) {
                item.dom.click();
            });
        };
        query.dblclick = function () {
            var dom = domCollect(this.dom);
            dom.map(function (item) {
                item.dom.dblclick();
            });
        };
        //---------------------------节点操作---------------------------
        query.html = function (value) {
            if (value == undefined || value == null) {
                if (this.dom == document || this.dom == window) {
                    var tempDom = this.dom == window ? this.dom.document.body : this.dom.body;
                    return tempDom.innerHTML;
                } else {
                    var tempDDom = domCollect(this.dom);
                    if (tempDDom[tempDDom.length - 1].dom) {
                        return tempDDom[tempDDom.length - 1].dom.innerHTML;
                    } else {
                        return '';
                    }
                }
            } else {
                if (this.dom == document || this.dom == window) {
                    var tempDom = this.dom == window ? this.dom.document.body : this.dom.body;
                    tempDom.innerHTML = value;
                } else {
                    var _tempDDom = domCollect(this.dom);
                    _tempDDom.map(function (item) {
                        if (item.dom) {
                            item.dom.innerHTML = value;
                        }
                    });
                    //return this.dom[this.dom.length - 1].dom.innerHTML
                }
            }
        };
        query.append = function (value) {
            if (value != undefined && value != null) {
                var dom = domCollect(this.dom);
                var nodelist = cloneNode(value);
                if (nodelist) {
                    dom.map(function (item) {
                        nodelist.map(function (vnode) {
                            item.dom.appendChild(vnode);
                        });
                    });
                }
            }
        };
        query.prepend = function (value) {
            if (value != undefined && value != null) {
                var dom = domCollect(this.dom);
                var nodelist = cloneNode(value);
                if (nodelist) {
                    dom.map(function (item) {
                        for (var _i3 = nodelist.length - 1; _i3 >= 0; _i3--) {
                            item.dom.insertBefore(nodelist[_i3], item.dom.childNodes[0]);
                        }
                    });
                }
            }
        };
        query.before = function (value) {
            if (value != undefined && value != null) {
                var dom = domCollect(this.dom);
                var nodelist = cloneNode(value);
                if (nodelist) {
                    //console.log(dom, nodelist, nodelist.length)
                    dom.map(function (item) {
                        nodelist.map(function (vnode) {
                            item.dom.parentNode.insertBefore(vnode, item.dom);
                        });
                    });
                }
            }
        };
        query.after = function (value) {
            if (value != undefined && value != null) {
                var dom = domCollect(this.dom);
                var nodelist = cloneNode(value);
                if (nodelist) {
                    console.log(dom, nodelist);
                    dom.map(function (item) {
                        for (var _i4 = nodelist.length - 1; _i4 >= 0; _i4--) {
                            item.dom.parentNode.insertBefore(nodelist[_i4], item.dom.nextSibling);
                        }
                    });
                }
            }
        };
        query.remove = function () {
            var dom = domCollect(this.dom);
            dom.map(function (item) {
                if (item.dom) {
                    item.dom.parentNode.removeChild(item.dom);
                }
            });
            this.dom = [];
        };
        if (typeof domname === 'string') {
            query.dom = query.init(domname, parent);
        } else {
            query.dom = selctor;
            var otherAttr = setAllBox(query.dom);
            for (var i in otherAttr) {
                query[i] = otherAttr[i];
            }
        }
        //console.log(query)
        return query;
    }
};

window.ES = window.ES || es6;
module.exports = window.ES;

/***/ }),

/***/ 465:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function animationCSS() {
    var st = void 0;
    var et = void 0;
    var callbackTime = void 0;
    var cssAnimation = {
        play: function play(el, key, callback) {
            cssAnimation.stop(el);
            el.css({ "transitionProperty": "all", "MozTransitionProperty": "all", "WebkitTransitionProperty": "all", "OTransitionProperty": "all" });
            et = key.et;
            el.css(returnCssPos(key.st.x, key.st.y, key.st.r, key.st.s, key.st.o));
            key.fun ? key.fun : "linear";
            el.css(returnCssTime(0, key.fun, 0));
            key.time = key.time ? key.time : 0.3;
            key.delay = key.delay ? key.delay : 0;
            el.css(returnCssPos(key.et.x, key.et.y, key.et.r, key.et.s, key.et.o));
            el.css(returnCssTime(key.time, key.fun, key.delay));
            if (typeof callback == "function") {
                var intervalT = (key.time + key.delay) * 1000;
                callbackTime = setTimeout(function () {
                    callback();
                }, intervalT);
            }
        },
        clearTimeObj: function clearTimeObj() {
            clearTimeout(callbackTime);
            callbackTime = null;
        },
        stop: function stop(el) {
            if (callbackTime) {
                clearTimeout(callbackTime);
                callbackTime = null;
            }
            el.css({ "transitionProperty": "none", "MozTransitionProperty": "none", "WebkitTransitionProperty": "none", "OTransitionProperty": "none" });
        },
        fadeIn: function fadeIn(el, key, callback) {
            var obj2 = {};
            if (key) {
                Object.assign(obj2, key);
            }
            obj2.st = { o: 0 };
            obj2.et = { o: 1 };
            cssAnimation.play(el, obj2, callback);
            obj2.time = obj2.time ? obj2.time : 0.3;
            obj2.delay = obj2.delay ? obj2.delay : 0;
            var intervalT = (obj2.time + obj2.delay) * 1000;
            setTimeout(function () {
                el.css({ 'opacity': '' });
            }, intervalT);
            el.show();
        },
        fadeOut: function fadeOut(el, key, callback) {
            var obj2 = {};
            if (key) {
                Object.assign(obj2, key);
            }
            obj2.st = { o: 1 };
            obj2.et = { o: 0 };
            cssAnimation.play(el, obj2, callback);
            obj2.time = obj2.time ? obj2.time : 0.3;
            obj2.delay = obj2.delay ? obj2.delay : 0;
            var intervalT = (obj2.time + obj2.delay) * 1000;
            setTimeout(function () {
                el.css({ 'opacity': '' });
                el.hide();
            }, intervalT);
            el.show();
        }
    };

    function returnCssTime(duration, fun, delay) {
        var tempObj = {};
        if (duration != null && duration != undefined) {
            tempObj["transitionDuration"] = duration + "s";
            tempObj["MozTransitionDuration"] = duration + "s";
            tempObj["WebkitTransitionDuration"] = duration + "s";
            tempObj["OTransitionDuration"] = duration + "s";
            tempObj["msTransitionDuration"] = duration + "s";
        }
        if (fun != null && fun != undefined) {
            tempObj["transitionTimingFunction"] = fun;
            tempObj["MozTransitionTimingFunction"] = fun;
            tempObj["WebkitTransitionTimingFunction"] = fun;
            tempObj["OTransitionTimingFunction"] = fun;
            tempObj["msTransitionTimingFunction"] = fun;
        }
        if (delay != null && delay != undefined) {
            tempObj["transitionDelay"] = delay + "s";
            tempObj["MozTransitionDelay"] = delay + "s";
            tempObj["WebkitTransitionDelay"] = delay + "s";
            tempObj["OTransitionDelay"] = delay + "s";
            tempObj["msTransitionDelay"] = delay + "s";
        }
        return tempObj;
    }

    function returnCssPos(x, y, r, s, o) {
        var tempObj = {};
        var xy = '';
        if (x != null && x != undefined || y != null && y != undefined) {
            if (typeof x != "string") {
                x = x ? x + 'px' : '0px';
            }
            if (typeof y != "string") {
                y = y ? y + 'px' : '0px';
            }
            xy = 'translate(' + x + "," + y + ')';
        }
        if (r != null && r != undefined) {
            xy = xy ? xy + ' rotate(' + r + 'deg)' : 'rotate(' + r + 'deg)';
        }
        if (s != null && s != undefined) {
            xy = xy ? xy + ' scale(' + s + ')' : 'scale(' + s + ')';
        }
        tempObj["transform"] = xy;
        tempObj["MozTransform"] = xy;
        tempObj["WebkitTransform"] = xy;
        tempObj["OTransform"] = xy;
        tempObj["msTransform"] = xy;
        if (o != null && o != undefined) {
            tempObj['opacity'] = o;
        }
        return tempObj;
    }
    return cssAnimation;
}

window.animation = window.animation || new animationCSS();
module.exports = window.animation;

/***/ }),

/***/ 466:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pagesBase = function () {
  function pagesBase(app, api, dom, model, cash) {
    _classCallCheck(this, pagesBase);

    this.app = app;
    this.api = api || null;
    this.dom = dom || ES.selctorDoc('#content #right-content');
    this.model = model || null;
    this.cash = cash || false;
    this.styleModel(0);
    this.complete();
  }

  _createClass(pagesBase, [{
    key: 'complete',
    value: function complete() {}
  }, {
    key: 'dispose',
    value: function dispose() {}
  }, {
    key: 'styleModel',
    value: function styleModel(type) {
      //console.log('yes i do',type)
      ES.selctorDoc('#header').find('.header').removeClass('yisheng');
      switch (type) {
        case 0:
          ES.selctorDoc('#menu').show();
          ES.selctorDoc('#bottom').show();
          ES.selctorDoc('#content').css({ width: ES.selctorDoc(window).box().clientWidth - 200 });
          break;
        case 1:
          ES.selctorDoc('#menu').hide();
          ES.selctorDoc('#header').find('.header').addClass('yisheng');
          ES.selctorDoc('#content').css({ width: '100%' });
          break;
      }
    }
  }, {
    key: 'resize',
    value: function resize() {}
  }]);

  return pagesBase;
}();

window.Interstellar = window.Interstellar || {};
window.Interstellar.pagesBase = window.Interstellar.pagesBase || pagesBase;
module.exports = pagesBase;

/***/ }),

/***/ 467:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var moduleBase = function () {
    function moduleBase(app, dom, value, addMode) {
        _classCallCheck(this, moduleBase);

        this.app = app;
        this.dom = dom;
        this.nowParam = value;
        this.initDate = value;
        this._eventControl = new Interstellar.event();
        this.addMode = addMode || 'html';
        this.foriedA = ['app', 'dom', 'event', 'nowParam', 'init'];
    }

    _createClass(moduleBase, [{
        key: 'init',
        value: function init() {
            switch (this.addMode) {
                case 'html':
                    this.dom.html(this.app.renderTemplate(this.html, this.initDate));
                    break;
                case 'append':
                    this.dom.append(this.app.renderTemplate(this.html, this.initDate));
                    break;
                case "prepend":
                    this.dom.append(this.app.renderTemplate(this.html, this.initDate));
                    break;
            }
            if (this.app.languageMode) {
                var moduleName = this.initDate ? this.initDate.moduleName : null;
                this.app.languageMode.setTranslate(this.dom.find('[data-i18n]').dom, this.app.language, moduleName || this.name);
            }
            this.complete();
        }
    }, {
        key: 'attrA',
        value: function attrA(key, value) {
            if (value != undefined) {
                if (this.foriedA.search(key) == -1) {
                    this[key] = value;
                }
            } else {
                return this[key];
            }
        }
    }, {
        key: 'complete',
        value: function complete() {}
    }, {
        key: 'show',
        value: function show() {
            this.dom.show();
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.dom.hide();
        }
    }, {
        key: 'dispose',
        value: function dispose() {}
    }, {
        key: 'moduleData',
        get: function get() {
            return this.nowParam;
        },
        set: function set(value) {
            this.nowParam = value;
        }
    }, {
        key: 'event',
        get: function get() {
            return this._eventControl;
        },
        set: function set(value) {
            //this.nowParam = value
        }
    }]);

    return moduleBase;
}();

window.Interstellar = window.Interstellar || {};
window.Interstellar.moduleBase = window.Interstellar.moduleBase || moduleBase;
module.exports = moduleBase;

/***/ }),

/***/ 468:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var modalBase = function () {
    function modalBase(app, value, api, addMode) {
        _classCallCheck(this, modalBase);

        this.app = app;
        this.initDate = value || null;
        this.api = api || null;
        this.app.modalId = this.app.modalId + 1;
        var zin = this.initDate ? this.initDate.zin : 1000;
        zin = zin ? zin : 1000;
        ES.selctorDoc('body').append('<div id="modal' + this.app.modalId + '" style="top:0;left:0;position: fixed;width: 100%;height: 100%;z-index:' + zin + ';"></div>');
        this.dom = ES.selctorDoc('#modal' + this.app.modalId);
        this._eventControl = new Interstellar.event();
        this.addMode = addMode || 'html';
        this.foriedA = ['app', 'dom', 'event', 'nowParam', 'init'];
    }

    _createClass(modalBase, [{
        key: 'init',
        value: function init() {
            switch (this.addMode) {
                case 'html':
                    this.dom.html(this.app.renderTemplate(this.html, this.initDate));
                    break;
                case 'append':
                    this.dom.append(this.app.renderTemplate(this.html, this.initDate));
                    break;
                case "prepend":
                    this.dom.prepend(this.app.renderTemplate(this.html, this.initDate));
                    break;
            }
            this.dom.firstchildren('.modal').css({ 'margin-top': -this.dom.firstchildren('.modal').box().scrollHeight / 2 });
            if (this.app.languageMode) {
                var moduleName = this.initDate ? this.initDate.moduleName : null;
                // console.log(this.name,this.dom.find('[data-i18n]').dom,this.name,moduleName)
                this.app.languageMode.setTranslate(this.dom.find('[data-i18n]').dom, this.app.language, moduleName || this.name);
            }
            this.complete();
        }
    }, {
        key: 'attrA',
        value: function attrA(key, value) {
            if (value != undefined) {
                if (this.foriedA.search(key) == -1) {
                    this[key] = value;
                }
            } else {
                return this[key];
            }
        }
    }, {
        key: 'complete',
        value: function complete() {}
    }, {
        key: 'show',
        value: function show() {
            this.dom.show();
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.dom.hide();
        }
    }, {
        key: 'close',
        value: function close() {
            this.dom.remove();
        }
    }, {
        key: 'dispose',
        value: function dispose() {}
    }, {
        key: 'moduleData',
        get: function get() {
            return this.nowParam;
        },
        set: function set(value) {
            this.nowParam = value;
        }
    }, {
        key: 'event',
        get: function get() {
            return this._eventControl;
        },
        set: function set(value) {
            //this.nowParam = value
        }
    }]);

    return modalBase;
}();

window.Interstellar = window.Interstellar || {};
window.Interstellar.modalBase = window.Interstellar.modalBase || modalBase;
module.exports = modalBase;

/***/ }),

/***/ 469:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var modelBase = function () {
    function modelBase(app) {
        var _this = this;

        _classCallCheck(this, modelBase);

        this.app = app;
        this._event = new Interstellar.event();
        setTimeout(function () {
            _this.checkPrivate();
        }, 0);
    }
    //保护私有变量不被污染


    _createClass(modelBase, [{
        key: 'checkPrivate',
        value: function checkPrivate() {
            var _object = this;
            var clone = {};

            var _loop = function _loop(i) {
                if (i != '_event' && typeof _object[i] != "function" && i != 'app') {
                    var temp = _object[i];
                    clone[i] = JSON.parse(JSON.stringify(temp));
                    if (i[0] === '_') {
                        Object.defineProperty(_object, i, {
                            get: function get() {
                                return clone[i];
                            },
                            set: function set() {
                                console.error("private var can't change");
                            }
                        });
                    }
                }
            };

            for (var i in _object) {
                _loop(i);
            }
        }
        //修改私有变量的值

    }, {
        key: 'setPrivate',
        value: function setPrivate(obj, propertys) {
            for (var i in propertys) {
                Object.defineProperty(obj, i, { value: propertys[i] });
            }
        }
    }, {
        key: 'getData',
        value: function getData(key) {
            return this[key];
        }
        //根据参数

    }, {
        key: 'setData',
        value: function setData(key, value) {
            if (key[0] === '_') {
                return;
            } else {
                this[key] = value;
                this._event._dispatch(key + '.change');
            }
            if (!this.app.pagerclass) {
                return;
            }
            if (typeof eval('this.app.pagerclass.' + key) === 'function') {
                if (this.___auto) {
                    eval('this.app.pagerclass.' + key + '()');
                }
            }
        }
    }, {
        key: 'clear',
        value: function clear() {
            for (var i in this) {
                if (i[0] !== '_') {
                    this[i] = null;
                }
            }
        }
    }]);

    return modelBase;
}();

window.Interstellar = window.Interstellar || {};
window.Interstellar.modelBase = window.Interstellar.modelBase || modelBase;
module.exports = modelBase;

/***/ }),

/***/ 55:
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })

/******/ });
//# sourceMappingURL=vendor.js.map