const jwt = require('jsonwebtoken')

//here encapsulates the autenticathion function as a middleware

module.exports = async (req,res,next) => {
  try {
    //get the autorization token
    const token = await req.headers.authorization.split(" ")[1]

    //check if mathes 
    const decodedToken = await jwt.verify(token, "RANDOM-TOKEN");

    //Pass the token to the user
    const user = await decodedToken;
    //pass user to the endpoint
    req.user = user
    
    //continue to the endpoint
    next()
  } catch (error) {
    res.status(401).json({
      error: 'Invalid request!'
    })
  }
}