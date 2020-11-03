const User = require('../models/user');
const Salt = require('../models/salt');
const Token = require('../models/token');
const {verifica, validatedPassword} = require('../models/application');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

module.exports = {
    async signup(req, res) {
        try {
            let {name, email, phone_number, password} = verifica(req.body, ['name', 'email', 'phone_number', 'password']);
            if (await User.findOne({where: {[Op.or]: [{email}, {phone_number}]}}))
                throw {message: "email or prone number already taken", status: 400};

            if (!validatedPassword(password)) throw {message: "week password", status: 400};

            const salt = await bcrypt.genSalt(10);
            password = (await bcrypt.hash(password, salt)).replace(salt, '');
            const user = await User.create({name, email, phone_number, password});
            await user.createSalt({salt});
            const token = Token.generateToken(user);
            res.cookie('user_session', token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24
            });
            return res.status(201).send();
        } catch(err) {
            return res.status(err.status || 500).send({
                error: {
                    message: err.message,
                    status: err.status || 500
                }
            });
        }
    },

    async signin(req, res) {
        try {
            const {email_or_phone_number, password} = verifica(req.body, ['email_or_phone_number', 'password']);
            const user = await User.scope('login').findOne({where: {[Op.or]: [{email: email_or_phone_number}, {phone_number: email_or_phone_number}]}});
            if (!user)
              throw {message: "user not found", status: 404};


            // pegando só o salt do objeto pois não iremos modifica-ló 
            const salt = (await Salt.findByPk(user.id)).salt;
            
            if (!await bcrypt.compare(password, salt + user.password))
                throw {message: "invalid password", status: 401};
      
            const token = Token.generateToken(user);
            res.cookie('user_session', token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24
            });
            return res.status(200).send();
        } catch(err) {
            return res.status(err.status || 500).send({
                error: {
                    message: err.message,
                    status: err.status || 500,
                }
            });
        }
    },

    async changePassword(req, res) {
        try {
            if (!req.IsAuth) throw {message: 'permission danied', status: 401};
            let {password, new_password} = verifica(req.body, ['password', 'new_password']);
            const user = await User.scope('login').findByPk(req.user.id);
            if (!user) throw {message: "user not found", status: 404};

            const old_salt = await Salt.findByPk(user.id);

            if (!validatedPassword(new_password)) throw {message: "week password", status: 400};

            if (!await bcrypt.compare(password, old_salt.salt + user.password)) throw {message: "invalid password", status: 401};

            const new_salt = await bcrypt.genSalt(10);
            new_password = (await bcrypt.hash(new_password, new_salt)).replace(new_salt, '');
            await user.update({password: new_password});
            await old_salt.update({salt: new_salt});
            return res.status(200).send();
             
        } catch(err) {
            return res.status(err.status || 500).send({
                error: {
                    message: err.message,
                    status: err.status || 500
                }
            });
        }
    },

    async logout(req, res) {
        try {
            if (!req.IsAuth) return res.status(200).send();
            const token = Token.getToken(req);
            if (!token) return res.status(200).send();
            const solved = Token.solveToken(token);
            console.log(solved);
            if (!solved.ok) return res.status(200).send();
            await Token.create({token, due_date: solved.decoded.exp});
            res.clearCookie('user_session');
            return res.status(200).send();
        } catch(err) {
            return res.status(err.status || 500).send({
                error: {
                    message: err.message,
                    status: err.status || 500
                }
            });
        }
    },

    async info(req, res) {
        try {
            if (!req.IsAuth) throw {message: 'permission danied', status: 401};
        
            const user = await User.findByPk(req.user.id, {attributes: ['id', 'name', 'email', 'phone_number']});

            if (!user) throw {message: "user not found", status: 404};

            return res.status(200).send({user});
        } catch(err) {
            return res.status(err.status || 500).send({
                error: {
                    message: err.message,
                    status: err.status || 500
                }
            });
        }
    }
}
