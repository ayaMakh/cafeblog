var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User        = require("./models/user")
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    cafeRoutes = require("./routes/cafes"),
    indexRoutes      = require("./routes/index")
 
var url = process.env.DATABASEURL || "mongodb://localhost/cafeblog";
mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then(()=> {
    console.log("Connected to DB!")
}).catch(err => {
    console.log('ERROR:', err.message)
});

mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/cafes", cafeRoutes);
app.use("/cafes/:id/comments", commentRoutes);


app.listen(process.env.PORT || 3000, function(){
   console.log("Server is running");
});