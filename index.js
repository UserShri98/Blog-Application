const express = require("express");
const path = require("path");
const app = express();
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const Blog = require('./models/blog');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const PORT = 7000;

mongoose.connect("mongodb://localhost:27017/blogify")
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.error("MongoDB connection error:", err));  // Added error handling for MongoDB connection

app.set("view engine", "ejs");
app.set("views", path.resolve('./views'));

// Middleware for parsing form data
app.use(express.urlencoded({ extended: false }));

// Parse cookies
app.use(cookieParser());

// Check for authentication before handling routes
app.use(checkForAuthenticationCookie("token"));

// Serve static files from public directory
app.use(express.static(path.resolve('./public')));

// Routes
app.use('/user', userRoute);
app.use('/blog', blogRoute);

// Home route
app.get('/', async (req, res) => {
  try {
    const allBlogs = await Blog.find({});
    return res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);  // Added error handling
    return res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`));
