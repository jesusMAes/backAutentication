const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const dbConnect = require('./db/dbConnect');
const User = require('./db/userModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const auth = require('./auth')


dbConnect();

//handle cors error. To allow consulting from other sites
app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );

  next();
})

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

//register user
app.post("/register", (req,res) => {
  //encrypt the password
  bcrypt.hash(req.body.password, 10)
          .then((hashedPassword) => {
            //proceed to save the user in db
            const user = new User({
              email: req.body.email,
              password: hashedPassword
            })

            user.save().then((result) => {
              res.status(201).send({
                message: 'User created successfully',
                result
              });
            })
              .catch((err) => {
                res.status(500).send({
                  message:'Error creating user',
                  err
                })  
               })
          })
        .catch((e) => {
          res.status(500).send({
            message: 'Password cannot be hashed',
            e
          })
        })
})//register post


//endpoint for login
app.post('/login', (req,res) => {
  //check if the email exist
  User.findOne({email:req.body.email })
    .then((user) => {
      //use hash to compare
      bcrypt.compare(req.body.password, user.password)
            .then((passwordCheck) => {
              //check if not matches
              if(!passwordCheck){
                return res.status(400).send({
                  message: 'Wrong password', 
                  err
                })
              }

              //if matches create token
              const token = jwt.sign({
                userId: user._id,
                userEmail: user.email
              }, "RANDOM-TOKEN", {
                expiresIn: "24h"
              })

              res.status(200).send({
                message: "Login Successful",
                email: user.email,
                token
              })
            })
            .catch((err) => {
              res.status(400).send({
                message: 'Password does not match',
                err
              })
            })
    })
    .catch((err) => {//
      res.status(404).send({
        message: 'Email not found',
        err
      })
    })
})


//protect the endpoints
app.get("/free-endpoint", (req,res) => {
  res.json({message: 'Everyone can access me'})
})

app.get('/auth-endpoint', auth, (req,res) => {
  res.json({message: 'Only users can access me'})
})

module.exports = app;
