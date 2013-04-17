(function() {
N.require("DOM.js");
N.require("Events.js");
N.require("DragDrop.js");
N.require("DragDropDirection.js");
N.require("js/Publisher.js");
N.require("js/IEvents.js");
N.require("js/IFrame.js");
N.require("js/Viewport.js");
N.require("js/Controller.js");

if (!N.CMS) {
	N.namespace("CMS");		// Creating namespace if not created
} else {
	//Check if we have already loaded content (do not load if so). Should serve as !window.name check
	return false;
}
window.onload = function() {
	N.onready(function() {
		// Organizing classes under CMS namespace
		N.CMS.Viewport = N.plugins.Viewport; // Viewport class to create the view
		N.CMS.IFrame = N.plugins.IFrame; // IFrame class to handle each iframe
		N.CMS.Events = N.plugins.IEvents; // Events class to handle DOM and custom events
	
		// Object with iframe instances
		var iframes = { 
			// Creates left iframe and keeps the instance of the class for later use
			left : new N.CMS.IFrame({
				name : "left", 
				alignment : "left", 
				src : "left.html", 
				width: "300px" 
				//height : "100%", 
				//minWidth : "40px"
			}), 
			// Creates right iframe and keeps the instance of the class for later use
			right : new N.CMS.IFrame({
				name : "right", 
				alignment : "right", 
				html : "<h1>Right iframe</h1><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>", 
				width: "300px" 
				//height : "100%", 
				//minWidth : "40px"
			}), 
			/*
			// Creates another left iframe and keeps the instance of the class for later use
			left350 : new N.CMS.IFrame({
				name : "left350", 
				alignment : "left", 
				//src : "left.html",
				html : "<h1>Another left iframe</h1><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>",
				width: "350px" 
				//height : "100%", 
				//minWidth : "40px"
			}),
			*/
			// Creates top iframe and keeps the instance of the class for later use
			top : new N.CMS.IFrame({
				name : "top", 
				alignment : "top", 
				src : "top.html", 
				//width : (window.innerWidth || document.documentElement.clientWidth) - 350 + "px", 
				height : "40px" 
				//top : "0", 
				//left : "350px"
			}), 
			// Creates bottom iframe and keeps the instance of the class for later use
			bottom : new N.CMS.IFrame({
				name : "bottom", 
				alignment : "bottom", 
				src : "bottom.html", 
				//width : (window.innerWidth || document.documentElement.clientWidth) - 350 + "px", 
				height : "40px" 
				//bottom : "0", 
				//left : "350px"
			}), 
			// Creates content iframe and keeps the instance of the class for later use
			content : new N.CMS.IFrame({
				name : "content", 
				alignment : "center", 
				src : location.href
				// comment "src" attribute and uncomment "html" one to see the difference
				//html : "<h1>Around the World in 80 Days</h1><p>It was at least certain that Phileas Fogg had not absented himself from London for many years.  Those who were honoured by a better acquaintance with him than the rest, declared that nobody could pretend to have ever seen him anywhere else.  His sole pastimes were reading the papers and playing whist.  He often won at this game, which, as a silent one, harmonised with his nature; but his winnings never went into his purse, being reserved as a fund for his charities.  Mr. Fogg played, not to win, but for the sake of playing.  The game was in his eyes a contest, a struggle with a difficulty, yet a motionless, unwearying struggle, congenial to his tastes.</p>",
				//width : (window.innerWidth || document.documentElement.clientWidth) - 350 + "px", 
				//height : (window.innerHeight || document.documentElement.clientHeight) - 80 + "px", 
				//top : "40px", 
				//left : "350px"
			})
		};
		
		// Instantiates Viewport class passing Array of iframe instances (commented one is another left sidebar)
		var builder = new N.CMS.Viewport([ iframes.left, iframes.right, iframes.top, iframes.bottom, iframes.content ]);
		new N.plugins.Controller(builder).init();
		
		builder.iframes.top; 	// Accessing top iframe
		iframes.top;			// Another way of accessing top iframe
		
		// Adds listener on Viewport instance object for "build" event
		N.CMS.Events.addEventListener(builder, "build", function() {
			//console.log("View is built");
		});
		
		builder.build(); 	// Builds the iframes
		builder.handles();	// Builds resize handles
		
		/* // Another way of dynamically add additional iframes. Uncomment this group to see result
		 * // Setting iframes this way (without using Viewport.build) requires user to manually determine top, left, width, height
		builder.iframes.right = new N.CMS.IFrame({
			name : "right", 
			alignment : "right", 
			html : "<h1>I am right iframe</h1>", 
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
	});
};
})();