var db = require("../models");

module.exports = function(app) {

  app.get("/", function (req, res) {
    db.Article.find({ "saved": false }).sort({'summary': -1})
    .then(function(dbArticle) {
      // console.log(dbArticle)
      var x = dbArticle.map(function(article) { 
        return { 
          id: article._id, 
          title: article.title,
          summary: article.summary,
          link: article.link
        };
      });
      // If we were able to successfully find Articles, send them back to the client
      res.render("index", {
        article: x
      });
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.render("404")
    });
  });

  app.get("/saved", function (req, res) {
    db.Article.find({ "saved": true }).sort({'summary': -1})
    .then(function(dbArticle) {
      // console.log(dbArticle)
      var x = dbArticle.map(function(article) { 
        return { 
          id: article._id, 
          title: article.title,
          summary: article.summary,
          link: article.link
        };
      });
      // If we were able to successfully find Articles, send them back to the client
      res.render("saved", {
        article: x
      });
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.render("404")
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
}
