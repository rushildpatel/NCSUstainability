var express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  flash = require("connect-flash"),
  dotenv = require("dotenv"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user"),
  app = express();

var indexRoutes = require("./routes/index");
var analysisRoutes = require("./routes/analysis.js");
dotenv.config();
mongoose
  .connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.2ecwzmd.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch((err) => {
    console.log("error:", err.message);
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONIGURATION
app.use(
  require("express-session")({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", indexRoutes);
app.use("/analysis", analysisRoutes);

app.listen(process.env.PORT, function () {
  console.log(`MeloDen server has started! http://localhost:${process.env.PORT}`);
});
