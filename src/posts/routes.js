const postController = require("./controller");
const { authenticationMiddlewares } = require("../users");
const authorization = require("../middlewares/authorization");

module.exports = (app) => {
  app
    .route("/post")
    .get(postController.list)
    .post(
      [authenticationMiddlewares.bearer, authorization("post", "create")],
      postController.add
    );

  app
    .route("/post/:id")
    .get(
      [authenticationMiddlewares.bearer, authorization("post", "read")],
      postController.getPostDetails
    )
    .delete(
      [authenticationMiddlewares.bearer, authorization("post", "delete")],
      postController.delete
    );
};
