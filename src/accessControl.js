const AccessControl = require("accesscontrol");
const ac = new AccessControl();

ac.grant("subscriber").readAny("post", ["id", "title", "content", "author"]);

ac.grant("editor").extend("subscriber").createOwn("post").deleteOwn("post");

ac.grant("admin")
  .createAny("post")
  .deleteAny("post")
  .readAny("user")
  .deleteAny("user");

module.exports = ac;
