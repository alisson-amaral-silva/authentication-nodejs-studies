const db = require("../../database");
const { InternalServerError } = require("../errors");

const { promisify } = require("util");
const dbRun = promisify(db.run).bind(db);
const dbAll = promisify(db.all).bind(db);

module.exports = {
  async add(post) {
    try {
      return await dbRun(
        `
        INSERT INTO posts (
          title, 
          content
        ) VALUES (?, ?)
      `,
        [post.title, post.content]
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
};
