const authorization = require("./authorization");

module.exports = (entity, action) => (req, res, next) => {
  if (req.isAuthenticated) {
    return authorization(entity, action)(req, res, next);
  }
  next();
};
