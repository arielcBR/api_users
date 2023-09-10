const AppError = require('../utils/AppError');
const knex = require('../database/connection');

class User{
    async new(name, email, hashedPassword, role = 0) {
        try {
            await knex.insert({ name, email, password: hashedPassword, role }).table("users");
        } catch (error) {  
            throw new AppError(error.message);
        }
    };

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
}

module.exports = new User();