const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//Register
// router.get('/register',async(req,res) => {
//    const user = await new User({
//     username:"Jordan",
//     email:"jordan@gmail.com",
//     password:"king",

//    })
//    await user.save();
//    res.send("Ok")
// })
router.post('/register',async(req,res) => {
 
   try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        const newUser =  new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
        
           });

        const user = await newUser.save();
        res.status(200).json(user)
   }catch(e){
    console.error(e)
   }
})



router.post('/login',async(req,res) => {
   try{
    
    const user = await User.findOne({email:req.body.email});
    !user && res.status(200).json("user not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    !validPassword && res.status(404).json("password not matching") 

    console.log(user)

   }catch(e){console.error('something went wrong')}
})


router.get('/',(req,res) =>{
    res.send("yeah auth")
})

module.exports = router