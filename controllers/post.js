const express = require("express")
const router = express.Router()
const mongoose = require('mongoose');
const Post = require("../models/post")
const User = require("../models/user");
const group = require("../models/groups")
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
//display new form to user
router.get("/new", async (req, res) => {
  try {
    res.render("posts/new.ejs")
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});
//allow user to create new post
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
    const post = new Post(postData);
    await post.save();
    postData.group = req.body.groupId;

    await post.save();


    return res.redirect(postData.group
      ? `/group/${postData.group}`
      : '/home'
    );

  }  catch (error) {
    console.log(error);
    res.redirect('/');
  }
})
//show a single post in the show.ejs page
router.get('/:postId', async (req, res)=>{
    try{
        const showPost = await Post.findById(req.params.postId).populate('user').populate('likes.users', 'username');
        res.render('posts/show.ejs', {
            posts: showPost
        })
    }
    catch (error) {
    console.log(error);
    res.redirect('/');
  }
})



//show if the user like or unlike a post
router.post('/:postId/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const userId = req.session.user._id;

    const userIndex = post.likes.users.findIndex(id => id.equals(userId));

    if (userIndex === -1) {
      post.likes.users.push(userId);
      post.likes.count += 1;
    } else {
      post.likes.users.splice(userIndex, 1);
      post.likes.count -= 1;
    }

    await post.save();
    res.json({ 
      success: true, 
      likesCount: post.likes.count,
      isLiked: userIndex === -1 
    });
  } catch (error) {
    console.error('Error updating likes:', error);
    res.status(500).json({ success: false, error: 'Error updating likes' });
  }
});

//check if the post is liked by the user or not
router.get('/:postId/like-status', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.json({ isLiked: false });
    }
    
    const post = await Post.findById(req.params.postId);
    const isLiked = post.likes.users.some(id => id.equals(req.session.user._id));
    
    res.json({ isLiked });
  } catch (error) {
    console.error('Error getting like status:', error);
    res.status(500).json({ error: 'Error getting like status' });
  }
});

//load the post in the group page
router.post('/:postId', async (req, res) => {
  try {
  const post = await Post.findById(req.params.postId)
  .populate('user')
  .populate('group')
  .populate('likes.users', 'username');

    const index = post.favoritedByUsers.findIndex((user) =>
      user.equals(req.session.user._id)
    );    

    res.render('group/show.ejs', {
      posts: post,
      userHasFavorited: index,
      sessionUserId: req.session.user._id.toString()
    });
  } catch (error) {
    console.error('Error updating favorites:', error);
    res.status(500).send('Error updating favorites');
  }
});
//use to delete the post by the post id
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

// router.get('/:postId/edit', async(req, res)=>{
//     try{
//         const editPost = await Post.findById(req.params.postId)
//         res.render('posts/edit.ejs', {
//             posts: editPost
//         })
//     }
//     catch (error) {
//     console.log(error);
//     res.redirect('/');
//   }
// })

router.put('/:postId', upload.single('postImage'), async (req, res) => {
    try {
        const postId = req.params.postId;
        const groupId = req.body.groupId || req.body.group; 

        const existingPost = await Post.findById(postId);

        if (!existingPost) {
            return res.status(404).send('Post not found');
        }

        let updateData = {
            postTitle: req.body.postTitle,
            postText: req.body.postText,
            group: groupId 
        };

        if (req.file) {
            updateData.postImage = req.file.filename;
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(500).send('Failed to update post');
        }

        res.redirect(groupId ? `/group/${groupId}` : '/home');
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).send('Internal Server Error');
    }
});
  module.exports = router;


