module.exports = (mandatoryRoles) => async (req, res, next) => {
  const user = await req.user;
  if (mandatoryRoles.indexOf(user.role) === -1) {
    res.status(403).send();
    res.end();
    return;
  }
  next();
};
