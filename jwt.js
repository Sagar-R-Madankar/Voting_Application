const jwt=require('jsonwebtoken');

const jwtAuthMiddleware = async  (req, res,next)=>{
    //First check whether authorization is available or not
    const authorization= req.headers.authorization;
    if(!authorization){
        return res.status(401).json({error : "Token not Found"});
    }
        //Extract the jwt tokens from the request headers
        const token =req.headers.authorization.split(' ')[1];
         if(!token){
            return res.status(401).json({error: "Unauthorized"});
         }

         try {
            //Verify the JWT token
            const decoded= jwt.verify(token,process.env.JWT_SECRET);

            //Attach user information to the request object
            req.user=decoded.userData;
            next();


         } catch (err) {
            console.log(err);
            res.status(401).json({error : "Invalid Token"});
         }





}
//Function to generate token
const generatetoken =(userData)=>{
    //Generate a new jwt token from userdata
    return jwt.sign({userData},process.env.JWT_SECRET,{expiresIn : 3000000});
}

module.exports={jwtAuthMiddleware,generatetoken};