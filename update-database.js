const mongoose = require('mongoose');

const keys = require('./config/keys');

require('./models/User');
require('./models/Story');
const User = mongoose.model('users');
const Story = mongoose.model('stories');


//Mongoose Connect
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
        console.log("MongoDB Connected...");
    })
    .catch(err => console.log(err));




User.find({ stories: { $exists: false } })
    .then(users => {
        users.forEach(currentUser => {
            Story.find({ user: currentUser.id })
                .then(currentStories => {
                    User.updateMany({ _id: currentUser.id }, {
                        $set: {
                            stories: currentStories
                        }
                    })
                    .then(user=>{
                        console.log(user);
                    })
                })
        })
    })