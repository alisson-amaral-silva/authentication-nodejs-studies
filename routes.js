const posts = require('./src/posts');
const users = require('./src/users');

module.exports = app => {
  app.get('/', (req, res) => {res.send('Hello everyone!')});
  
  posts.rotas(app);
  users.userRoutes(app);
};