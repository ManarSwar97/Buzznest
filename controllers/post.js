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
    // Get data from session if exists
    const formData = req.session.formData || {};
    
    // Clear the session data after retrieving
    if (req.session.formData) {
      req.session.formData = null;
    }

    res.render("posts/new.ejs", {
      groupId: req.query.groupId || null,
      error: formData.error || null,
      body: {
        postTitle: formData.postTitle || '',
        postText: formData.postText || ''
      }
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.post("/", upload.single('postImage'), async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug log
    console.log('Uploaded file:', req.file); // Debug log

    // Validate required fields
    if (!req.body.postTitle) throw new Error('Post title is required');
    if (!req.body.postText) throw new Error('Post content is required');
    if (!req.file) throw new Error('Image upload failed');

    // Verify user session
    if (!req.session.user || !req.session.user._id) {
      throw new Error('User not authenticated');
    }

    const user = await User.findById(req.session.user._id);
    if (!user) throw new Error('User not found');

    // Prepare post data
    const postData = {
      postTitle: req.body.postTitle,
      postText: req.body.postText,
      postImage: req.file.filename,
      user: user._id
    };

    // Add group reference if valid
    if (req.body.groupId) {
      if (!mongoose.Types.ObjectId.isValid(req.body.groupId)) {
        throw new Error('Invalid group ID format');
      }
      postData.group = req.body.groupId;
    }

    // Create and save post
    const post = new Post(postData);
    await post.save();
    console.log('New post created:', post); // Debug log

    // Successful redirect
    return res.redirect(postData.group 
      ? `/group/${postData.group}`
      : '/home'
    );

  } catch (error) {
    console.error('POST CREATION ERROR:', error);
    
    // Store form data and error in session
    req.session.formData = {
      postTitle: req.body.postTitle,
      postText: req.body.postText,
      error: error.message
    };
    
    const redirectUrl = req.body.groupId 
      ? `/posts/new?groupId=${req.body.groupId}`
      : '/posts/new';
    
    return res.redirect(redirectUrl);
  }
})



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
module.exports = router;
