const User=require('../models/user')
const {Router}=require("express");

const router=Router();

router.get('/signin',(req,res)=>{
    return res.render("signin")
})

router.get('/signup',(req,res)=>{
    return res.render("signup")
})

router.post('/signup', async (req,res)=>{
    const {fullName,email,password}=req.body;
   await User.create({
    fullName,
    email,
    password
   })

   res.redirect('/');
})

router.post('/signin',(req,res)=>{
    const {email,password}=req.body;
    const user=User.matchPassword(email,password);

    res.redirect('/');

})

module.exports=router;