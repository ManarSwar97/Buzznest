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
    postData.group = req.body.groupId;

    // Create and save post
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

router.get('/:postId', async (req, res)=>{
    try{
        const showPost = await Post.findById(req.params.postId).populate('user').populate('likes.users', 'username','comments.user');
        res.render('posts/show.ejs', {
            posts: showPost
        })
    }
    catch (error) {
    console.log(error);
    res.redirect('/');
  }
})



// Like a post
router.post('/:postId/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const userId = req.session.user._id;

    // Check if user already liked the post
    const userIndex = post.likes.users.findIndex(id => id.equals(userId));

    if (userIndex === -1) {
      // Add like
      post.likes.users.push(userId);
      post.likes.count += 1;
    } else {
      // Remove like
      post.likes.users.splice(userIndex, 1);
      post.likes.count -= 1;
    }

    await post.save();
    res.json({ 
      success: true, 
      likesCount: post.likes.count,
      isLiked: userIndex === -1 // returns true if now liked, false if now unliked
    });
  } catch (error) {
    console.error('Error updating likes:', error);
    res.status(500).json({ success: false, error: 'Error updating likes' });
  }
});

// Get like status for current user
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


router.post('/:postId', async (req, res) => {
  try {
  const post = await Post.findById(req.params.postId)
  .populate('user')
  .populate('group')
  .populate('likes.users', 'username','comments.user');

    // Check if user already favorited the post
    const index = post.favoritedByUsers.findIndex((user) =>
      user.equals(req.session.user._id)
    );    

    res.render('group/show.ejs', {
      posts: post,
      userHasFavorited: index
    });
  } catch (error) {
    console.error('Error updating favorites:', error);
    res.status(500).send('Error updating favorites');
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
        const groupId = req.body.groupId || req.body.group; // Handle both cases

        const existingPost = await Post.findById(postId);

        if (!existingPost) {
            return res.status(404).send('Post not found');
        }

        let updateData = {
            postTitle: req.body.postTitle,
            postText: req.body.postText,
            group: groupId // Use the groupId we extracted
        };

        // Handle image upload
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

        // Redirect to the group page if groupId exists, otherwise home
        res.redirect(groupId ? `/group/${groupId}` : '/home');
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Add a comment to a post
// Add a comment to a post
router.post('/:postId/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const text = req.body.text; // Changed from destructuring
    
    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const newComment = {
      text,
      user: req.session.user._id
    };

    post.comments.push(newComment);
    await post.save();

    // Populate the user data for the new comment
    const populatedPost = await Post.findById(post._id)
      .populate('comments.user', 'username image');

    // Return the last comment (the one we just added)
    const addedComment = populatedPost.comments[populatedPost.comments.length - 1];
    
    res.json({ 
      success: true, 
      comment: addedComment 
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Error adding comment' });
  }
});
// Get all comments for a post
router.get('/:postId/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('comments.user', 'username image')
      .select('comments');
      
    res.json({ 
      success: true, 
      comments: post.comments 
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

// Delete a comment
router.delete('/:postId/comments/:commentId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    // Find the comment index
    const commentIndex = post.comments.findIndex(
      c => c._id.toString() === req.params.commentId
    );
    
    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Check if user is the comment author or post owner
    const comment = post.comments[commentIndex];
    const isAuthor = comment.user.equals(req.session.user._id);
    const isPostOwner = post.user.equals(req.session.user._id);
    
    if (!isAuthor && !isPostOwner) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }
    
    // Remove the comment
    post.comments.splice(commentIndex, 1);
    await post.save();
    
    res.json({ 
      success: true 
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Error deleting comment' });
  }
});

  module.exports = router;


