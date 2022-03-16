const postsDao = require("./dao");
const validations = require("../default-validations");

class Post {
  constructor(post) {
    this.title = post.title;
    this.content = post.content;
    this.author = post.author;
    this.check();
  }

  add() {
    return postsDao.add(this);
  }

  check() {
    validations.isStringFieldNotNull(this.title, "title");
    validations.isFieldMinSize(this.title, "title", 5);

    validations.isStringFieldNotNull(this.content, "content");
    validations.isFieldMaxSize(this.content, "content", 140);
  }

  static list() {
    return postsDao.list();
  }

  delete() {
    return postsDao.delete(this);
  }

  static async listById(id, authorId) {
    const post = await postsDao.listById(id, authorId);
    if (!post) {
      return null;
    }

    return new Post(post);
  }

  static async findById(id, authorId) {
    const post = await postsDao.findById(id, authorId);
    if (!post) {
      return null;
    }

    return new Post(post);
  }
}

module.exports = Post;
