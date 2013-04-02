N.plug("IEvents", function() {
// In order this assignment to work we need to do some extra tests
//Events = N.Events;
/**
 * @class Events 
 * @description Intention of this class is to serve as Subscriber and DOM events manipulator
 *  
 */
function Events() { }
/**
 * @method addDOMListener
 * @access public static
 * 
 * @description Cross browser listener for DOM Level 2 events.
 * 
 * @param element Array|String|HTMLElement (required) - Element Id, Array of elements or HTMLElement to listen on
 * @param eventName String (required) - Event name
 * @param fn Function (required) - function to execute on event appearance
 * @param prop Boolean (optional) - propagate or not
 * 
 * @returns void
 */
Events.addDOMListener = N.Events.addEventListener;
/**
 * @method removeDOMListener
 * @access public static
 * 
 * @description Remove Cross browser listener for DOM Level 2 events.
 * 
 * @param element Array|String|HTMLElement (required) - Element Id, Array of elements or HTMLElement to listen on
 * @param eventName String (required) - Event name
 * @param fn Function (required) - pointer to the function passed via addDOMListener 
 * @param prop Boolean (optional) - propagate or not
 * 
 * @returns void
 */
Events.removeDOMListener = N.Events.removeEventListener;
/**
 * @method addEventListener
 * @access public static
 * 
 * @description Listens for a custom event (method) on the object passed.
 * 
 * @param object Object (required) - Object (instance of a class) to listen to
 * @param event String (required) - Event name (method name)
 * @param callback Function (required) - function to execute on event appearance 
 * 
 * @returns void
 */
Events.addEventListener = function(object, event, callback) {
	(!object.subscribers) && (object.subscribers = {});
	(!object.subscribers[event]) && (object.subscribers[event] = []);
	(_in.call(object.subscribers[event], callback) === -1) && object.subscribers[event].push(callback);
};
/**
 * @method removeEventListener
 * @access public static
 * 
 * @description Remove listeners on the object passed for particular event.
 * 
 * @param object Object (required) - Object (instance of a class) to listen to
 * @param event String (required) - Event name (method name)
 * @param callback Function (required) - pointer to function passed via addEventListener
 * 
 * @returns void
 */
Events.removeEventListener = function(object, event, callback) {
	if (object.subscribers) {
		if (object.subscribers[event]) {
			var index = _in.call(object.subscribers[event], callback);
			(index !== -1) && object.subscribers[event].splice(index, 1);
		}
	}
};
/**
 * @method dispatchEvent
 * @access public static
 * 
 * @description Force execution of all listeners to particular event on object.
 * 
 * @param object Object (required) - Object (instance of a class) to listen to
 * @param event String (required) - Event name (method name)
 * 
 * @returns void
 */
Events.dispatchEvent = function(object, event) {
	(typeof object.push === "function") && object.push(event);
};
/**
 * @method _in
 * @access private
 * 
 * @description Simulates Array.indexOf method if doesn't exist.
 * @param element Any type (required) - element to check for
 * 
 * @returns Number - index of the match or -1
 */
function _in(element) {
	if (Array.prototype.indexOf) {
		_in = Array.prototype.indexOf;
	} else {
		_in = function(element) {
			var i = this.length;
			while (i--) { if (this[i] === element) { return i; }; }
			return -1;
		};
	}
	return _in.call(this, element);
}

return Events;
});