const {Router}=require("express");
const multer=require("multer");
const path=require("path");
const router=Router();
const Blog=require('../models/blog')


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
    const blog=await Blog.findById(req.params.id).populate("createdBy");
    console.log(blog);
    return res.render('blog',{
        user:req.user,
        blog,
    })
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