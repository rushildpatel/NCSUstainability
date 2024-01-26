var express         = require("express"),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash"),
    dotenv          = require('dotenv'),
    app             = express();

const user = process.env.USER;
const password = process.env.PASSWORD;
const mongo_url = "mongodb+srv://"+user+":"+password+"@cluster0.2ecwzmd.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongo_url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to DB!');
}).catch(err => {
    console.log("error:",err.message);
});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
dotenv.config();

app.get("/",function(req,res){
    res.render("landing"); 
});


app.listen(process.env.PORT,function(){
    console.log(`MeloDen server has started! http://localhost:${process.env.PORT}`);
});