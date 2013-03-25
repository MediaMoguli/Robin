N.require("DOM.js");
N.require("Events.js");
N.require("js/Publisher.js");
N.require("js/IEvents.js");
N.require("js/IFrame.js");
N.require("js/Builder.js");

N.onready(function() {
	// Creating namespace if not created
	(!N.CMS) && N.namespace("CMS");
	
	// Organizing classes under CMS namespace
	N.CMS.Builder = N.plugins.Builder; // Builder class to create the view
	N.CMS.IFrame = N.plugins.IFrame; // IFrame class to handle each iframe
	N.CMS.Events = N.plugins.IEvents; // Events class to handle DOM and custom events

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
			//html : "<h1>Around the World in 80 Days</h1><p>It was at least certain that Phileas Fogg had not absented himself from London for many years.  Those who were honoured by a better acquaintance with him than the rest, declared that nobody could pretend to have ever seen him anywhere else.  His sole pastimes were reading the papers and playing whist.  He often won at this game, which, as a silent one, harmonised with his nature; but his winnings never went into his purse, being reserved as a fund for his charities.  Mr. Fogg played, not to win, but for the sake of playing.  The game was in his eyes a contest, a struggle with a difficulty, yet a motionless, unwearying struggle, congenial to his tastes.</p>",
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
		html : "<h1>I am right iframe</h1>", 
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
});