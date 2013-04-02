<h1>Robin javascript API</h1>

<strong>Files required:</strong> <br />
1) <em>Needle.js</em> - Needle JS library <br />
2) <em>Initializator.js</em> - initializes the API <br />
<br />
<strong>API namespace:</strong> <em>N.CMS</em>

<strong>Classes present to the user:</strong><br /> 
1) <em>N.CMS.Viewport</em> - class for building the view of iframes and keeping track of them.
 - this class acts as "publisher" in the notion of Publisher-Subscriber pattern.
 
2) <em>N.CMS.IFrame</em> - class for creating, styling and appending single iframe to the document.
- this class acts as "publisher" in the notion of Publisher-Subscriber pattern.

3) <em>N.CMS.Events</em> - class for handling DOM and Custom events.
- this class also acts as "subscriber" in the notion of Publisher-Subscriber pattern.

<strong>Example:</strong>
<pre>
// Object with iframe instances
var iframes = { 
	// Creates left iframe and keeps the instance of the class for later use
	left : new N.CMS.IFrame({
		name : "left", 
		alignment : "left", 
		src : "left.html", 
		width: "350px" 
	}), 
	// Creates top iframe and keeps the instance of the class for later use
	top : new N.CMS.IFrame({
		name : "top", 
		alignment : "top", 
		src : "top.html",  
		height : "40px" 
	}), 
	// Creates bottom iframe and keeps the instance of the class for later use
	bottom : new N.CMS.IFrame({
		name : "bottom", 
		alignment : "bottom", 
		src : "bottom.html",  
		height : "40px" 
	}), 
	// Creates content iframe and keeps the instance of the class for later use
	content : new N.CMS.IFrame({
		name : "content", 
		alignment : "center", 
		src : location.href
	})
};

// Instantiates Viewport class passing Array of iframe instances
var builder = new N.CMS.Viewport([ iframes.left, iframes.top, iframes.bottom, iframes.content ]);
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
	height : "200px", 
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