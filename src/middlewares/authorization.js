const control = require('../accessControl');
module.exports = (entity, action) => async (req, res, next) => {
  const user = await req.user;
  const rolePermissions = control.can(user.role);
  const permission = rolePermissions[action](entity);
  if (permission.granted === false) {
    res.status(403).send();
    res.end();
    return;
  }

  req.access = {
    attributes: permission.access
  };
  next();
};
