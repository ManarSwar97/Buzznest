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





module.exports = router;
