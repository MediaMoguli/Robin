N.plug("Builder", function() {
/**
 * class Builder extends class Publisher
 * @description this allows Builder methods to have subscribers and be executed as custom events
 * 
 */
N.extend(Builder, N.plugins.Publisher);
/**
 * @class Builder 
 * 
 */
function Builder(iframes) {
	this.Builder(iframes);
}
/**
 * @constructor Builder
 * @access public
 * 
 * @param iframes Array (required) - Array with iframe instances (class N.CMS.IFrame)
 * @description Stores iframe instances to this.iframes object
 * 
 * @returns void
 */
Builder.prototype.Builder = function(iframes) {
	this.Publisher();
	this.iframes = {};
	document.innerHTML = "";
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
 * @returns void
 */
Builder.prototype.build = function() {
	var i;
	for (i in this.iframes) {
		this.iframes[i].append();
	}
	this.push("build");
};
/**
 * @method _store
 * @access private
 * 
 * @description Stores iframe instances to an object for easy accessing
 * 
 * @returns void
 */
function _store(iframes) {
	var i = iframes.length;
	while (i--) {
		this.iframes[iframes[i].name] = iframes[i];
	}
}

return Builder;
});