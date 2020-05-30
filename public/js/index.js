$(document).ready(function() {
	$('.sidenav').sidenav();

	// Save article button changes the saved property of the article model from false to true
	$(document).on("click", "#saveArticle", function() {
		// Get article id
		let articleID = $(this).parent().attr("data-id");
		console.log(articleID);
		// Run a POST request to update the article to be saved
	  $.ajax({
	    method: "POST",
	    url: "/save/" + articleID,
	    data: {
	      saved: true
	    }
	  })
	  location.reload(true);
	});

	// Clear all unsaved button will removed any articles not saved. 
	$(document).on("click", ".clearUnsaved", function() {
		//run 
	  $.ajax({
		url: "/clearUnsaved",
		method: 'DELETE',
	  })
	  location.reload(true);
	});

	// Scrape new articles. 
	$(document).on("click", ".scrapeArticle", function() {
		//run 
	  $.ajax({
		url: "/scrape",
		method: 'GET',
		success: function(reload) {
			location.reload(true);
		}
	  })
	});
});