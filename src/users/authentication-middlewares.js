const passport = require("passport");
const User = require("./model");
const allowListRefreshToken = require("../../redis/allowlist-refresh-token");
const tokens = require("./tokens");


async function setRefreshTokenInvalid(refreshToken) {
  await allowListRefreshToken.delete(refreshToken);
}
module.exports = {
  local(req, res, next) {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error && error.name === "InvalidArgumentError") {
        return res.status(401).json({ error: error.message });
      }

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!user) {
        return res.status(401).json({ error: error.message });
      }

      req.user = user;
      return next();
    })(req, res, next);
  },

  bearer(req, res, next) {
    passport.authenticate("bearer", { session: false }, (error, user, info) => {
      if (error && error.name === "JsonWebTokenError") {
        return res.status(401).json({ error: error.message });
      }

      if (error && error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ error: error.message, expiredAt: error.expiredAt });
      }

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!user) {
        return res.status(401).json({ error: error.message });
      }

      req.token = info.token;
      req.user = user;
      return next();
    })(req, res, next);
  },

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const id = await tokens.refresh.check(refreshToken); // check if there is a refresh token inside redis
      await setRefreshTokenInvalid(refreshToken); // set old refresh token invalid
      req.user = await User.findById(id);
      return next();
    } catch (error) {
      if (error.name === "InvalidArgumentError") {
        res.status(401).json({ error: error.message });
      } else{
        res.status(500).json({ error: error.message });
      }
    }
  },
};
