const knex = require('../database/connection');
const AppError = require('../utils/AppError');
const User = require('./User');

class PasswordToken{
    async create(email, user) {
        const token =  Date.now();
        console.log("User:", user);
        if(user != undefined){
            try {
                await knex
                .insert({user_id: user[0].id, used: false, token: token})
                .table("password_tokens");
                return {status: true, token: token};

            } catch (error) {
                console.log(error);
                return {status: false, message: error};
            }
        }
        else{
            return {status: false, message: "The user does not exist in the database"};
        }
    }

    async validate(token){
        try {
            const password_token = await knex.select().where({token}).table("password_tokens");

            if(password_token.length){
                const tk = password_token[0].token;
                const user_id = password_token[0].user_id;
                const isTkUsed = password_token[0].used;

                if(isTkUsed)
                    return {status: false};
                else
                    return {status: true, token: tk, user_id: user_id};
                
            }
        } catch (error) {
            console.log(error);
            return {status: false};
        }
    }

    async setUsed(token){
        await knex.update({used: 1}).where({token}).table("password_tokens");
    }

};

module.exports = new PasswordToken();