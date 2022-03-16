const passport = require("passport");
const User = require("./model");
const tokens = require("./tokens");

module.exports = {
  local(req, res, next) {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error) {
        return next(error);
      }

      req.user = user;
      req.isAuthenticated = true;
      return next();
    })(req, res, next);
  },

  bearer(req, res, next) {
    passport.authenticate("bearer", { session: false }, (error, user, info) => {
      if (error) {
        return next(error);
      }

      req.token = info.token;
      req.user = user;
      req.isAuthenticated = true;
      return next();
    })(req, res, next);
  },

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const id = await tokens.refresh.check(refreshToken); // check if there is a refresh token inside redis
      await tokens.refresh.invalid(refreshToken); // set old refresh token invalid
      req.user = await User.findById(id);
      return next();
    } catch (error) {
      return next(error);
    }
  },

  async verifyEmail(req, res, next) {
    try {
      const { token } = req.params;
      const id = await tokens.verifyEmail.check(token);
      req.user = await User.findById(id);
      return next();
    } catch (error) {
      return next(error);
    }
  },
};
