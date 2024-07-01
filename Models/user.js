const mongoose=require('mongoose');
const brcypt=require('bcrypt');

//Define the Person Schema
const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required :true
    },
    email :{
        type :String,
        
    },
    mobile:{
        type:String,
    },
    address :{
        type :String,
        required :true
    },
    aadharCardNumber :{
        type :Number,
        required :true,
        unique :true
    },
    password :{
        type :String,
        required:true
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:'voter'
    },
    isVoted :{
        type: Boolean,
        default:false
    }
 


})

userSchema.pre('save',async function(next){
    const user=this;
    //Hash the password only if it has been modified  or is new
    if(!user.isModified('password')){
        return next();
    }
    try {
        //hash password generation
        const salt=await brcypt.genSalt(10);

        //hash password

        const hashPassword= await brcypt.hash(user.password,salt);

        //Override the plain password with hash password
        user.password=hashPassword;
        next();

    } catch (err) {
        return next(err);
        
    }
})

userSchema.methods.ComparePassword= async function(candidatepassword){
    try {
        
        //Use bcrypt to compare the provided password with the hashed password

        const isMatch=await brcypt.compare(candidatepassword,this.password);

        return isMatch;
    } catch (err) {
        
        throw err;
        
    }
}
// Creating a Person Model
const User=mongoose.model('User',userSchema);
module.exports = User;