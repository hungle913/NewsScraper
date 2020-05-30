// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

//require all Models
let db = require("./models")

// Scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

//Port
const PORT = process.env.PORT || 3000

// Initialize Express
const app = express();

// Use body parser
app.use(bodyParser.urlencoded({
    extended: false
}));

// Make public a static dir
app.use(express.json());
app.use(express.static("public"));

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main",
}));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nprScraper";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// Listen on port
app.listen(PORT, () => console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT));