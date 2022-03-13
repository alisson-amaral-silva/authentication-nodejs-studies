const postController = require("./controller");
const passport = require("passport");

module.exports = (app) => {
  app
    .route("/post")
    .get(postController.list)
    .post(
      passport.authenticate("bearer", { session: false }),
      postController.add
    );
};
