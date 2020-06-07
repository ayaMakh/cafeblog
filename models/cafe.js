var mongoose = require("mongoose");

var cafeSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   location: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
}, {
   usePushEach: true
 });

module.exports = mongoose.model("cafe", cafeSchema);