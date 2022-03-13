const usersController = require("./controller");
const authenticateMiddlewares = require("./authentication-middlewares");

const passport = require("passport");

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
      passport.authenticate("bearer", { session: false }),
      usersController.delete
    );
};
