const postsDao = require('./dao');
const validations = require('../default-validations');

class Post {
  constructor(post) {
    this.title = post.title;
    this.content = post.content;
    this.check();
  }

  add() {
    return postsDao.add(this);
  }

  check() {
    validations.isStringFieldNotNull(this.title, 'title');
    validations.isFieldMinSize(this.title, 'title', 5);

    validations.isStringFieldNotNull(this.content, 'content');
    validations.isFieldMaxSize(this.content, 'content', 140);
  }

  static list() {
    return postsDao.list();
  }
}

module.exports = Post;
