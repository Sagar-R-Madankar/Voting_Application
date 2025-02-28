const mongoose=require('mongoose');
const brcypt=require('bcrypt');

//Define the Person Schema
const candidateSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    party :{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    votes :[
        {
          user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
          },
          votedAt :{
            type:Date,
            default:Date.now()
          }

        }
    ],
    votecount :{
        type:Number,
        default:0
    }


})


// Creating a Person Model
const Candidate=mongoose.model('Candidate',candidateSchema);
module.exports = Candidate;