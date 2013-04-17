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
	if (this.mouseDownFlag) {
		this.mouseMove = DragDropDirection.prototype[(this.direction === "x") ? "mouseMoveX" : "mouseMoveY"];
		return this.mouseMove(e);
	}
};
DragDropDirection.prototype.mouseMoveX = function(e) {
    if (this.mouseDownFlag) {
    	_getMouseX.call(this, e);
    	this.box.style.left = this.objectWindow.x + this.delta.x + "px";
        this.objectWindow.x += this.delta.x;
    }
    return this;
};
DragDropDirection.prototype.mouseMoveY = function(e) {
    if (this.mouseDownFlag) {
    	_getMouseY.call(this, e);
    	this.box.style.top = this.objectWindow.y + this.delta.y + "px";
        this.objectWindow.y += this.delta.y;
    }
    return this;
};

function _getMouseX(e) {
    var mouseX = this.mouse(e).x;
    this.delta.x = mouseX - this.mousePos.x;
    this.mousePos.x = mouseX;
};
function _getMouseY(e) {
    var mouseY = this.mouse(e).y;
    this.delta.y = mouseY - this.mousePos.y;
    this.mousePos.y = mouseY;
};

return DragDropDirection;
});