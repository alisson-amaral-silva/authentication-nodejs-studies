const db = require("../../database");
const { InternalServerError } = require("../errors");

const { promisify } = require("util");
const dbRun = promisify(db.run).bind(db);
const dbGet = promisify(db.get).bind(db);
const dbAll = promisify(db.all).bind(db);

module.exports = {
  async add(user) {
    try {
      return await dbRun(
        ` INSERT INTO users (name, email, hashPassword)
          VALUES (?, ?, ?)
        `,
        [user.name, user.email, user.hashPassword]
      );
    } catch (error) {
      throw new InternalServerError("Error trying to add user!");
    }
  },

  async getById(id) {
    try {
      return await dbGet(
        `
          SELECT *
          FROM users
          WHERE id = ?
        `,
        [id]
      );
    } catch (error) {
      throw new InternalServerError(`Couldn't find this user!`);
    }
  },

  async getByEmail(email) {
    try {
      return await dbGet(
        `
        SELECT *
        FROM users
        WHERE email = ?
      `,
        [email]
      );
    } catch (error) {
      throw new InternalServerError(`Couldn't find this user!`);
    }
  },

  async list() {
    try {
      return await dbAll(
        `
          SELECT * FROM users
        `
      );
    } catch (error) {
      throw new InternalServerError(`Couldn't list users!`);
    }
  },

  async delete(user) {
    try {
      return await dbRun(`DELETE FROM users WHERE id = ?`, [user.id]);
    } catch (erro) {
      throw new InternalServerError(`Couldn't delete this user!`);
    }
  },
};
