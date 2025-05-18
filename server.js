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
const port = process.env.PORT ? process.env.PORT : "3000";
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

//importing model
const Post = require('./models/post');
const User = require('./models/user')

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
      saveUninitialized: true,
    })
  );
app.use(passUserToView)

const authentication = require("./controllers/user")
const postCtrl = require("./controllers/post")

app.use("/auth", authentication);
app.use("/posts", postCtrl);
app.use("/home", isSignedIn, postCtrl);
app.get('/profile', async (req, res) => {
  res.render('profile/profile.ejs') 
})
app.get("/", (req, res) => {
  res.render("index.ejs");
});

const groupController = require('./controllers/group.js');
const gameController = require('./controllers/game.js');
// Game routes
app.get('/games', gameController.listGames);
app.get('/games/new', gameController.showGameForm);
app.post('/games', gameController.createGame);
app.get('/games/:id', gameController.showGame);
app.delete('/games/:id', gameController.deleteGame);

// Group routes (nested under games)
app.get('/games/:gameId/groups/new', groupController.showGroupForm);
app.post('/games/:gameId/groups', groupController.createGroup);
app.delete('/games/:gameId/groups/:id', groupController.deleteGroup);


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
