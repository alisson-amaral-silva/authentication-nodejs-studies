const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('./model');
const { InvalidArgumentError} = require('../errors');

function checkUser(user){
    if(!user)
        throw new InvalidArgumentError('This user does not exists');
}

async function checkPassword(password, hashPassword){
    const validPassword = await bcrypt.compare(password, hashPassword);
    if(!validPassword)
        throw new InvalidArgumentError('Email or password invalid');
}

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: false
    }, async (email, password, done) => {
        try {
            const user = await User.getByEmail(email);
            checkUser(user);
            checkPassword(password, user.hashPassword);

            done(null, user);
        } catch (error) {
            done(error);            
        }
    })
);