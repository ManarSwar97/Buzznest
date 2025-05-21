const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
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


router.get("/sign-up", async (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.post("/sign-up", upload.single("image"), async (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const email = req.body.email;

  const existingUsername = await User.findOne({ username });
  const existingEmail = await User.findOne({ email });

  if (existingUsername) return res.send("Username already taken.");
  if (existingEmail) return res.send("Email already registered.");
  if (password !== confirmPassword) return res.send("Passwords do not match.");

  const hashedPass = bcrypt.hashSync(password, 12);

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    username,
    password: hashedPass,
    image: req.file ? req.file.filename : null, 
  });

  req.session.user = {
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    username: newUser.username,
    image: newUser.image,
    _id: newUser._id,
  };

  req.session.save(() => {
    res.redirect("/");
  });
});

router.get("/sign-in", async(req, res)=>{
    res.render("auth/sign-in.ejs")
})
router.post("/sign-in", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
        return res.send("Invalid Username");
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
        return res.send("Invalid Password");
    }
    req.session.user = {
        username: existingUser.username,
        _id: existingUser._id
    };
    res.redirect("/home");
});

router.get("/sign-out", (req, res) => {
    req.session.destroy()
    res.redirect("/")
  })

// PROFILE
// I looked at a reference from MEN STACK AUTH LESSON /controllers/auth.js
//and references from https://stackoverflow.com/questions/50220376/try-catch-setup-in-node-js
//and this https://javascript.info/try-catch
//https://www.bennadel.com/blog/2154-i-finally-understand-the-finally-part-of-a-try-catch-control-statemen
// //https://stackoverflow.com/questions/42013104/placement-of-catch-before-and-after-thent.htm


router.get('/profile', (req, res) => {
  if (!req.session.user) {
    res.redirect('/sign-in')
    return
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        res.redirect('/')
        return
      }

      res.render('profile/profile.ejs', { user })
    })
    .catch((error) => {
      console.log(error)
      res.send('Something went wrong!')
    })
})
// Updated profile routes in auth.js
// Route for viewing the current user's profile
// Current user's profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(404).render('errors/404');
    }
    res.render('profile/profile.ejs', { 
      user,
      isCurrentUser: true 
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('errors/500');
  }
});

// Other users' profiles
router.get('/profile/:userId',  async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).render('errors/404');
    }
    res.render('profile/profile.ejs', { 
      user,
      isCurrentUser: req.session.user._id === req.params.userId.toString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('errors/500');
  }
});
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.render('profile/profile.ejs', { user });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/:userId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    res.render('profile/edit.ejs', {
      profile: currentUser,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.put('/:userId', upload.single('image'), async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
   const updatedData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
    };

    if (req.file) {
      updatedData.image = req.file.filename;
    }

    await currentUser.updateOne(updatedData);

    res.redirect(`/profile/${req.params.userId}`);

  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router
