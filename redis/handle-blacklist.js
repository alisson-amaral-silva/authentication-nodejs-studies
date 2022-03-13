const blacklist = require("./blacklist");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { createHash } = require("crypto");
const existsAsync = promisify(blacklist.exists).bind(blacklist);

const setAsync = promisify(blacklist.set).bind(blacklist);

function generateHashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

module.exports = {
  add: async (token) => {
    const expirationDate = jwt.decode(token).exp;
    const hashedToken = generateHashToken(token);
    await setAsync(hashedToken, "");
    blacklist.expireAt(hashedToken, expirationDate);
  },
  hasToken: async (token) => {
    const hashedToken = generateHashToken(token);
    const resultado = await existsAsync(hashedToken);

    return resultado === 1;
  },
};
