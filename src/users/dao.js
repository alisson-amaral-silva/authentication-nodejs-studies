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
        ` INSERT INTO users (name, email, hashPassword, verifyEmail, role)
          VALUES (?, ?, ?, ?, ?)
        `,
        [user.name, user.email, user.hashPassword, user.verifyEmail, user.role]
      );
    } catch (error) {
      throw new InternalServerError("Error trying to add user!");
    }
  },

  async findById(id) {
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
      throw new InternalServerError(`Fail to find this user!`);
    }
  },

  async findByEmail(email) {
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
      throw new InternalServerError(`Fail to find this user!`);
    }
  },

  async modifyVerifiedEmail(user, verifyEmail) {
    try {
      await dbRun(`UPDATE users SET verifyEmail = ? WHERE id = ?`, [
        verifyEmail,
        user.id,
      ]);
    } catch (error) {
      throw new InternalServerError(`Error on trying to update email check!`);
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
      throw new InternalServerError(`Fail to list users!`);
    }
  },

  async delete(user) {
    try {
      return await dbRun(`DELETE FROM users WHERE id = ?`, [user.id]);
    } catch (error) {
      throw new InternalServerError(`Fail to delete this user!`);
    }
  },
  async updatePassword(password, id) {
    try {
      return await dbRun(`UPDATE users SET hashPassword = ? WHERE id = ?`, [password, id]);
    } catch (error) {
      throw new InternalServerError(`Fail to update this user!`);
    }
  },
};
