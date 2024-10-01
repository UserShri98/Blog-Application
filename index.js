const express=require("express");
const path=require("path");
const app=express();
const userRoute=require('./routes/user')
const mongoose=require("mongoose");

const PORT=7000;

mongoose.connect("mongodb://localhost:27017/blogify").then(() =>
  console.log("Mongodb connected")
);

app.set("view engine", "ejs");
app.set("views", path.resolve('./views'));

app.use(express.urlencoded({extended:false}));
app.use('/user', userRoute)

app.get('/', (req,res)=>{
  return res.render("home")
})

app.listen(PORT, ()=>console.log(`Server is listening on PORT:${PORT}`));