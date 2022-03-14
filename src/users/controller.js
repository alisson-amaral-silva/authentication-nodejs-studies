const User = require("./model");
const { InvalidArgumentError, InternalServerError } = require("../errors");
const jwt = require("jsonwebtoken");
const blacklist = require("../../redis/handle-blacklist");

function createJWTToken(user) {
  const payload = {
    id: user.id,
  };
  // this key was generated based on this node command through the terminal
  // node -e "console.log( require('crypto').randomBytes(256).toString('base64') )"
  const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "20m" });

  return token;
}

module.exports = {
  async add(req, res) {
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

  async list(req, res) {
    const users = await User.list();
    res.json(users);
  },

  async delete(req, res) {
    const user = await User.getById(req.params.id);
    try {
      await user.delete();
      res.status(200).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async login(req, res) {
    const token = createJWTToken(req.user);
    res.set("Authorization", token);
    //this is 204 because it's useful for the user to know that the needed information it's on the headers
    res.status(204).send();
  },

  async logout(req, res) {
    try {
      const token = req.token;
      await blacklist.add(token);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
