const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const BearerStrategy = require("passport-http-bearer").Strategy;
const tokens = require('./tokens');

const User = require("./model");
const { NotAuthorizedError } = require("../errors");

function checkUser(user) {
  if (!user) throw new NotAuthorizedError();
}

async function checkPassword(password, hashPassword) {
  const validPassword = await bcrypt.compare(password, hashPassword);
  if (!validPassword)
    throw new NotAuthorizedError();
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
        const user = await User.findByEmail(email);
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
      const id = await tokens.access.check(token);
      const user = User.findById(id);
      done(null, user, { token: token });
    } catch (error) {
      done(error);
    }
  })
);
