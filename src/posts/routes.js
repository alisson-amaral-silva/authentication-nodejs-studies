const postController = require("./controller");
const { authenticationMiddlewares } = require("../users");
const authorization = require("../middlewares/authorization");

module.exports = (app) => {
  app
    .route("/post")
    .get(postController.list)
    .post(
      [authenticationMiddlewares.bearer, authorization(["admin", "editor"])],
      postController.add
    );

  app
    .route("/post/:id")
    .get(authenticationMiddlewares.bearer, postController.getPostDetails)
    .delete(
      [authenticationMiddlewares.bearer, authorization(["admin", "editor"])],
      postController.delete
    );
};
