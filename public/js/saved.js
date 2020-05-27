$(document).ready(function() {
	$('.sidenav').sidenav();

	// Save article button changes the saved property of the article model from false to true
	$(document).on("click", "#unsaveArticle", function() {
		// Get article id
		let articleID = $(this).parent().attr("data-id");
		console.log(articleID);
		// Run a POST request to update the article to be saved
	  $.ajax({
	    method: "POST",
	    url: "/unSave/" + articleID,
	    data: {
	      saved: false
	    }
	  })
	  location.reload(true);
	});

	// Clear all Saved button will removed any articles saved. 
	$(document).on("click", ".clearSaved", function() {
		//run 
	  $.ajax({
		url: "/clearSaved",
		method: 'DELETE',
	  })
	  location.reload(true);
	});


});