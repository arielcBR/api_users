const { hash, compare } = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const validateEmail = require('../utils/emailValidation');
const User = require('../models/User');
const PasswordToken = require('../models/PasswordToken');

const secret = "gatito";

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
        await User.new(name, email, hashedPassword, role);
        res.json({message: "The user has been created"});
            
    };

    async findAll(req, res) {
        const { role } = req.body;

        if (role == 1) {
            const users = await User.findAll();
            res.json({...users});
        }
        else
            throw new AppError("You do not have permission!", 401);
    };

    async findUser(req, res) {
        const { role } = req.body;
        const { id } = req.params;
        let user;

        if (role == 1) {
            user = await User.findById(id);

            if (!user.length)
                throw new AppError("The user does not exist", 404);
            res.json({ user });
        }
        else
            throw new AppError("You do not have permission!", 401);

    };

    async edit(req, res){
        const {id, name, email, role} = req.body;

        const result = await User.update(id, email, name, role);
        if(result != undefined){
            if(result.status){
                res.json({message: "The user has been updated!"});
            }
            else{
                throw new AppError(result.message, 406);
            }
        }
        else{
            throw new AppError(result.message, 406);
        }
    }

    async delete(req, res){
        const id = req.params.id;
        const role = req.body.role;

        const isUserDeleted = await User.delete(id, role);

        if(isUserDeleted.status){
            res.json({message: isUserDeleted.message});
        }
        else{
            res.status(400).json({message: isUserDeleted.message});
        }
    }

    async recoveryPassword(req, res){
        const email = req.body.email;
        const user = await User.findByEmail(email);

        const result = await PasswordToken.create(email, user);

        if(result.status){
            res.json({message:"Token sent", token: result.token})
        }
        else{
            throw new AppError(result.message, 406);
        }
    }

    async changePassword(req,res){
        const {token, password} = req.body;

        const isTokenValid = await PasswordToken.validate(token);
        const user_id = isTokenValid.user_id;
        const tk_valid = isTokenValid.token;

        if(isTokenValid.status){
            await User.changePassword(user_id, password, tk_valid);
            res.json({message: "The password has been updated"});
        }
        else{
            throw new AppError("Token is not valid!", 406)
        }

    }

    async login(req,res){
        const {email, password} = req.body;

        const user = await User.findByEmail(email);
        
        if(user.length){
            const comparePassword = await compare(password, user[0].password);
            if(comparePassword){
                const tokenJwt = jwt.sign({
                    email: user[0].email,
                    role: user[0].role 
                }, secret);
                res.json({tokenJwt});
            }
            else{
                throw new AppError("The password is wrong!", 401);
            }
        }
        else{
            throw new AppError("The user does not exist!", 406);
        }

    }

}

module.exports = new UserController();