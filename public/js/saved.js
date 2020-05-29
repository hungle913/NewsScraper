$(document).ready(function() {
	$('.sidenav').sidenav();
	$('.modal').modal();

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
		//Run Ajax request to delete all articles from the DB. 
	  $.ajax({
		url: "/clearSaved",
		method: 'DELETE'
	  })
	  location.reload(true);
	});

	//Open modal and display notes
	$(document).on("click", "#modalButton", function() {
		// Get article by article ID
		let articleID = $(this).parent().parent().parent().attr("data-id");
		//Make an ajax call for the Article
		$.ajax({
			method: "GET",
			url: "/unSave/" + articleID
		}).done(function(data) {

		})


	});

	//Save note
	$(document).on("click", "#saveNote", function() {
		//Grab ID associated with article
		let articleID = $(this).parent().parent().parent().attr("data-id");
		console.log("articleID is : " + articleID);
		//Grab text from body
		let body = $("#noteBody").val().trim();
		console.log("note is : " + body);
		//Make Ajax call
		$.ajax({
			url: "/articles/" + articleID,
			method: "POST",
			data: {
				// Value taken from body input
				body: body
			}
		}).then(function(data) {
			console.log(data);
			$("#noteBody").val("")
		}) 
		// location.reload(true);
	})

});