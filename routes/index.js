var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
const { exec } = require("child_process");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Include the fs module

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

router.get("/", function (req, res) {
  res.render("landing");
});
//================
//  AUTH ROUTES
//================

router.get("/register", function (req, res) {
  res.render("register");
});

router.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      return res.render("register", { error: err.message });
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", "Successfully Signed Up! Nice to meet you, " + req.body.username);
      res.redirect("/");
    });
  });
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res, next) {
  req.flash("success", "Successfully logged you out!");
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/about", function (req, res) {
  res.render("about");
});

// router.get("/analysis", function (req, res) {
//   // Replace 'your_python_script.py' with the actual name of your Python script
//   res.render("analysis");
// });

router.get("/inventory", function (req, res) {
  res.render("inventory");
});

router.get("/excessFood", function (req, res) {
  res.render("excessFood");
});

module.exports = router;
