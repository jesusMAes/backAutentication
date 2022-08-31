const mongoose = require('mongoose');
require('dotenv').config();

//function for connect database

async function dbConnect(){
  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'User-autentication'
  })
    .then(() => {
      console.log("Successfully conected to MongoDb")
    })
    .catch((error) => {
      console.log("an error ocurred")
      console.log(error)
    })

}

//export for require it in other files
module.exports = dbConnect