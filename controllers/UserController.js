const { hash, compare } = require('bcrypt');
const AppError = require('../utils/AppError');
const validateEmail = require('../utils/emailValidation');
const userModel = require('../models/User');
const User = require('../models/User');

class UserController{

    async create(req, res) {
        const { name, email, password, role } = req.body;
        const isEmailValid = validateEmail(email);

        if (!name)
            throw new AppError("The field name is required!");
        if (!email)
            throw new AppError("The field email is required!");
        if (isEmailValid == null)
            throw new AppError("The email is not valid");
        if(!password)
            throw new AppError("The field password is required!");

        const emailExists = await User.findEmail(email);
        
        if (emailExists)
            throw new AppError("The email is already registered", 406);
   
        const hashedPassword = await hash(password, 8);
        await userModel.new(name, email, hashedPassword, role);
        res.json({message: "The user has been created"});
            
    }
}

module.exports = new UserController();