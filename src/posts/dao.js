const db = require("../../database");
const { InternalServerError } = require("../errors");

const { promisify } = require("util");
const dbRun = promisify(db.run).bind(db);
const dbAll = promisify(db.all).bind(db);
const dbGet = promisify(db.get).bind(db);

module.exports = {
  async add(post) {
    try {
      return await dbRun(
        `
        INSERT INTO posts (
          title, 
          content,
          author
        ) VALUES (?, ?, ?)
      `,
        [post.title, post.content, post.author]
      );
    } catch (error) {
      throw new InternalServerError("Error trying to add a post!");
    }
  },

  async list() {
    try {
      return await dbAll(
        `
        SELECT * FROM posts
        `
      );
    } catch (error) {
      throw new InternalServerError(`Error trying to list posts!`);
    }
  },
  async listById(authorId) {
    try {
      return await dbAll("SELECT id, title FROM posts WHERE author = ?", [
        authorId,
      ]);
    } catch (error) {
      throw new InternalServerError("Error trying to list posts!");
    }
  },

  async findById(id, authorId) {
    try {
      return await dbGet("SELECT * FROM posts WHERE id = ? AND author = ?", [
        id,
        authorId,
      ]);
    } catch (erro) {
      throw new InternalServerError(`Couldn't find this post!`);
    }
  },

  async delete({ id, author }) {
    try {
      return await dbRun("DELETE FROM posts WHERE id = ? AND author = ?", [
        id,
        author,
      ]);
    } catch (error) {
      throw new InternalServerError("Error trying to delete the post!");
    }
  },
};
