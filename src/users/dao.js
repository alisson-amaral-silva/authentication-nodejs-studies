const db = require('../../database');
const { InternalServerError } = require('../errors');

module.exports = {
  add: user => {
    return new Promise((resolve, reject) => {
      db.run(
        `
          INSERT INTO users (
            name,
            email,
            password
          ) VALUES (?, ?, ?)
        `,
        [user.name, user.email, user.password],
        erro => {
          if (erro) {
            reject(new InternalServerError('Error trying to add user!'));
          }

          return resolve();
        }
      );
    });
  },

  getById: id => {
    return new Promise((resolve, reject) => {
      db.get(
        `
          SELECT *
          FROM users
          WHERE id = ?
        `,
        [id],
        (erro, user) => {
          if (erro) {
            return reject(`Couldn't  find this user!`);
          }

          return resolve(user);
        }
      );
    });
  },

  getByEmail: email => {
    return new Promise((resolve, reject) => {
      db.get(
        `
          SELECT *
          FROM users
          WHERE email = ?
        `,
        [email],
        (erro, user) => {
          if (erro) {
            return reject(`Couldn't find this user!`);
          }

          return resolve(user);
        }
      );
    });
  },

  list: () => {
    return new Promise((resolve, reject) => {
      db.all(
        `
          SELECT * FROM users
        `,
        (erro, users) => {
          if (erro) {
            return reject(`Couldn't list users!`);
          }
          return resolve(users);
        }
      );
    });
  },

  delete: user => {
    return new Promise((resolve, reject) => {
      db.run(
        `
          DELETE FROM users
          WHERE id = ?
        `,
        [user.id],
        erro => {
          if (erro) {
            return reject(`Couldn't delete this user!`);
          }
          return resolve();
        }
      );
    });
  }
};
