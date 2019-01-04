const router = require('express').Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
//List all stroies from a user

router.get('/user/:userId', (req, res) => {
    User.findOne({ _id: req.params.userId })
        .populate('stories')
        .sort({ 'stories.date': 'desc' })
        .then(userProfile => {
            let publicStories = userProfile.stories.filter(story=> story.status === 'public');
            
            let userInfo = userProfile.google;
           
            res.render('index/userProfile', {
                userInfo: userInfo,
                stories: publicStories,
                currentUser: req.user
            });
        })
        .catch(err => { throw err });

});


//My Story
router.get('/my', ensureAuthenticated, (req, res) => {
    User.findOne({ _id: req.user.id })
        .populate('stories')
        .sort({ 'stories.date': 'desc' })
        .then(user => {
            
            res.render('index/userProfile', {
                userInfo : user,
                stories: user.stories
            });
        })
        .catch(err => { throw err });

});

module.exports = router;