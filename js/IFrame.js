N.plug("IFrame", function() {
/**
 * class IFrame extends class Publisher
 * @description this allows IFrame methods to have subscribers and be executed as custom events
 * 
 */
N.extend(IFrame, N.plugins.Publisher);
/**
 * @property _style
 * @access private
 * 
 * @type Array
 * @description Contains possible style properties for the iframe
 * 
 */
var _style = ["width", "height", "minWidth", "maxWidth", "minHeight", "maxHeight", "top", "left", "bottom", "right", "background"];
/**
 * @property _attributes
 * @access private
 * 
 * @type Array
 * @description Contains possible attributes for the iframe
 * 
 */
var _attributes = ["name", "id", "class", "src"];
/**
 * @class IFrame 
 * 
 */
function IFrame(config) {
	this.IFrame(config);
}
/**
 * @constructor IFrame
 * @access public
 * 
 * @param config Object (required) - iframe options
 * @description Inits properties, creates and adds styles/attributes to the iframe
 * 
 * @returns void
 */
IFrame.prototype.IFrame = function(config) {
	if (typeof config === "object") {
		this.Publisher();
		this.element = null;
		this.config = config;
		this.name = config.name;
		this.create()/*.style()*/;
		_onload.call(this);
	}
};
/**
 * @method create
 * @access public
 * 
 * @description Creates iframe, adds attributes and calls subscriber callbacks
 * 
 * @returns IFrame instance
 */
IFrame.prototype.create = function() {
	this.element = N.DOM.create("iframe");
	this.push("create");
	return this;
};
/**
 * @method attributes
 * @access public
 * 
 * @description Sets iframe attributes and calls subscriber callbacks
 * 
 * @returns IFrame instance
 */
IFrame.prototype.attributes = function(config) {
	N.DOM.setAttributes(this.element, new AttributesObject((typeof config !== "undefined") ? N.objectMerge(this.config, config) : this.config));
	this.push("attributes");
	return this;
};
/**
 * @method style
 * @access public
 * 
 * @description Styles iframe and calls subscriber callbacks
 * 
 * @returns IFrame instance
 */
IFrame.prototype.style = function(config) {
	N.DOM.setStyle(this.element, new StyleObject((typeof config !== "undefined") ? N.objectMerge(this.config, config) : this.config));
	this.push("style");
	return this;
};
/**
 * @method append
 * @access public
 * 
 * @description Appends iframe to the document and calls subscriber callbacks
 * 
 * @returns IFrame instance
 */
IFrame.prototype.append = function(callback) {
	N.DOM.add(this.element, document.body);
	(typeof callback === "function") && callback.call(this);
	this.push("append");
	
	return this;
};
/**
 * @method _onload
 * @access private
 * 
 * @description Listens for load event and add HTML content if provided
 * 
 * @returns void
 */
function _onload() {
	if (!this.config.src && this.config.html) {
		var that = this;
		
		N.CMS.Events.addDOMListener(this.element, "load", function() {
			that.element.contentWindow.document.body.innerHTML = that.config.html;	
		});
	}
}
/**
 * @constructor StyleObject
 * @access private
 * 
 * @param config Object (required) - config from IFrame constructor
 * @description Prepares style object (ready to use) based on passed configuration
 * 
 * @returns void
 */
function StyleObject(config) {
	var i = _style.length;
	this.position = "fixed";
	this.padding = 0;
	this.margin = 0;
	this.border = "none";
	
	while (i--) { (_style[i] in config) && (this[_style[i]] = config[_style[i]]); }
}
/**
 * @constructor AttributesObject
 * @access private
 * 
 * @param config Object (required) - config from IFrame constructor
 * @description Prepares attributes object (ready to use) based on passed configuration
 * 
 * @returns void
 */
function AttributesObject(config) {
	var i = _attributes.length;
	this.frameBorder = "0";
		
	while (i--) { (_attributes[i] in config) && (this[_attributes[i]] = config[_attributes[i]]); }
}

return IFrame;
});