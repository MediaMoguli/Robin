N.plug("Controller", function() {
	
var _viewInstance = null;
function Controller(viewInstance) {
	this.Controller(viewInstance);
}
Controller.prototype.Controller = function(viewInstance) {
	_viewInstance = viewInstance;
};
Controller.prototype.init = function(viewInstance) {
	N.CMS.Events.addDOMListener(window, "resize", this.resize);
	N.CMS.Events.addDOMListener(document, "mousedown", this.grab);		// Grab handle
	N.CMS.Events.addDOMListener(document, "mousemove", this.drag);		// Drag handle
	N.CMS.Events.addDOMListener(document, "mouseup", this.drop);		// Drop handle
};
Controller.prototype.uninit = function(viewInstance) {
	N.CMS.Events.removeDOMListener(window, "resize", this.resize);
	N.CMS.Events.removeDOMListener(document, "mousedown", this.grab);
	N.CMS.Events.removeDOMListener(document, "mousemove", this.drag);
	N.CMS.Events.removeDOMListener(document, "mouseup", this.drop);
};
Controller.prototype.resize = function() {
	_viewInstance.onresize();
};
Controller.prototype.grab = function(e) {
	var target = N.Events.getTarget(e);
	(target.className.indexOf(_viewInstance.constructor.HANDLE_CLASS) !== -1) && _viewInstance.ongrab(e, target);
};
Controller.prototype.drag = function(e) {
	_viewInstance.ondrag(e);
};
Controller.prototype.drop = function() {
	_viewInstance.ondrop();
};

return Controller;
});