const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {
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
                    console.log(dbArticle);
                }).catch(function(err) {
                    // If an error occurred, log it
                    console.log(err);
                });
            });
            // Send a message to the client
            res.send("Scrape Complete");
        });
    });

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
      
}
