require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const Blog = require('./models/blog');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const PORT = process.env.PORT || 7000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.error("MongoDB connection error:", err));  
app.set("view engine", "ejs");
app.set("views", path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(checkForAuthenticationCookie("token"));

app.use(express.static(path.resolve('./public')));

app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.get('/', async (req, res) => {
  try {
    const allBlogs = await Blog.find({});
    return res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);     
    return res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`));
