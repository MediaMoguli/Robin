N.plug("Viewport", function() {
/**
 * class Viewport extends class Publisher
 * @description this allows Viewport methods to have subscribers and be executed as custom events
 * 
 */
N.extend(Viewport, N.plugins.Publisher);

var _instance = null;
Viewport.WIDTH = (window.innerWidth || document.documentElement.clientWidth); 
Viewport.HEIGHT = (window.innerHeight || document.documentElement.clientHeight);
Viewport.HANDLE_CLASS = "handle";
Viewport.HASH = "#!/";
/**
 * @class Viewport (singleton class)
 * 
 */
function Viewport(iframes) {
	(_instance === null) && (_instance = _Viewport.call(this, iframes));
	return _instance;
}
/**
 * @constructor _Viewport
 * @access private
 * 
 * @param iframes Array (required) - Array with iframe instances (class N.CMS.IFrame)
 * @description Stores iframe instances to this.iframes object
 * 
 * @returns void
 */
function _Viewport(iframes) {
	this.Publisher();
	this.DragDropInstance = new N.plugins.DragDropDirection();
	this.iframes = {};
	this.next = { top : 0, bottom : 0, left : 0, right : 0 };
	
	if (N.isArray(iframes)) {
		this.reset();
		_store.call(this, iframes);
		_onresize.call(this);
		_ondrag.call(this);
	}
};
/**
 * @method build
 * @access public
 * 
 * @description Appends each iframe to the document and calls subscriber callbacks
 * 
 * @returns Viewport instance
 */
Viewport.prototype.build = function() {
	var i;
	
	for (i in this.iframes) {
		this.iframes[i].attributes(new LocationObject(this.iframes[i])).style(new DimensionsObject(this.iframes[i], this)).append();
	}
	_veil();
	
	this.push("build");
	return this;
};
/**
 * @method handles
 * @access public
 * 
 * @description Creates iframes resize handles
 * 
 * @returns Viewport instance
 */
Viewport.prototype.handles = function() {
	var i, handle, current;
	for (i in this.iframes) {
		current = this.iframes[i];
		if (current.config.alignment in { "left" : 0, "right" : 0, "top" : 0, "bottom" : 0 }) {
			handle = N.DOM.createPlus("div", { "class" : Viewport.HANDLE_CLASS + " " + current.config.alignment });
			N.DOM.setStyle(handle, { border : "1px solid #000", position : "absolute", backgroundColor : "#aaa", cursor : "move", width :"20px", height : "20px", zIndex : 3 });
		
			if (current.config.alignment in { "left" : 0, "right" : 0 }) {
				N.DOM.setStyle(handle, new function() { 
					this.top = parseInt(current.config.height)/2 + "px"; 
					this[current.config.alignment] = parseInt(current.config.width) + "px"; 
				});
			}
			if (current.config.alignment in { "top": 0, "bottom" : 0 }) {
				N.DOM.setStyle(handle, new function() {
					this[current.config.alignment] = parseInt(current.config.height) + "px"; 
					this.left = current.element.offsetLeft + parseInt(current.config.width)/2 + "px";
				});
			}
			N.DOM.add(handle, document.body);
		}
	}
	this.push("handles");
	return this;
};
/**
 * @method reset
 * @access public
 * 
 * @description Resets styles on body and empties it. 
 * 
 * @returns Viewport instance
 */
Viewport.prototype.reset = function() {
	document.body.style.margin = 0;
	document.body.style.padding = 0;
	document.body.style.width = /*Viewport.WIDTH + "px"*/ "100%";
	document.body.style.height = /*Viewport.HEIGHT + "px"*/ "100%";
	document.body.innerHTML = "";
	
	this.push("reset");
	return this;
};
/**
 * @method _veil
 * @access private
 * 
 * @description Creates veil "div" to cover document. 
 * Needed in order to have document filled with something (to fire events)
 * 
 * @returns void
 */
function _veil() {
	var div = N.DOM.create("div");
	N.DOM.setStyle(div, { position : "fixed", top : "0", left : "0", width : "100%", height : "100%" });
	N.DOM.add(div, document.body);
}
/**
 * @method _store
 * @access private
 * 
 * @description Stores iframe instances in an object for easy accessing
 * 
 * @returns void
 */
function _store(iframes) {
	var i = iframes.length;
	
	iframes.reverse();
	while (i--) {
		this.iframes[iframes[i].name] = iframes[i];
	}
}
/**
 * @method _onresize
 * @access private
 * 
 * @description Resizes iframes on resize event
 * 
 * @returns void
 */
function _onresize() {
	var that = this;
	N.CMS.Events.addDOMListener(window, "resize", function() {
		var i;

		Viewport.WIDTH = (window.innerWidth || document.documentElement.clientWidth); 
		Viewport.HEIGHT = (window.innerHeight || document.documentElement.clientHeight);
		
		that.next = { top : 0, bottom : 0, left : 0, right : 0 };
		for (i in that.iframes) {
			that.iframes[i].style(new DimensionsObject(that.iframes[i], that));
		}
	});
}
function _ondrag() {
	var that = this;
	N.CMS.Events.addDOMListener(document, "mousedown", function(e) {
		var target = N.Events.getTarget(e);
		if (target.className.indexOf(Viewport.HANDLE_CLASS) !== -1) {
			that.DragDropInstance.box = target;
			//that.DragDropInstance.direction = (target.className.replace(Viewport.HANDLE_CLASS + " ", "") in { "left" : 0, "right" : 0 }) ? "x" : "y";
			that.DragDropInstance.mouseMove = (target.className.replace(Viewport.HANDLE_CLASS + " ", "") in { "left" : 0, "right" : 0 }) ? that.DragDropInstance.mouseMoveX : that.DragDropInstance.mouseMoveY; 
			that.DragDropInstance.open().mouseDown();
			N.DOM.setStyle(target, { bottom : "auto", right : "auto" });
		}
	});
	N.CMS.Events.addDOMListener(document, "mousemove", function(e) {
		if (that.DragDropInstance instanceof N.DragDrop) {
			that.DragDropInstance.mouseMove(e);
		}
	});	
	N.CMS.Events.addDOMListener(document, "mouseup", function(e) {
		that.DragDropInstance.mouseUp();
	});
}
/**
 * @constructor DimensionsObject
 * @access private
 * 
 * @param iframe Object (required) - instance of IFrame class
 * @param that Object (required) - Viewport class current instance
 * @description Determines dimensions based on iframe order and type
 * 
 * @returns void
 */
function DimensionsObject(iframe, that) {
	this.height = iframe.config.height || (Viewport.HEIGHT - (that.next.top + that.next.bottom) + "px");
	this.width = iframe.config.width || (Viewport.WIDTH - (that.next.left + that.next.right) + "px");

	if (iframe.config.alignment === "top" || iframe.config.alignment === "bottom") {
		this.left = iframe.config.left || (that.next.left + "px");
		this[iframe.config.alignment] = iframe.config[iframe.config.alignment] || (that.next[iframe.config.alignment] + "px");
		that.next[iframe.config.alignment] += parseInt(this.height);
	
	} else if (iframe.config.alignment === "left" || iframe.config.alignment === "right") {
		this.top = iframe.config.top || (that.next.top + "px");
		this[iframe.config.alignment] = iframe.config[iframe.config.alignment] || (that.next[iframe.config.alignment] + "px");
		that.next[iframe.config.alignment] += parseInt(this.width);
		
	} else if (iframe.config.alignment === "center") {
		this.top = iframe.config.top || (that.next.top + "px");
		this.left = iframe.config.left || (that.next.left + "px");
	}
}
/**
 * @constructor LocationObject
 * @access private
 * 
 * @param iframe Object (required) - instance of IFrame class
 * @description Extracts file path from location.href
 * 
 * @returns void
 */
function LocationObject(iframe) {
	if (iframe.config.src) {
		(iframe.config.src.indexOf(Viewport.HASH) !== -1) && (this.src = location.href.split(Viewport.HASH)[1]);
	}
}
/**
 * @method getInstance
 * @access public static
 * 
 * @description get current instance or create new one if not present
 * 
 * @returns Viewport instance
 */
Viewport.getInstance = function(iframes) {
	return new Viewport(iframes);
};

return Viewport;
});