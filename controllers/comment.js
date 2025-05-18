const comment = require("../models/comment");


const getForm = (req, res)=>{
  res.render("comment-form");
};




const postComment = async (req, res) => {
  try {
    await Comment.create({
      comment: req.body.comment,
      post: req.body.postId
    });

    res.redirect('/comment-form'); 
  } catch (err) {
    console.log(err);
    res.redirect('/comment-form?error=1'); 
  }
};

module.exports= router