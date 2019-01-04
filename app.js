const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');


const keys = require('./config/keys');

//Handlebars helpers
const {
    truncate,
    stripTags,
    select,
    formatDate,
    editIcon
} = require('./helpers/hbs');

//Load User Model
require('./models/User');
require('./models/Story');

//Passport config
require('./config/passport')(passport);



//Mongoose Connect
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
        console.log("MongoDB Connected...");
    })
    .catch(err => console.log(err));


const app = express();
const PORT = process.env.PORT || 3000;


app.engine('handlebars', exphbs({
    helpers: {
        truncate,
        stripTags,
        formatDate,
        select,
        editIcon
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//method Override
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));
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

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
})

//Routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');
const profile = require('./routes/profile');


app.use('/', index);

app.use('/auth', auth);
app.use('/stories', stories);
app.use('/profile', profile);

app.listen(PORT, console.log(`Server started at ${PORT}`));