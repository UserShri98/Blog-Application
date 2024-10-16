const mongoose = require('mongoose');
const {Router}=require("express");
const multer=require("multer");
const path=require("path");
const Blog=require('../models/blog')
const Comment=require('../models/comment')

const router=Router();



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
        const fileName= `${Date.now()}-${file.originalname}`;
      cb(null, fileName)
    }
  })
  
  const upload = multer({ storage: storage })


router.get('/add-new',(req,res)=>{
    return res.render("addBlog",{
        user:req.user,
    })
})

router.get('/:id',async (req,res)=>{
    console.log(req.user)
    const blog=await Blog.findById(req.params.id).populate("createdBy");
    const comments=await Comment.find({blogId:req.params.id}).populate("createdBy");
    console.log("comments", comments);

    return res.render('blog',{
        user:req.user,
        blog,
        comments
    })
})

router.post('/comment/:blogId',async(req,res)=>{
    await Comment.create({
       content:req.body.content,
       blogId:req.params.blogId,
       createdBy:req.user._id,
    })
    return res.redirect(`/blog/${req.params.blogId}`);
  
  })


router.post('/',upload.single("coverImage"),async (req,res)=>{
    if (!req.user || !req.user._id) {
        console.error("req.user or req.user._id is undefined");
        return res.status(500).send("User is not authenticated or _id is missing.");
    }

    const {title,body}=req.body;
    const blog= await Blog.create({
        title,
        body,
        createdBy:req.user._id,
        coverImageURL:`/uploads/${req.file.filename}`
    })

    return res.redirect(`/blog/${blog._id}`);
})


module.exports=router;