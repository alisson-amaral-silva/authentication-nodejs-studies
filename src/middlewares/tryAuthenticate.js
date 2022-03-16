const { authenticationMiddlewares } = require("../users");
module.exports = (req, res, next) => {
    req.isAuthenticated = false;
    
  if (req.get("Authorization")) {
    return authenticationMiddlewares.bearer(req, res, next);
  }
  next();
};
