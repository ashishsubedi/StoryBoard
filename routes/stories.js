const router = require('express').Router();
const { ensureAuthenticated } = require('../helpers/auth');

const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');

//GET /stories
router.get('/', (req, res) => {

    Story.find({ status: 'public' })
        .populate({
            path: 'user',
            populate: {
                path: 'user',
                model: 'users'
            }
        })
        .then(stories => {
            
            console.log(stories);
            res.render('stories/index', {
                stories: stories
            });

        })
        .catch(err => { throw err });


});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

router.post('/', (req, res) => {
    let allowComments;

    if (req.body.allowComments) {
        allowComments = true;
    } else {
        allowComments = false;
    }

    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments,
        user: req.user.id
    }

    new Story(newStory)
        .save()
        .then(story => {
            res.redirect(`/stories/show/${story._id}`);
        })

})


module.exports = router;
