const jwt = require("jsonwebtoken");
const allowListRefresh = require("../../redis/allowlist-refresh-token");
const crypto = require("crypto");
const add = require("date-fns/add");
const getUnixTime = require("date-fns/getUnixTime");

function createJWTToken(id, [minutes]) {
  const payload = { id };
  // this key was generated based on this node command through the terminal
  // node -e "console.log( require('crypto').randomBytes(256).toString('base64') )"
  const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: minutes });

  return token;
}

async function createRefreshToken(id, [days], allowList) {
  const refreshToken = crypto.randomBytes(24).toString("hex");
  const expiredAt = getUnixTime(add(new Date(), { days: days }));
  await allowList.add(refreshToken, id, expiredAt);
  return refreshToken;
}
module.exports = {
  access: {
    expiration: [15],
    create(id) {
      return createJWTToken(id, this.expiration);
    },
  },
  refresh: {
    expiration: [5],
    list: allowListRefresh,
    create(id) {
      return createRefreshToken(id, this.expiration, this.list);
    },
  },
};
