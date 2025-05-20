const express = require("express");
const router = express.Router();
const Group = require('../models/groups');
const User = require('../models/user');
const Game = require('../models/game');
const Post = require('../models/post');
const multer = require("multer");
const path = require("path");

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

// GET new group form
router.get("/new", async (req, res) => {
    try {
        const group = await Game.find(); // Get all games for dropdown
        res.render("group/new", { group });
    } catch (error) {
        console.error(error);
        res.redirect('/group');
    }
});

// POST create new group
router.post("/", upload.single('groupImage'), async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        const group = new Group({
            groupName: req.body.groupName,
            groupImage: req.file ? req.file.filename : 'group-default.jpg',
            game: req.body.game,
            user: user._id
        });
        await group.save();
        res.redirect('/group');
    } catch (error) {
        console.error(error);
        res.redirect('/group/new');
    }
});

//// Add this route
router.get('/groupHome', async (req, res) => {
    try {
       const groups = await Group.find({})
   
            .populate('user');
        res.render('group/groupHome.ejs', { group: groups });
    }  catch (error) {
        console.error("Error rendering groupHome:", error);
        // res.redirect('/groups'); // ← comment this for now
        res.send("Error occurred: " + error.message);
    }
});

// Keep your existing '/' route

router.get('/', async (req, res) => {
    try {
        const groups = await Group.find({})

            .populate('user');
        res.render('group/groupHome.ejs', { group: groups });
    } catch (error) {
        console.error("Error rendering groupHome:", error);
        // res.redirect('/groups'); // ← comment this for now
        res.send("Error occurred: " + error.message);
    }
});


// GET single group - Fixed version
// GET single group - Fixed version
router.get('/:groupId', async (req, res) => {
  try {
    const showGroup = await Group.findById(req.params.groupId).populate('user');
    const groupPosts = await Post.find({ group: req.params.groupId }).populate('user');
    
    res.render('group/show', {
      groupSingle: showGroup,
      posts: groupPosts,
      currentUser: req.session.user // Make sure this is included
    });
  } catch (error) {
    console.error(error);
    res.redirect('/group');
  }
});

// DELETE group
router.delete('/:groupId', async (req, res) => {
    try {
        await Group.findByIdAndDelete(req.params.groupId);
        res.redirect('/group');
    }  catch (error) {
        console.error("Error rendering groupHome:", error);
        // res.redirect('/groups'); // ← comment this for now
        res.send("Error occurred: " + error.message);
    }
});




module.exports = router;
