const User = require("./model");
const { InvalidArgumentError, InternalServerError } = require("../errors");
const tokens = require("./tokens");
const { EmailCheck } = require("./emails");

function generateAddress(route, token) {
  const baseUrl = process.env.BASE_URL;
  return `${baseUrl}${route}${token}`;
}

module.exports = {
  async add(req, res) {
    const { name, email, password, role } = req.body;

    try {
      const user = new User({
        name,
        email,
        verifyEmail: false,
        role
      });

      await user.addPassword(password);
      await user.add();

      const token = tokens.verifyEmail.create(user.id);
      const address = generateAddress("/users/verify_email/", token);
      const emailCheck = new EmailCheck(user, address);
      emailCheck.sendEmail().catch(console.log);

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
    try {
      const users = await User.list();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    const user = await User.findById(req.params.id);
    try {
      await user.delete();
      res.status(200).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const accessToken = tokens.access.create(req.user.id);
      const refreshToken = await tokens.refresh.create(req.user.id);
      res.set("Authorization", accessToken);
      res.status(200).send({ refreshToken });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async verifyEmail(req, res) {
    try {
      const user = req.user;
      await user.emailCheck();
      res.status(200).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async logout(req, res) {
    try {
      const token = req.token;
      await tokens.access.invalid(token);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
