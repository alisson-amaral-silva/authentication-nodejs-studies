const usersController = require("./controller");
const authenticateMiddlewares = require("./authentication-middlewares");
const {authenticationMiddlewares} =  require('../users');

module.exports = (app) => {
  app.route("/user").post(usersController.add).get(usersController.list);

  app
    .route("/user/login")
    .post(
      authenticateMiddlewares.local,
      usersController.login
    );

  app
    .route("/user/:id")
    .delete(
      authenticationMiddlewares.bearer,
      usersController.delete
    );
};
