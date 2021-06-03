const express = require("express"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  User = require("./models/user");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb+srv://admin_gvanshalaj:Sunday_1998@cluster0.yhptq.mongodb.net/myFirstDatabase");

var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.use(require("express-session")({
  secret: "Rusty is a dog",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// *********All routs*********



// Showing home page
app.get("/", function(req, res) {
  res.render("home");
});
app.get("/home", function(req, res) {
  res.render("home");
});


// Showing secret page
app.get("/secret", isLoggedIn, function(req, res) {
  res.render("secret");
});

// Showing register form
app.get("/register", function(req, res) {
  res.render("register");
});

// Handling user signup
app.post("/register", function(req, res) {
  var username = req.body.username
  var password = req.body.password
  var name = req.body.name
  var email = req.body.email
  var address = req.body.address
  var mobile = req.body.mobile

  User.register(new User({
      username: username,
      name: name,
      email: email,
      address: address,
      mobile: mobile,
    }),
    password,
    function(err, user) {
      if (err) {
        console.error(err);
        return res.render("register");
      }

      passport.authenticate("local")(
        req, res,
        function() {
          res.render("secret");
        });
    });
});

//Showing login form
app.get("/login", function(req, res) {
  res.render("login");
});

//Handling user login
app.post("/login", passport.authenticate("local", {
  successRedirect: "/secret",
  failureRedirect: "/login"
}), function(req, res) {});

//Handling user logout
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Server Has Started!");
});
