const postController = require('./controller');

module.exports = app => {
  app
    .route('/post')
    .get(postController.list)
    .post(postController.add);
};
