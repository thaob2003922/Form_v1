const fs = require('fs')
const path = require('path')
const express= require('express')
const app = express()
const Excel = require('exceljs')
const jwt = require('jsonwebtoken');
var cors = require('cors')
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(cors())
app.use(function(req,res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// //for use authentication
// const authorization = 'authorization';
// app.use((req, res, next)=>{
//     const authHeader= req.get(authorization);
//     if(!authHeader){
//         request.isUserAuth = false;
//         return next();
//     }

// const token = authHeader;
// const secret_key ='secret_key';
// let decodedToken;
// try{
//     decodedToken = JSON.jwt.verify(token, secret_key);
// }catch(err){
//     request.isUserAuth = false;
//     return next();
// }
// if(!decodedToken){
//     request.isUserAuth = false;
//     return next();
// }
// req.id= decodedToken.id;
// req.isUserAuth= true;
// next();
// });


//mongodb
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/WWPigeon")
.then(()=>{
    console.log("mongodb connect");
})
.catch(()=>{
    console.log("failed to connect");  
})

app.use(express.json());
const userRoutes = require('./routes/userRoutes.js');
app.use('/api/users', userRoutes);

const documentRoutes = require('./routes/documentRoutes.js');
app.use('/api/documents', documentRoutes);

// const userResponseRoutes = require('./routes/userResponseRoutes.js');
// app.use('/api/userResponse', userResponseRoutes);

app.listen(8000,()=>{
    console.log("port connected");
})