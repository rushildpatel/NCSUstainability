var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/",function(req,res){
    res.render("landing");
});
//================
//  AUTH ROUTES
//================

router.get("/register",function(req,res){
    res.render("register");
});

router.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err,user){
        if(err){ 
                return res.render("register", {"error": err.message});
        } 
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Successfully Signed Up! Nice to meet you, " + req.body.username);
            res.redirect("/");
        });
    });
});

router.get("/login",function(req,res){
   res.render("login"); 
});

router.post("/login", passport.authenticate("local",
        {
            successRedirect:"/",
            failureRedirect:"/login",
            failureFlash: true
        }),function(req,res){
            console.log("User Logged in!");
});

// router.get("/logout",function(req,res){
//     req.flash("success", "Successfully logged you out!");
//     req.logout();
//     res.redirect("/");
// });

router.get('/logout', function(req, res, next) {
    req.flash("success", "Successfully logged you out!");
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});

router.get("/about",function(req,res){
    res.render("about");
});

module.exports = router;