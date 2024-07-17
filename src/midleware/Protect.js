const jwt = require('jsonwebtoken');
require('dotenv').config()

const Protect = async (req,res,next) => {
    try{

    let {authorization} = req.headers
    let bearer = authorization.split(" ")

    let decoded = await jwt.verify(bearer[1],process.env.JWT_TOKEN);
    req.payload = decoded  
    next()
    } catch(err){
        return res.status(404).json({"status":404,"message":"token wrong",err})
    }

}

module.exports = {Protect}