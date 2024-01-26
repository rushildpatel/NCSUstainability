var express         = require("express"),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash"),
    dotenv          = require('dotenv'),
    app             = express();

dotenv.config();
// var user = process.env.USER;
// var password = process.env.PASSWORD;
// var mongo_url = "mongodb+srv://"+user+":"+password+"@cluster0.2ecwzmd.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.2ecwzmd.mongodb.net/?retryWrites=true&w=majority`,
).then(() => {
    console.log('Connected to DB!');
}).catch(err => {
    console.log("error:",err.message);
});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.get("",function(req,res){
    res.render("landing"); 
});

app.listen(process.env.PORT,function(){
    console.log(`MeloDen server has started! http://localhost:${process.env.PORT}`);
});