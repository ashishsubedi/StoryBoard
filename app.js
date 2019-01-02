const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

//Passport config
require('./config/passport')(passport);

const app = express();
const PORT = process.env.PORT || 3000;

//Routes
const auth = require('./routes/auth');


app.get('/',(req,res)=>{
    res.send("WORKING");
});

app.use('/auth',auth);

app.listen(PORT,console.log(`Server started at ${PORT}`));