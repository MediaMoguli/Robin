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
	this.iframes = {};
	this.next = { top : 0, bottom : 0, left : 0, right : 0 };
	this.reset();
	if (N.isArray(iframes)) { 
		_store.call(this, iframes);
		_onresize.call(this);
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
	this.push("build");
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
	document.body.innerHTML = "";
	document.body.style.margin = 0;
	document.body.style.padding = 0;
	document.body.style.width = "100%";
	document.body.style.height = "100%"; // ie fix iframe height 100% 
	
	this.push("reset");
	return this;
};
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
	N.CMS.Events.addDOMListener(window, "resize", function () {
		var i;

		Viewport.WIDTH = (window.innerWidth || document.documentElement.clientWidth); 
		Viewport.HEIGHT = (window.innerHeight || document.documentElement.clientHeight);
		
		that.next = { top : 0, bottom : 0, left : 0, right : 0 };
		for (i in that.iframes) {
			that.iframes[i].style(new DimensionsObject(that.iframes[i], that));
		}
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