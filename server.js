const express=require('express');
const app=express();
require('dotenv').config();
const db=require('./db');

const userRoutes=require("./routes/userRoutes");
const candidateRoutes=require("./routes/candidateRoutes");
// const {jwtAuthMiddleware}=require('./jwt');

const bodyParser= require('body-parser');
app.use(bodyParser.json());
const PORT=process.env.PORT || 3000;







app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.listen(PORT,()=>{
    console.log("Listening on Port 3000");
})