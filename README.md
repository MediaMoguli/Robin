Robin javascript API

Files required: <br />
1) Needle.js - Needle JS library 
2) Initializator.js - initializes the API 
<br />
API namespace: N.CMS

Classes present to the user:<br /> 
1) N.CMS.Builders - class for building the view of iframes and keeps track of them.
 - this class acts as "publisher" in the notion of Publisher-Subscriber pattern.
 
2) N.CMS.IFrame - class for creating, styling and appending single iframe to the document.
- this class acts as "publisher" in the notion of Publisher-Subscriber pattern.

3) N.CMS.Events - class for handling DOM and Custom events.
- this class also acts as "subscriber" in the notion of Publisher-Subscriber pattern.

Example:
<pre>
// Object with iframe instances
var iframes = { 
	// Creates left iframe and keeps the instance of the class for later use
	left : new N.CMS.IFrame({
		name : "left", 
		src : "left.html", 
		width: "350px", 
		height : "100%", 
		minWidth : "40px"
	}),
	// Creates top iframe and keeps the instance of the class for later use
	top : new N.CMS.IFrame({
		name : "top", 
		src : "top.html", 
		width : (window.innerWidth || document.documentElement.clientWidth) - 350 + "px", 
		height : "40px", 
		top : "0", 
		left : "350px"
	}), 
	// Creates bottom iframe and keeps the instance of the class for later use
	bottom : new N.CMS.IFrame({
		name : "bottom", 
		src : "bottom.html", 
		width : (window.innerWidth || document.documentElement.clientWidth) - 350 + "px", 
		height : "40px", 
		bottom : "0", 
		left : "350px"
	}), 
	// Creates content iframe and keeps the instance of the class for later use
	content : new N.CMS.IFrame({
		name : "content", 
		src : "content.html",
		// comment "src" attribute and uncomment "html" one to see the difference
		width : (window.innerWidth || document.documentElement.clientWidth) - 350 + "px", 
		height : (window.innerHeight || document.documentElement.clientHeight) - 80 + "px", 
		top : "40px", 
		left : "350px"
	})
};

// Instantiates Builder class passing Array of iframe instances
var builder = new N.CMS.Builder([ iframes.left, iframes.top, iframes.bottom, iframes.content ]);
// Accessing top iframe
builder.iframes.top;
// Another way of accessing top iframe
iframes.top;

// Adds listener on builder instance object for "build" event
N.CMS.Events.addEventListener(builder, "build", function() {
	console.log("View is built");
});
// Builds the view
builder.build();

// Adds listener on left iframe instance object for "create" event
N.CMS.Events.addEventListener(iframes.left, "create", function() {
	console.log("Left iframe is created");
});
// Adds listener on top iframe instance object for "style" event
N.CMS.Events.addEventListener(iframes.top, "style", function() {
	console.log("Top iframe is styled");
});
// Executes all subscriber callbacks on left iframe for event "create"
N.CMS.Events.dispatchEvent(iframes.left, "create");

/* Another way of dynamicall add additional iframe. Uncomment this group to see result
builder.iframes.right = new N.CMS.IFrame({
	name : "right", 
	html : "&lt;h1&gt;I am right iframe&lt;/h1&gt;", 
	width: "350px", 
	height : "100%", 
	minWidth : "40px", 
	background : "#fff", 
	right : "0", 
	top : "0"
});
// Adds listener on right iframe instance object for "append" event
N.CMS.Events.addEventListener(builder.iframes.right, "append", function() {
	console.log("Right iframe is appended to the document");
});
builder.iframes.right.append();
*/
</pre>