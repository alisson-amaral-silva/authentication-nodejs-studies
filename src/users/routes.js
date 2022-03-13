const usersController = require('./controller');

module.exports = app => {
  app
    .route('/user')
    .post(usersController.add)
    .get(usersController.list);

  app.route('/user/:id').delete(usersController.delete);
};
