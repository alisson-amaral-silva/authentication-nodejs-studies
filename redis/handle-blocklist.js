const redis = require('redis');
const blocklist = redis.createClient({ prefix: 'blocklist-access-token:' });
const handleList = require('./handle-list');
const handleBlocklist = handleList(blocklist);

const jwt = require("jsonwebtoken");
const { createHash } = require("crypto");

function generateHashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

module.exports = {
  async add(token) {
    const expirationDate = jwt.decode(token).exp;
    const hashedToken = generateHashToken(token);
    await handleBlocklist.add(hashedToken, '', expirationDate);
  },
  async hasToken(token) {
    const hashedToken = generateHashToken(token);

    return await handleBlocklist.hasKey(hashedToken);
  },
};
