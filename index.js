const express=require("express");
const path=require("path");
const app=express();
const userRoute=require('./routes/user')
const blogRoute=require('./routes/blog')

const cookieParser=require("cookie-parser")
const mongoose=require("mongoose");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const PORT=7000;

mongoose.connect("mongodb://localhost:27017/blogify").then(() =>
  console.log("Mongodb connected")
);

app.set("view engine", "ejs");
app.set("views", path.resolve('./views'));

app.use(express.urlencoded({extended:false}));
app.use('/user', userRoute)
app.use('/blog', blogRoute)

app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))

app.get('/', (req,res)=>{
  return res.render("home",{
    user:req.user,
  })
})

app.listen(PORT, ()=>console.log(`Server is listening on PORT:${PORT}`));