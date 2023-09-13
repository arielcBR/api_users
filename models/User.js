const AppError = require('../utils/AppError');
const knex = require('../database/connection');
const PasswordToken = require('./PasswordToken');
const { hash } = require('bcrypt');

class User{
    async new(name, email, hashedPassword, role = 0) {
        try {
            await knex.insert({ name, email, password: hashedPassword, role }).table("users");
        } catch (error) {  
            throw new AppError(error.message);
        }
    }

    async findEmail(email) {
        try {
            const emailExists = await knex.select('name').from('users').where({ email });
            if (emailExists.length) 
                return true;
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async findAll() {
        try {
            const users = await knex.select(['id','name','email','role']).from('users');
            return users;
        } catch (error) {
            throw new AppError(error.sqlMessage);
        }
    }

    async findById(id) {
        try {
            const user = await knex.select(['id','name','email','role']).from('users').where({id});
            return user;
        } catch (error) {
            throw new AppError(error.sqlMessage);
        }
    }

    async update(id, email, name, role){
        const user = await this.findById(id);
        const editedUser = {};

        if(user.length){ 
            if(email != undefined){
                if(email != user.email){
                    const IsEmailUsed = await this.findEmail(email);

                    if(!IsEmailUsed)
                        editedUser.email = email;
                    else
                        return {status: false, message: "The email is already in use"};
                }

                if(name != undefined){
                    editedUser.name = name; 
                }
    
                if(role == 0 || role == 1)
                    editedUser.role = role;
                else
                    return {status: false, message: "The role is not valid"};

                try {
                    await knex.update(editedUser).where({id}).table("users");
                    return {status: true};
                } catch (error) {
                    return {status:false, err: error}
                }
            }
        }
        else{
            return {status: false, err: "The user does not exist!"}
        }
    }

    async delete(id, role){
        const user = await this.findById(id);

        if(user.length){ 
            if(role == 1){
                await knex("users").where({id}).del();
                return {status: true, message: "The user has been deleted!"};
            }
            else{
                return {status: false, message: "You do not have permission!"};
            }
        }
        else{
            return {status: false, message: "The user does not exist!"};
        }
    }

    async changePassword(id, newPassword, token){
        const hashedPassword = await hash(newPassword, 8);
        await knex.update({password: hashedPassword}).where({id}).table("users");
        await PasswordToken.setUsed(token);
    }
};

module.exports = new User();