const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const dbConnect = require('./db/dbConnect');
const bcrypt = require('bcrypt');
const User = require('./db/userModel')

dbConnect();
console.log("test")

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


module.exports = app;
