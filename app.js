var express = require("express"),
app = express(),
redis = require("redis"),
client = redis.createClient(),
methodOverride = require("method-override"),
bodyParser = require("body-parser");

// MIDDLEWARE here

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// for css/js/imgs
app.use(express.static(__dirname + '/public'));

// routes

app.get("/", function(req, res) {
  client.lrange("students", 0, -1, function(err, students) {
    res.render("index", {students: students});
  });
}); 

// POST route 
app.post("/create", function(req, res) {
  client.lpush("students", req.body.item);
  res.redirect("/");
});

app.delete("/remove/:student", function(req, res) {
  client.lrange("students", 0, -1, function(err, students) {
    students.forEach(function(student) {
      if (req.params.student === student) {
        client.lrem("students", 1, student);
        res.redirect("/");
      }
    });
  });
});

app.delete("/remove_all/:students", function(req, res) {
      client.DEL("students");
      res.redirect("/");
    });
    


// Start my server!!!
app.listen(3000, function() {
  console.log("Server is starting...");
});







