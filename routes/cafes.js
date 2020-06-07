var express = require("express"),
    router  = express.Router(),
    cafe = require("../models/cafe"),
    middleware = require("../middleware")


//INDEX - show all cafes
router.get("/", function(req, res){
    // Get all cafes from DB
    cafe.find({}, function(err, allcafes){
       if(err){
           console.log(err);
       } else {
          res.render("cafes/index",{cafes:allcafes});
       }
    });
});

//CREATE - add new cafe to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to cafes array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var loc = req.body.location;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newcafe = {name: name, image: image, description: desc, location: loc, author:author}
    // Create a new cafe and save to DB
    cafe.create(newcafe, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to cafes page
            res.redirect("/cafes");
        }
    });
});

//NEW - show form to create new cafe
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("cafes/new"); 
});

// SHOW - shows more info about one cafe
router.get("/:id", function(req, res){
    //find the cafe with provided ID
    cafe.findById(req.params.id).populate("comments").exec(function(err, foundcafe){
        if(err){
            console.log(err);
        } else {
            //render show template with that cafe
            res.render("cafes/show", {cafe: foundcafe});
        }
    });
});

// EDIT cafe ROUTE
router.get("/:id/edit", middleware.checkcafeOwnership, function(req, res){
    cafe.findById(req.params.id, function(err, foundcafe){
        res.render("cafes/edit", {cafe: foundcafe});
    });
});

// UPDATE cafe ROUTE
router.put("/:id",middleware.checkcafeOwnership, function(req, res){
    // find and update the correct cafe
    cafe.findByIdAndUpdate(req.params.id, req.body.cafe, function(err, updatedcafe){
       if(err){
           res.redirect("/cafes");
       } else {
           //redirect somewhere(show page)
           res.redirect("/cafes/" + req.params.id);
       }
    });
});

// DESTROY cafe ROUTE
router.delete("/:id",middleware.checkcafeOwnership, function(req, res){
   cafe.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/cafes");
      } else {
          res.redirect("/cafes");
      }
   });
});


module.exports = router;

