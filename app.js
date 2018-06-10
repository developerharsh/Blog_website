var bodyParser = require("body-parser"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();

mongoose.connect("mongodb://localhost/blog_app");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image:"https://metrouk2.files.wordpress.com/2017/10/567892431.jpg?w=748&h=498&crop=1",
//     body: "Test blog for testing purpose"
// }, function(err,createdBlog){
//      if(err)
//      {
//          console.log(err);
//      }  
//      else{
//          console.log(createdBlog);
//      }
// });

app.get("/", function(req,res)
{
    res.redirect("/blogs");
});

app.get("/blogs", function(req,res){
    Blog.find({},function(err, blogs){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("index",{blogs:blogs});        
        }
    })
    
});

app.get("/blogs/new", function(req,res){
    res.render("new");
})


app.listen(2000,function(){
    console.log("connected");
});