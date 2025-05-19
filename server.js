const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const moment = require('moment')
const path = require('path')

//Middleware section
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const session = require('express-session')
const passUserToView = require('./middleware/pass-user-to-view')
const isSignedIn = require('./middleware/is-signed-in')

//checking the port
const port = process.env.PORT ? process.env.PORT : '3000'
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})
//Using Malware
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)
app.get('/', async (req, res) => {
  res.render('index.ejs')
})
const authentication = require('./controllers/user.js')
app.use('/auth', authentication)

app.use(passUserToView)

app.get('/home', (req, res) => {
  res.render('home/home')
})
//profile

app.get('/profile', async (req, res) => {
  res.render('profile/profile.ejs') 
})

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`)
})


//comment
app.get('/comments', async (req, res) => {
  res.render('comment/comment.ejs');
});





//just a small note
