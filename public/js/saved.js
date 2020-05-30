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
		let articleID = $(this).parent().attr("data-id");
		// console.log("articleID is : " + articleID)
		//Make an ajax call for the Article
		$.ajax({
			method: "GET",
			url: "/notes/" + articleID
		}).then(function(data) {
			// console.log("articleID is : " + articleID)
			$("#allNotes").empty();
			$.ajax({
				method: "GET",
				url: "/articlenotes/" + articleID
			}).then(function(data) {
				// console.log(data)
				//loop through all the notes data and append to page
				for (i = 0; i < data.length; i++) {
					$("#allNotes").append("<div data-id=" + data[i].id + " class='modal-content card-content white-text'><p>" + data[i].body + "</p><br><button id='deleteNote' class='btn waves-effect waves-teal float-right delete'>DELETE Note</button></div>");
				}
			})
		})
	});

	//Save note
	$(document).on("click", "#saveNote", function() {
		//Grab ID associated with article
		let articleID = $(this).parent().parent().parent().attr("data-id");
		// console.log("articleID is : " + articleID);
		//Grab text from body
		let body = $("#noteBody").val().trim();
		// console.log("note is : " + body);
		//Make Ajax call
		$.ajax({
			url: "/articles/" + articleID,
			method: "POST",
			data: {
				// Value taken from body input
				body: body,
				article: articleID
			}
		}).then(function(data) {
			$("#noteBody").val("")
			// console.log("articleID is : " + articleID)
			$("#allNotes").empty();
			$.ajax({
				method: "GET",
				url: "/articlenotes/" + articleID
			}).then(function(data) {
				//loop through all the notes data and append to page
				for (i = 0; i < data.length; i++) {
					$("#allNotes").append("<div data-id=" + data[i].id + " class='modal-content card-content white-text'><p>" + data[i].body + "</p><br><button id='deleteNote' class='btn waves-effect waves-teal float-right delete'>DELETE Note</button></div>");
				}
			})
		}) 
	})

	//delete note
	$(document).on("click", "#deleteNote", function() {
		//Grab ID associated with article
		let noteID = $(this).parent().attr("data-id");
		let articleID = $(this).parent().parent().parent().parent().attr("data-id");
		// console.log("articleID is : " + articleID)
		// console.log("noteID is : " + noteID);
		//Make Ajax call
		$.ajax({
			url: "/deletenotes/" + noteID,
			method: "DELETE",
		}).then(function(data) {
			// console.log("this reaches next ajax after delete")
			// console.log("articleID is : " + articleID)
			$("#allNotes").empty();
			$.ajax({
				method: "GET",
				url: "/articlenotes/" + articleID
			}).then(function(data) {
				// console.log("this passes ajax call after delete")
				// console.log(data)
				//loop through all the notes data and append to page
				for (i = 0; i < data.length; i++) {
					$("#allNotes").append("<div data-id=" + data[i].id + " class='modal-content card-content white-text'><p>" + data[i].body + "</p><br><button id='deleteNote' class='btn waves-effect waves-teal float-right delete'>DELETE Note</button></div>");
				}
				// console.log("this completes for loop after 2nd ajax call")
			})
		}) 
	})
});