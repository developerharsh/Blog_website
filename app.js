var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer=require("express-sanitizer"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();

mongoose.connect("mongodb://localhost/blog_app");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

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

app.post("/blogs", function(req,res){

    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err, newBlog){
        if(err)
        {
            res.render("new");
        }
        else
        {
            res.redirect("/blogs");        
        }
    });
    
});

app.get("/blogs/new", function(req,res){
    res.render("new");
});

app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundBlog});
        }
    });
});
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundBlog});
        }
    });
});

app.put("/blogs/:id", function(req,res){

    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findOneAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.listen(2000,function(){
    console.log("connected");
});