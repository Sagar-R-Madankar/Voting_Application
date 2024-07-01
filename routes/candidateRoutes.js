const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');

const Candidate=require('../Models/candidate');
const User=require('../Models/user');
const {jwtAuthMiddleware}=require('../jwt');

//Post route to add a candidate
const CheckAdminRole = async (userId)=>{
  try {
    
    const user=await User.findById(userId);
    if(user.role === 'admin'){
        return true;
    }
  } catch (err) {
    return false;
  }
}
router.post('/',jwtAuthMiddleware,async(req,res) =>{

    try {
        //Check Admin Role
        if(CheckAdminRole(req.user.id)){
          
              //Creating a newcandidCandidatedocument using candidate Model

        const data= req.body
        const newCandidate= new Candidate(data);

        //Saving the New User to database
        const response = await newCandidate.save();
        console.log("Data Saved");
        res.status(200).json({response: response});
      
        }
        else{
            res.status(403).json({message:"User is not admin"})
        }
      
        
       


    } catch (err) {
        console.log(err);
        res.status(500).json({error:'Internal Server Error'}); 
    }
})

   




 

router.put('/:candidateId',jwtAuthMiddleware, async (req,res)=>{
    try {
        if(!CheckAdminRole(req.user.id)){
            return res.status(404).json({message : "User has not Admin Role" }); 
        }
       
      
        
        const cleanId = req.params.candidateId.trim();

        if (!mongoose.Types.ObjectId.isValid(cleanId)) {
            return res.status(400).send('Invalid ID format');
        }

        const candidateid = new  mongoose.Types.ObjectId(cleanId);

        const updateCandidatedata =req.body;

        const response=await Candidate.findByIdAndUpdate(candidateid,updateCandidatedata,{
            new: true,
            runValidators :true,
        })

       
       if(!response){
        return res.status(404).json({error :"Candidate not Found"});
       }
       console.log("Candidate Updated");
       res.status(200).json({response});
       
       
        
    } catch (err) {
        console.log(err);
        res.status(500).json({error:'Internal Server Error'}); 
    }
})

router.delete('/:candidateId',jwtAuthMiddleware, async (req,res)=>{
    try {
        if(!CheckAdminRole(req.user.id)){
            return res.status(404).json({message : "User has not Admin Role" }); 
        }
       
      
       
        const cleanId = req.params.candidateId.trim();

        if (!mongoose.Types.ObjectId.isValid(cleanId)) {
            return res.status(400).send('Invalid ID format');
        }

        const candidateid = new  mongoose.Types.ObjectId(cleanId);


        const response=await Candidate.findByIdAndDelete(candidateid,{
            new: true,
            runValidators :true,
        })

       
       if(!response){
        return res.status(404).json({error :"Candidate not found"});
       }
       console.log("Candidate Deleted");
       res.status(200).json({response});
       
       
        
    } catch (err) {
        console.log(err);
        res.status(500).json({error:'Internal Server Error'}); 
    }
})
//Lets Start Voting

router.post('/vote/:candidateid',jwtAuthMiddleware,async (req,res)=>{



 const  candidateId=req.params.candidateid
 const userid=req.user.id;
 console.log('candidateId:', candidateId);
    console.log('userId:', userid);


try {

    // id user has voted already it cannot vote again 
    //admin cannot vote at all

  const candidate=await Candidate.findById(candidateId);
  if(!candidate){
    return res.status(404).json({message: "Candidate not found"});
  }
  const user=await User.findById(userid);
  if(!user){
    return res.status(404).json({message: "User not found"});

  }
if(user.role === 'admin'){
    return res.status(403).json({message : "Admin cannot Vote"});
}
if(user.isVoted){
    return res.status(400).json({message: "Cannot Vote again"});
}

//Update the candidate document to update the count
candidate.votes.push({user: userid});
candidate.votecount++;
await candidate.save();

//update the user document 
user.isVoted=true;
await user.save();

res.status(200).json({message : "Vote recorded Successfully"});


    
} catch (err) {
    


     console.log(err);
     res.status(500).json({error:'Internal Server Error'}); 

}



})

router.get('/vote/count', async (req,res)=>{
    try {
      //Find all the cnadidate and sort them according to vote count

      const candidate= await Candidate.find().sort({votecount :'desc'});

      // Map the candidate to only return their vote count
     const voteRecord= candidate.map((data)=>{
        return {
            party: data.party,
            count :data.votecount
        }
     })

     res.status(200).json(voteRecord); 
        
        
    } catch (err) {
        console.log(err);
        res.status(500).json({error:'Internal Server Error'}); 
    }
})
router.get('/candidate',jwtAuthMiddleware,async (req,res)=>{
     try {
        const listofcandidates=await Candidate.find();
        const response=listofcandidates.map((data)=>{
            return{
                name :data.name,
                party :data.party
            }
        })

        res.status(200).json(response);
     } catch (err) {
        console.log(err);
        res.status(500).json({error:'Internal Server Error'}); 
     }
})
module.exports = router;
