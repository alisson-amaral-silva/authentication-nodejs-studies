const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const BearerStrategy = require("passport-http-bearer").Strategy;
const jwt = require("jsonwebtoken");

const User = require("./model");
const { InvalidArgumentError } = require("../errors");
const handleBlocklist = require("../../redis/handle-blocklist");

function checkUser(user) {
  if (!user) throw new InvalidArgumentError("This user does not exist");
}

async function checkPassword(password, hashPassword) {
  const validPassword = await bcrypt.compare(password, hashPassword);
  if (!validPassword)
    throw new InvalidArgumentError("Email or password invalid");
}

async function checkBlacklistToken(token) { 
  const blocklistToken = await handleBlocklist.hasToken(token);
  if(!blocklistToken){
    throw new jwt.JsonWebTokenError("Invalid token due logout!");
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await User.getByEmail(email);
        checkUser(user);
        await checkPassword(password, user.hashPassword);

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      await checkBlacklistToken(token);
      const payload = jwt.verify(token, process.env.JWT_KEY);
      const user = User.getById(payload.id);
      done(null, user, { token: token });
    } catch (error) {
      done(error);
    }
  })
);
