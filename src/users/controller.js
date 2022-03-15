const User = require("./model");
const { InvalidArgumentError, InternalServerError } = require("../errors");
const jwt = require("jsonwebtoken");
const blocklist = require("../../redis/handle-blocklist");
const allowListRefresh = require("../../redis/allowlist-refresh-token");
const crypto = require("crypto");
const add = require("date-fns/add");
const getUnixTime = require('date-fns/getUnixTime');


function createJWTToken(user) {
  const payload = {
    id: user.id,
  };
  // this key was generated based on this node command through the terminal
  // node -e "console.log( require('crypto').randomBytes(256).toString('base64') )"
  const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "20m" });

  return token;
}

async function createRefreshToken(user) {
    const refreshToken = crypto.randomBytes(24).toString("hex");
    const expiredAt = getUnixTime(add(new Date(), { days: 5 }));
    await allowListRefresh.add(refreshToken, user.id, expiredAt);
    return refreshToken;
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
      const accessToken = createJWTToken(req.user);
      const refreshToken = await createRefreshToken(req.user);
      res.set("Authorization", accessToken);
      res.status(200).send({ refreshToken });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async logout(req, res) {
    try {
      const token = req.token;
      await blocklist.add(token);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
