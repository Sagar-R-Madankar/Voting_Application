const express=require('express');
const router=express.Router();

const User=require('../Models/user');
const {jwtAuthMiddleware,generatetoken}=require('../jwt');

//Signup Page

router.post('/signup',async(req,res) =>{

    try {
        const data= req.body
        //Ensuring only single admin must be present in system
     
        if (data.role === 'admin') {
            const adminExists = await User.findOne({ role: 'admin' });
            if (adminExists) {
                return res.status(403).json({ message: "Admin already exists and only one is allowed" });
            }
        }
       
        const newUser= new User(data);

        //Saving the New User to database
        
        const response= await newUser.save();
        console.log("Data Saved");
        
        const payload={
            id : response.id
        }
        const token=generatetoken(payload);
        console.log("Token is :",token);
        res.status(200).json({response : response, token : token});
    
       
       
       
    


    } catch (err) {
        console.log(err);
        res.status(500).json({error:'Internal Server Error'}); 
    }
})

//Login User 
router.post('/login',async (req ,res)=>{
  try{
       // Extract the aadhar number and password from body

    const { aadharCardNumber ,password}=req.body;
    
    // Find the user by aadharcardnumber

    const user= await User.findOne({aadharCardNumber : aadharCardNumber});

    if(!user || !(await user.ComparePassword(password))){
        return res.status(401).json({error:"Invalid username or password"});
    }
   //Generate token
   const payload={
    id: user.id,
   }
  const token =generatetoken(payload);

  //return token as respond
  res.json({token})
  }catch(err){
    console.log(err);
    res.status(500).json({error : "Internal Server Error"});
  }
   


    
})




 

 // Profile Route
 router.get('/profile',jwtAuthMiddleware,async (req,res)=>{
      try {
        const userData= req.user;
        const userid=userData.id;
        const users= await User .findById(userid);

        res.status(200).json({users});
      } catch (err) {
        console.log(err);
        res.status(500).json({error : "Internal Server Error"});
      }
 })
 

router.put('/profile/password',jwtAuthMiddleware,async (req,res)=>{
    try {
        const userid=req.user.id; //extract the id from token
        const {currentpassword,newpassword}=req.body    //Extract current and new password from req.body
        
        //find user by userid
        const user= await User.findById(userid);
      
        if( !(await user.ComparePassword(currentpassword))){
            return res.status(401).json({error:"Invalid username or password"});
        }
        
        //Update the password
        user.password=newpassword;
        await user.save();

       console.log('Password Updated');
       res.status(200).json({message:"Password Updated"});
       
       
        
    } catch (error) {
        console.log(err);
        res.status(500).json({error:'Internal Server Error'}); 
    }
})
module.exports = router;
