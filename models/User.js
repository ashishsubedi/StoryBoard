const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    google:{
        id: String,
        email: String,
        firstName: String,
        lastName: String,
        image: String
    },
    stories: [{
        type: Schema.Types.ObjectId,
        ref: 'stories'
    }]
});

mongoose.model('users', userSchema);