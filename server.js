const mongoose=require('mongoose')
const connectDB= mongoose.connect("mongodb://127.0.0.1:27017/PRETTY_FINDS")
.then(()=>{
    console.log("connected");
})
.catch((err)=>{

    console.log(err);

})

const express = require('express');
const app = express();
const path=require('path')
const concetDB = require("./config/config");
const randomstring = require('randomstring');
const nodemailer = require("nodemailer");
const multer = require('multer');


const userRoute=require('./router/userRoute')
const adminRoute=require('./router/adminRoute')


// Define a route for the root URL
app.set("view engine", "ejs");
app.set('views', [
    path.join(__dirname, 'views', 'admin'),
    path.join(__dirname, 'views', 'user'),
    
  ])

app.use(express.static(path.join(__dirname, 'public/user/user-assets')))
app.use(express.static(path.join(__dirname, 'public/admin')))

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static("public"))
app.use('/',userRoute)
app.use('/',adminRoute)

// Start the server
// const port = process.env.PORT || 3000;
const port =3010
app.listen(port, () => {
    console.log("Listening to the server on http://localhost:"+ port);
  });

  