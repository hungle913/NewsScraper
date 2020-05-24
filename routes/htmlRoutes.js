var db = require("../models");

module.exports = function(app) {

  app.get("/", function (req, res) {
    Article.find({ "saved": false }, function (error, data) {
        let newsArticles = {
          article: data
        };
        console.log(newsArticles);
        res.render("index", newsArticles);
    });
  });

  app.get("/saved", function (req, res) {
    Article.find({ "saved": true }).populate("notes").exec(function (error, articles) {
      let newsArticles = {
        article: articles
      };
      res.render("saved", newsArticles);
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
}
