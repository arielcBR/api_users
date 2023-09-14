const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');
const secret = 'gatito';

module.exports = function(req, res, next){
    const authToken = req.headers['authorization'];
    let decoded;

    if(authToken != undefined){
        const bearer = authToken.split(' ');
        const token = bearer[1];

        try {
            decoded = jwt.verify(token, secret);
            console.log("Decoded: ", decoded);
        } catch (error) {
            throw new AppError(error.message, 401);
        }

        if(decoded.role){
            next();
        }
        else{
            throw new AppError("You do not have authorization!", 401);  
        }
        

    }
    else{
        throw new AppError("You are not authenticated!", 403);
    }


}