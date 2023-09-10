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
            const emailExists = await knex.select('*').from('users').where({ email });
            if (emailExists.length) 
                return true;
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

module.exports = new User();