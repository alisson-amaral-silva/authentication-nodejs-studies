module.exports = (mandatoryRoles) => (req, res, next) => {
  req.user.role = "subscriber";
  if (mandatoryRoles.indexOf(req.user.role) === -1) {
    res.status(403).send();
    res.end();
    return;
  }
  next();
};
