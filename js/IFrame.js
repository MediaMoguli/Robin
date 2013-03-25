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
		this.create(config).style(config);
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
	this.element = N.DOM.createPlus("iframe", new AttributesObject(this.config));
	this.push("create");
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
IFrame.prototype.style = function() {
	N.DOM.setStyle(this.element, new StyleObject(this.config));
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
IFrame.prototype.append = function() {
	N.DOM.add(this.element, document.body);
	if (!this.config.src && this.config.html) {
		var that = this;
		setTimeout(function() { that.element.contentWindow.document.body.innerHTML = that.config.html; }, 50);
	}
	this.push("append");
	return this;
};
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