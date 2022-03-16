const AccessControl = require("accesscontrol");
const ac = new AccessControl();

ac.grant("subscriber").readAny("post", ["id", "title", "content", "author"]);

module.exports = ac;
