const router = require('express').Router();
const { ensureAuthenticated } = require('../helpers/auth');

const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');

//GET /stories
router.get('/', (req, res) => {

    Story.find({ status: 'public' })
        .sort({ date: 'desc' })
        .populate({
            path: 'user',
            populate: {
                path: 'user',
                model: 'users'
            }
        })
        .then(stories => {

            res.render('stories/index', {
                stories: stories
            });

        })
        .catch(err => { throw err });


});

//GET: Add Story
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});
//POST: ADD STORY
router.post('/', ensureAuthenticated, (req, res) => {
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
        });

});

//GET: SHow specific Story
router.get('/show/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
        .populate('user')
        .populate('comments.commentUser')

        .then(story => {
            if (story.status == 'public') {
                res.render('stories/show', { story });
            } else {
                if (req.user) {
                    if (req.user.id === story.user._id) {
                        res.render('stories/show', { story });

                    } else {
                        res.redirect('/stories');
                    }
                } else {
                    res.redirect('/stories');
                }
            }
        })

        .catch(err => { throw err });
})

//List all stroies from a user

router.get('/user/:userId', (req, res) => {

    Story.find({ user: req.params.userId, status: 'public' })
        .populate('user')
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });
        })
        .catch(err => { throw err });
});

//My Story
router.get('/my', ensureAuthenticated, (req, res) => {
    Story.find({ user: req.user.id })
        .populate('user')
        .then(stories => {
            res.render('stories/index', {
                stories: stories
            });
        })
        .catch(err => { throw err });
});


//GET: Edit Specific Story
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
        .then(story => {
            if (story.user != req.user.id) {
                res.redirect('/stories');
            } else {
                res.render('stories/edit', {
                    story: story
                });
            }


        })
        .catch(err => { throw err });
})

//PUT: Update Story
router.put('/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
        .then(story => {
            let allowComments;

            if (req.body.allowComments) {
                allowComments = true;
            } else {
                allowComments = false;
            }


            story.title = req.body.title;
            story.body = req.body.body;
            story.status = req.body.status;
            story.allowComments = allowComments;


            story.save()
                .then(story => {
                    res.redirect('/dashboard');
                });


        })
        .catch(err => { throw err });
});

//DELETE: Story
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Story.remove({
        _id: req.params.id
    })
        .then(() => {
            res.redirect('/dashboard');
        })
});


//ADD COMMENT
router.post('/comment/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({ _id: req.params.id })
        .then(story => {
            const newComment = {
                commentBody: req.body.commentBody,
                commentUser: req.user.id
            }
            //Add to begining (push adds to last)
            story.comments.unshift(newComment);
            story.save()
                .then(story => {
                    res.redirect(`/stories/show/${story.id}`);
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});



module.exports = router;
