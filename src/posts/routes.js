const postController = require("./controller");
const {authenticationMiddlewares} =  require('../users');

module.exports = (app) => {
  app
    .route("/post")
    .get(postController.list)
    .post(
      authenticationMiddlewares.bearer,
      postController.add
    );
};
