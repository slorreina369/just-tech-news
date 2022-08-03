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

        res.render('homepage', {
            posts,
            loggedIn:req.session.loggedIn
        });
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

router.get('/post/:id', (req,res) =>{
    const post = {
        id:1,
        post_url:'https://handlebarsjs.com/guide/',
        title:'Handlebars Docs',
        created_at: new Date(),
        vote_count:10,
        comments:[{},{}],
        user:{
            username:'test_user'
        }
    };
    res.render('single-post', {
        post,
        loggedIn:req.session.loggedIn
    });
    Post.findOne({
        where:{
            id:req.params.id
        },
        attributes:[
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'],
        ],
        include:[
            {
                model:Comment,
                attributes:['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include:{
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
        if(!dbPostData){
            res.status(400).json({message:'No post found with this id'});
            return;
        }
        const post = dbPostData.get({plain:true});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;