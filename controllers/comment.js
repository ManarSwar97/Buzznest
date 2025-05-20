const express = require('express');
const router = express.Router();
const Comment = require('../models/comment.js');

router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().populate('user', 'username');
    res.render('comment/comment.ejs', { comments });
  } catch (error) {
    console.error(error);
    res.send('Error retrieving comments.');
  }
});

router.post('/', async (req, res) => {
  try {
    const { comment, user, post, group } = req.body;

    if (!comment) {
      return res.send('Comment cannot be empty.');
    }

    const newComment = await Comment.create({ comment, user, post, group });

    res.redirect('/comments');
  } catch (error) {
    console.error(error);
    res.send('Error posting comment.');
  }
});

module.exports = router;
