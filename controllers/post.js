const express = require("express")
const router = express.Router()
const Post = require("../models/post")
const User = require("../models/user");


router.get("/new", (req, res)=>{
    res.render("posts/new.ejs")
})
router.post("/", async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        const post = new Post({
            postTitle: req.body.postTitle,
            postText: req.body.postText,
            postImage: req.body.postImage,
            user: user._id 
        });
        await post.save();
        res.redirect(`/home`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/', async(req, res) => {
    try {
        const displayPosts = await Post.find({}).populate('user');
        res.render('home/home', { posts: displayPosts });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/:postId', async (req, res)=>{
    try{
        const showPost = await Post.findById(req.params.postId).populate('user')
        res.render('posts/show.ejs', {
            posts: showPost
        })

    }
    catch (error) {
    console.log(error);
    res.redirect('/');
  }
})

router.delete('/:postId', async(req, res)=>{
    try{
        const deletePost = await Post.findById(req.params.postId)
        await deletePost.deleteOne();
        res.redirect('/home');
    }
    catch (error) {
    console.log(error);
    res.redirect('/');
  }
})


module.exports = router;
