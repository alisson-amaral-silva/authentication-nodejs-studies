const usersController = require("./controller");
const authenticateMiddlewares = require("./authentication-middlewares");

module.exports = (app) => {
  app
    .route("/user/update_token")
    .post(authenticateMiddlewares.refresh, usersController.login);

  app.route("/user").post(usersController.add).get(usersController.list);

  app
    .route("/user/login")
    .post(authenticateMiddlewares.local, usersController.login);

  app
    .route("/user/logout")
    .post(
      [authenticateMiddlewares.refresh, authenticateMiddlewares.bearer],
      usersController.logout
    );

  app.route("/users/verify_email/:id").get(authenticateMiddlewares.verifyEmail,usersController.verifyEmail);

  app
    .route("/user/:id")
    .delete(authenticateMiddlewares.bearer, usersController.delete);
};
