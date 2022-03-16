const usersController = require("./controller");
const authenticateMiddlewares = require("./authentication-middlewares");
const authorization = require("../middlewares/authorization");

module.exports = (app) => {

  app
    .route('/user/forgot_password')
    .post(usersController.forgotPassword);

  app
    .route('/user/change_password')
    .post(usersController.changePassword);
  app
    .route("/user/update_token")
    .post(authenticateMiddlewares.refresh, usersController.login);

  app
    .route("/user")
    .post(usersController.add)
    .get(
      [authenticateMiddlewares.bearer, authorization("user", "readAny")],
      usersController.list
    );

  app
    .route("/user/login")
    .post(authenticateMiddlewares.local, usersController.login);

  app
    .route("/user/logout")
    .post(
      [authenticateMiddlewares.refresh, authenticateMiddlewares.bearer],
      usersController.logout
    );

  app
    .route("/users/verify_email/:token")
    .get(authenticateMiddlewares.verifyEmail, usersController.verifyEmail);

  app
    .route("/user/:id")
    .delete(authenticateMiddlewares.bearer, usersController.delete);
};
