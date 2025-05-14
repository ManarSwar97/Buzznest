const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const moment = require('moment')

//Middleware section
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session")

//checking the port
const port = process.env.PORT ? process.env.PORT : "3000";

//Using Malware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan('dev'));


app.get('/', async(req, res)=>{
    res.render("index.ejs")
})

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});