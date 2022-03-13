const db = require('../../database');

module.exports = {
  add: post => {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO posts (
          title, 
          content
        ) VALUES (?, ?)
      `,
        [post.title, post.content],
        erro => {
          if (erro) {
            return reject('Error trying to add a post!');
          }

          return resolve();
        }
      );
    });
  },

  lista: () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM posts`, (erro, result) => {
        if (erro) {
          return reject('Error trying to list posts!');
        }

        return resolve(result);
      });
    });
  }
};
