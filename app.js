const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const keys = require('./config/keys');

//Load User Model
require('./models/User');

//Passport config
require('./config/passport')(passport);



//Mongoose Connect
mongoose.connect(keys.mongoURI,{useNewUrlParser: true, useCreateIndex: true})
    .then(()=>{
        console.log("MongoDB Connected...");
    })
    .catch(err=>console.log(err));


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cookieParser())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

//Passport Middleware

app.use(passport.initialize());
app.use(passport.session());

//Global variables

app.use((req,res,next) =>{
    res.locals.user = req.user || null;
    next();
})

//Routes
const index = require('./routes/index');
const auth = require('./routes/auth');


app.use('/', index);

app.use('/auth',auth);

app.listen(PORT,console.log(`Server started at ${PORT}`));