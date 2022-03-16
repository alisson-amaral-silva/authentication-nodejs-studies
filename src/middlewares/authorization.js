const control = require("../accessControl");

const methods = {
  read: {
    any: "readAny",
    own: "readOwn",
  },
  create: {
    any: "createAny",
    own: "createOwn",
  },
  delete: {
    any: "deleteAny",
    own: "deleteOwn",
  },
};

module.exports = (entity, action) => async (req, res, next) => {
  const user = await req.user;
  const rolePermissions = control.can(user.role);
  const actions = methods[action];

  const anyPermissions = rolePermissions[actions.any](entity);
  const ownPermissions = rolePermissions[actions.own](entity);

  if (anyPermissions.granted === false && ownPermissions.granted === false) {
    res.status(403).send();
    res.end();
    return;
  }

  req.access = {
    any: {
      allow: anyPermissions.granted,
      attributes: anyPermissions.attributes,
    },
    own: {
      allow: ownPermissions.granted,
      attributes: ownPermissions.attributes,
    },
  };
  next();
};
