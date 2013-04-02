N.plug("DragDropDirection", function() {
N.extend(DragDropDirection, N.DragDrop);

function DragDropDirection(config) {
	this.DragDropDirection(config);
}
DragDropDirection.prototype.DragDropDirection = function(config) {
	config = config || {};
	this.DragDrop(config.box || null, config.handle || null);
	this.direction = config.direction || "x";
};
DragDropDirection.prototype.mouseMove = function(e) {
	if (this.direction === "x") {
		DragDropDirection.prototype.mouseMove = DragDropDirection.prototype.mouseMoveX;
	} else {
		DragDropDirection.prototype.mouseMove = DragDropDirection.prototype.mouseMoveY;
	}
	return this.mouseMove(e);
};
DragDropDirection.prototype.mouseMoveX = function(e) {
	_getMouseX.call(this, e);
    if (this.mouseDownFlag) {
    	this.box.style.left = this.objectWindow.x + this.delta.x + "px";
        this.objectWindow.x += this.delta.x;
    }
    return this;
};
DragDropDirection.prototype.mouseMoveY = function(e) {
	_getMouseY.call(this, e);
    if (this.mouseDownFlag) {
    	this.box.style.top = this.objectWindow.y + this.delta.y + "px";
        this.objectWindow.y += this.delta.y;
    }
    return this;
};

function _getMouseX(e) {
    var mouseX = (NEEDLE.isIE) ? (event.clientX + document.body.scrollLeft) : e.pageX;
    this.delta.x = mouseX - this.x;
    this.x = mouseX;
};
function _getMouseY(e) {
    var mouseY = (NEEDLE.isIE) ? (event.clientY + document.body.scrollTop) : e.pageY;
    this.delta.y = mouseY - this.y;
    this.y = mouseY;
};

return DragDropDirection;
});