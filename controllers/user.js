const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
router.get('/sign-up', async (req, res) => {
  res.render('auth/sign-up.ejs')
})
router.post('/sign-up', async (req, res) => {
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const username = req.body.username
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  const email = req.body.email
  const image = req.body.image

  const existingUsername = await User.findOne({ username })
  const existingEmail = await User.findOne({ email })

  if (existingUsername) {
    return res.send('Username already taken.')
  }

  if (existingEmail) {
    return res.send('Email already registered.')
  }

  if (password !== confirmPassword) {
    return res.send('Password and Confirm password are not the same.')
  }
  const hashedPass = bcrypt.hashSync(req.body.password, 12)
  req.body.password = hashedPass

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    username,
    password: req.body.password,
    image
  })

  req.session.newUser = {
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    username: newUser.username,
    image: newUser.image
  }

  req.session.save(() => {
    res.redirect('/')
  })
})

router.get('/sign-in', async (req, res) => {
  res.render('auth/sign-in.ejs')
})
router.post('/sign-in', async (req, res) => {
  const username = req.body.username
  const password = req.body.password

  const existingUser = await User.findOne({ username })
  if (!existingUser) {
    return res.send('Invalid Username')
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password)
  if (!isPasswordValid) {
    return res.send('Invalid Password')
  }
  req.session.user = {
    username: existingUser.username,
    _id: existingUser._id
  }
  res.redirect('/')
})

router.get('/sign-out', (req, res) => {
  req.session.destroy()
  res.redirect('/')
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

//comment

module.exports = router
