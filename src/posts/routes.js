const postController = require("./controller");
const { authenticationMiddlewares } = require("../users");
const authorization = require("../middlewares/authorization");
const tryAuthenticate = require("../middlewares/tryAuthenticate");
const tryAuthorize = require("../middlewares/tryAuthorize");

module.exports = (app) => {
  app
    .route("/post")
    .get([tryAuthenticate, tryAuthorize("post", "read")], postController.list)
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
