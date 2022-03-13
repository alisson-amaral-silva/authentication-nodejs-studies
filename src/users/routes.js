const usersController = require("./controller");
const passport = require("passport");

module.exports = (app) => {
  app.route("/user").post(usersController.add).get(usersController.list);

  app
    .route("/user/login")
    .post(
      passport.authenticate("local", { session: false }),
      usersController.login
    );

  app
    .route("/user/:id")
    .delete(
      passport.authenticate("bearer", { session: false }),
      usersController.delete
    );
};
