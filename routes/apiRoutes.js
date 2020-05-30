const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {

  //scrape all articles and load to page
  app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.npr.org/sections/news/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      
      // Now, we grab every h2 within an article tag, and do the following:
      $(".item-info").each(function(i, element) {
        // Save an empty result object
        var result = {};
      
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this).children("h2").children("a").text();
        result.link = $(this).children("h2").children("a").attr("href");
        result.summary = $(this).children("p").children("a").text();
      
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result).then(function(dbArticle) {
          // View the added result in the console
          // console.log(dbArticle);
        }).catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
      });
      // Send a message to the client
      res.send("Scrape Complete");
    })
  });

  //save articles
  app.post("/save/:id", function(req, res) {
    // Use the article id to find and update it's saved property to true
    db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
    // Execute the above query
    .exec(function(err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      }
      // Log result
      else {
        console.log("Saved: ", doc);
      }
    });
  });

  //unsave articles
  app.post("/unSave/:id", function(req, res) {
    // Use the article id to find and update it's saved property to false
    db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false, "notes": [] })
    // Execute the above query
    .exec(function(err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      }
      // Log result
      else {
        console.log("Deleted: ", doc);
      }
    });
  });

  //clear unsaved articles
  app.delete("/clearUnsaved", function(req, res) {
    // Use the article id to find and update it's saved property to true
    db.Article.deleteMany({ "saved": false })
    // Execute the above query
    .exec(function(err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      }
      // Log result
      else {
        console.log("cleared");
      }
    });
  });

  //clear Saved articles
  app.delete("/clearSaved", function(req, res) {
    // Use the article id to find and update it's saved property to true
    db.Article.deleteMany({ "saved": true })
    // Execute the above query
    .exec(function(err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      }
      // Log result
      else {
        console.log("cleared");
      }
    });
  });

  // This will get the articles we scraped from the mongoDB
  app.get("/articles", function(req, res) {
    // Grab every doc in the Articles array
    db.Article.find({})
    // Execute the above query
    .exec(function(err, results) {
      // Log any errors
      if (err) {
        console.log(error);
      }
      // Or send the doc to the browser as a json object
      else {
      res.json(results);
      }
    });
  });

  //add note
  app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body).then(function(dbNote) {
      return db.Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        notes: dbNote._id
      }, {
        new: true
      }, {
        $push: { "notes": note}
      });
    }).then(function (dbArticle) {
      res.json(dbArticle);
      // console.log("note saved successful")
    }).catch(function (err) {
      res.json(err);
    })
  });

  //open notes Modal and provides article title using article ID
  app.get("/notes/:id", function(req, res) {
    // Grab every doc in the Articles array
    db.Article.find({"_id": req.params.id})
    // Execute the above query
    .exec(function(err, results) {
      // Log any errors
      if (err) {
        console.log(error);
      }
      // Or send the doc to the browser as a json object
      else {
      res.json(results);
      }
    });
  });

  //find notes using article ID association to display notes in modal
  app.get("/articlenotes/:id", function(req, res) {
    // Grab every doc in the Articles array
    db.Note.find({"article": req.params.id})
    .then(function(dbNote) {
      // console.log(dbNote)
      // console.log("dbNote is :" + dbNote)
      var y = dbNote.map(function(note) {
        // console.log("note is : " + note)
        return {
          id: note._id,
          body: note.body,
          article: note.article
        };
      })
      // console.log(y)
      // If we were able to successfully find notes, send them back to the client
      res.json(y)
    })
  });

  //find notes using article ID association to delete notes
  app.delete("/deletenotes/:id", function(req, res) {
    db.Note.findOneAndDelete({"_id": req.params.id})
    .then(function (dbArticle) {
      res.json(dbArticle);
      // console.log("note delete successful")
    }).catch(function (err) {
      res.json(err);
    })
  });
}
