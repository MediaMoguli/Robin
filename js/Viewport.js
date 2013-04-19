N.plug("Viewport", function() {
/** 
 * class Viewport extends class Publisher
 * @description this allows Viewport methods to have subscribers and be executed as custom events
 * 
 */
N.extend(Viewport, N.plugins.Publisher);

Viewport.WIDTH = (window.innerWidth || document.documentElement.clientWidth); 
Viewport.HEIGHT = (window.innerHeight || document.documentElement.clientHeight);
Viewport.HANDLE_CLASS = "handle";
Viewport.HASH = "#!/";

/**
 * @class Viewport (singleton class)
 * 
 */
function Viewport(iframes) {
	this.Viewport(iframes);
}
/**
 * @constructor Viewport
 * @access public
 * 
 * @param iframes Array (required) - Array with iframe instances (class N.CMS.IFrame)
 * @description Stores iframe instances to this.iframes object
 * 
 * @returns void
 */
Viewport.prototype.Viewport = function(iframes) {
	this.Publisher();
	this.DragDropInstance = {};
	this.iframes = {};
	this.veil = null;
	this.next = { top : 0, bottom : 0, left : 0, right : 0 };
	
	if (N.isArray(iframes)) {
		_store.call(this, iframes);
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
	
	this.reset();
	for (i in this.iframes) {
		this.iframes[i].attributes(new LocationObject(this.iframes[i])).style(new DimensionsObject(this.iframes[i], this)).append();
	}
	_veil.call(this);
	
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
			handle = N.DOM.create("div", { "class" : Viewport.HANDLE_CLASS + " " + current.config.alignment });
			N.DOM.style(handle, { border : "1px solid #000", position : "absolute", backgroundColor : "#aaa", cursor : "move", width :"20px", height : "20px", zIndex : 3 });
			N.DOM.style(handle, new HandlesPositionObject(current, this));
			
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
	N.DOM.style(document.body, { margin : 0, padding : 0, width : "100%", height : "100%" });
	document.body.innerHTML = "";
	
	this.push("reset");
	return this;
};
/**
 * @method resize
 * @access public
 * 
 * @description Resizes iframes based on handle. 
 * 
 * @returns Viewport instance
 */
Viewport.prototype.resize = function() {
	var alignment = this.DragDropInstance.box.className.replace(Viewport.HANDLE_CLASS + " ", ""), i;
	if (alignment === "left") {
		this.iframes.left.element.style.width = parseInt(this.iframes.left.element.style.width) + this.DragDropInstance.delta.x + "px";
		
		for (i in this.iframes) {
			if (this.iframes[i].config.alignment in { "top" : 0, "bottom" : 0, "center" : 0 }) {
				this.iframes[i].element.style.left = this.DragDropInstance.objectWindow.x + "px";
				this.iframes[i].element.style.width = parseInt(this.iframes[i].element.style.width) - this.DragDropInstance.delta.x + "px";
			}
		}
		
	} else if (alignment === "right") {
		this.iframes.right.element.style.width = parseInt(this.iframes.right.element.style.width) - this.DragDropInstance.delta.x + "px";
		// Setting left here in the future as iframes may be created with style.left instead of style.right
		
		for (i in this.iframes) {
			if (this.iframes[i].config.alignment in { "top" : 0, "bottom" : 0, "center" : 0 }) {
				this.iframes[i].element.style.width = parseInt(this.iframes[i].element.style.width) + this.DragDropInstance.delta.x + "px";
			}
		}
		
	} else if (alignment === "top") {
		this.iframes.top.element.style.height = this.DragDropInstance.objectWindow.x + "px";
		
		for (i in this.iframes) {
			if (this.iframes[i].config.alignment in { "center" : 0 }) {
				this.iframes[i].element.style.top = this.DragDropInstance.objectWindow.y + "px";
				this.iframes[i].element.style.height = parseInt(this.iframes[i].element.style.height) - this.DragDropInstance.delta.y + "px";
				break;
			}
		}
		
	} else if (alignment === "bottom") {
		this.iframes.bottom.element.style.height = parseInt(this.iframes.bottom.element.style.height) - this.DragDropInstance.delta.y + "px";
		
		for (i in this.iframes) {
			if (this.iframes[i].config.alignment in { "center" : 0 }) {
				this.iframes[i].element.style.height = parseInt(this.iframes[i].element.style.height) + this.DragDropInstance.delta.y + "px";
				break;
			}
		}
	}
	this.push("resize");
	return this;
};
/**
 * @method onresize
 * @access public
 * 
 * @description Resizes iframes on window resize. 
 * 
 * @returns void
 */
Viewport.prototype.onresize = function() {
	var i;
	this.next = { top : 0, bottom : 0, left : 0, right : 0 };
	Viewport.WIDTH = (window.innerWidth || document.documentElement.clientWidth); 
	Viewport.HEIGHT = (window.innerHeight || document.documentElement.clientHeight);
	
	for (i in this.iframes) {
		if (this.iframes[i].config.alignment in  {"top" : 0, "bottom" : 0, "center" : 0 }) {
			this.iframes[i].config.width = 0;
			(this.iframes[i].config.alignment === "center") && (this.iframes[i].config.height = 0);
		}
		this.iframes[i].style(new DimensionsObject(this.iframes[i], this));
		(this.iframes[i].config.alignment !== "center") && N.DOM.style(N.DOM.getElementsByClassName(Viewport.HANDLE_CLASS + " " + this.iframes[i].config.alignment)[0], new HandlesPositionObject(this.iframes[i], this));
	}
};
/**
 * @method ongrab
 * @access public
 * 
 * @description Mousedown on handle. 
 * @param e Object - Event object
 * @param target HTMLElement - handle itself 
 * 
 * @returns void
 */
Viewport.prototype.ongrab = function(e, target) {
	this.veil.style.display = "block";
	this.DragDropInstance = new N.plugins.DragDropDirection({ 
		box : target, 
		direction : (target.className.replace(Viewport.HANDLE_CLASS + " ", "") in { "left" : 0, "right" : 0 }) ? "x" : "y"
	});
	this.DragDropInstance.open().mouseDown(e);
	N.DOM.style(target, { bottom : "auto", right : "auto" });
};
/**
 * @method ondrag
 * @access public
 * 
 * @description Dragging handle. 
 * @param e Object - Event object
 * 
 * @returns void
 */
Viewport.prototype.ondrag = function(e) {
	if (this.DragDropInstance.mouseDownFlag) {
		this.DragDropInstance.mouseMove(e);
		this.resize();
	}
};
/**
 * @method ondrop
 * @access public
 * 
 * @description Drop handle. 
 * 
 * @returns void
 */
Viewport.prototype.ondrop = function() {
	this.veil.style.display = "none";
	this.DragDropInstance.mouseUp();
};
/**
 * @method _veil
 * @access private
 * 
 * @description Creates veil "div" to cover document. 
 * Needed in order to have document filled with something (to fire events correctly)
 * 
 * @returns void
 */
function _veil() {
	this.veil = N.DOM.create("div");
	N.DOM.style(this.veil, { position : "absolute", top : "0", left : "0", width : "100%", height : "100%", display : "none", zIndex : 2 });
	N.DOM.add(this.veil, document.body);
}
/**
 * @method _store
 * @access private
 * 
 * @description Stores iframe instances in an object for easy accessing
 * @param iframes Array
 * 
 * @returns void
 */
function _store(iframes) {
	var i = iframes.length, left = [], right = [], top = [], bottom = [], content = [];
	
	while (i--) {
		if (iframes[i].config.alignment === "left") {
			left.push(iframes[i]);
		} else if (iframes[i].config.alignment === "right") {
			right.push(iframes[i]);
		} else if (iframes[i].config.alignment === "top") {
			top.push(iframes[i]);
		} else if (iframes[i].config.alignment === "bottom") {
			bottom.push(iframes[i]);
		} else if (iframes[i].config.alignment === "center") {
			content.push(iframes[i]);
		}
	}
	iframes = left.concat(right.concat(top.concat(bottom.concat(content)))); i = iframes.length;
	iframes.reverse();
	while (i--) {
		this.iframes[iframes[i].name] = iframes[i];
	}
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
 * @constructor HandlesPositionObject
 * @access private
 * 
 * @description Sets handle position.
 * @param iframe Object (required) - instance of IFrame class
 * 
 * @returns void
 */
function HandlesPositionObject(iframe, that) {
	this.right = this.left = this.top = this.bottom = "auto";
	if (iframe.config.alignment in { "left" : 0, "right" : 0 }) {
		this.top = parseInt(iframe.config.height)/2 + "px"; 
		this[iframe.config.alignment] = parseInt(iframe.config.width) + "px";
		
	} else if (iframe.config.alignment in { "top": 0, "bottom" : 0 }) {
		this[iframe.config.alignment] = parseInt(iframe.config.height) + "px"; 
		this.left = iframe.element.offsetLeft + parseInt(iframe.config.width)/2 + "px";	
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

return Viewport;
});