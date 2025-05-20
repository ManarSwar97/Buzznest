const express = require("express")
const router = express.Router()
const mongoose = require('mongoose');
const Post = require("../models/post")
const User = require("../models/user");
const multer = require("multer");
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }); 


router.get("/new", async (req, res) => {
  try {
    res.render("posts/new.ejs")

  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.post("/", upload.single('postImage'), async (req, res) => {
  try {

    const user = await User.findById(req.session.user._id);

    const postData = {
      postTitle: req.body.postTitle,
      postText: req.body.postText,
      postImage: req.file.filename,
      user: user._id
    };

    postData.group = req.body.groupId;

    // Create and save post
    const post = new Post(postData);
    await post.save();

    // Successful redirect
    return res.redirect(postData.group 
      ? `/group/${postData.group}`
      : '/home'
    );

  }  catch (error) {
    console.log(error);
    res.redirect('/');
  }
})



router.get('/:postId/favorited-by/:userId', async (req, res) => {
  try {
    const showPost = await Post.findById(req.params.postId).populate('user');

    const userHasFavorited = showPost.favoritedByUsers.some((user) =>
      user.equals(req.session.user._id)
    );

    res.render('group/show.ejs', {
      posts: showPost,
      userHasFavorited: userHasFavorited,
      currentUser: req.session.user

    });

  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

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

router.get('/:postId/edit', async(req, res)=>{
    try{
        const editPost = await Post.findById(req.params.postId)
        res.render('posts/edit.ejs', {
            posts: editPost
        })
    }
    catch (error) {
    console.log(error);
    res.redirect('/');
  }
})
router.put('/:postId', async(req, res)=>{
    try{
        const updatePost = await Post.findById(req.params.postId)
        await updatePost.updateOne(req.body);
        res.redirect(`/posts/${req.params.postId}`);

    }
    catch (error) {
    console.log(error);
    res.redirect('/');
  }
})

router.post('/:postId/favorited-by/:userId', async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.postId, {
      $push: { favoritedByUsers: req.params.userId },
    });
    res.redirect(`/posts/${req.params.postId}/favorited-by/${req.params.userId}`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
