const comment = require("../models/comment");

const showComment = async (req,res)=>{
  const postId = req.params.id
}
//took a references from previous lesson
const comment= await comment.find({ post: postId}).populate("user");

