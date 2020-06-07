var express = require("express"),
    router  = express.Router({mergeParams: true}),
    cafe = require("../models/cafe"),
    Comment = require("../models/comment"),
    middleware = require("../middleware")

//Comments New
router.get("/new",middleware.isLoggedIn, function(req, res){
    cafe.findById(req.params.id, function(err, cafe){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {cafe: cafe});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup cafe using ID
   cafe.findById(req.params.id, function(err, cafe){
       if(err){
           console.log(err);
           res.redirect("/cafes");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               cafe.comments = cafe.comments.concat([comment])
               cafe.save();
               req.flash("success", "Successfully added comment");
               res.redirect('/cafes/' + cafe._id);
           }
        });
       }
   });
});


// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/cafes/" + req.params.id);
       }
    });
});

module.exports = router;