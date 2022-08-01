const router = require('express').Router();
const {Post, User, Vote, Comment} = require('../models');
const sequelize = require('../config/connection');

router.get('/', (req,res) =>{
    console.log(req.session);

    Post.findAll({
        attributes:[
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        includes:[
            {
                model:Comment,
                attributes:['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                includes:{
                    model:User,
                    attributes:['username']
                }
            },
            {
                model:User,
                attributes:['username']
            }
        ]
    })
    .then(dbPostData =>{
        const posts = dbPostData.map(post => post.get({plain: true}));

        res.render('homepage', {posts});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/login', (req,res) =>{
    if(req.session.loggedIn){
        res.redirect('/');
        return;
    }
    res.render('login');
});

module.exports = router;