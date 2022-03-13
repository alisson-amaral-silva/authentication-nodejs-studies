const User = require("./model");
const { InvalidArgumentError, InternalServerError } = require("../errors");

module.exports = {
  add: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const user = new User({
        name,
        email,
      });

      await user.addPassword(password);

      await user.add();

      res.status(201).json();
    } catch (error) {
      if (error instanceof InvalidArgumentError) {
        res.status(422).json({ error: error.message });
      } else if (error instanceof InternalServerError) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  list: async (req, res) => {
    const users = await User.list();
    res.json(users);
  },

  delete: async (req, res) => {
    const user = await User.getById(req.params.id);
    try {
      await user.delete();
      res.status(200).send();
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },

  login: (req, res) => {
    res.status(204).send();
  },
};
