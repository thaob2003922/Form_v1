const fs = require('fs')
const path = require('path')
const express= require('express')
const app = express()
const jwt = require('jsonwebtoken');
var cors = require('cors')
var bodyParser = require('body-parser')
app.use(bodyParser.json())

app.use(cors({
    origin: '*',
    allowedHeaders: ['Authorization', 'Content-Type'], 
}));
app.use(function(req,res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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

const userResponseRoutes = require('./routes/userResponseRoutes.js');
app.use('/api/userResponse', userResponseRoutes);

const accessTypeRoutes = require('./routes/accessTypeRoutes.js');
app.use('/api/access-type', accessTypeRoutes);

const userformRelatedRoutes = require('./routes/userformRelatedRoutes.js');
app.use('/api/user-form', userformRelatedRoutes);
app.listen(8000,()=>{
    console.log("port connected");
})