var express     = require("express"),
mongoose        = require("mongoose"),
app             = express();

mongoose.connect("mongodb+srv://<user>:<password>@cluster0.2ecwzmd.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useFindAndModify: false,
    useCreateIndex: true
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

app.listen(5000,function(){
    console.log("MeloDen server has started!");
});