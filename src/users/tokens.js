const jwt = require("jsonwebtoken");
const allowListRefresh = require("../../redis/allowlist-refresh-token");
const crypto = require("crypto");
const add = require("date-fns/add");
const getUnixTime = require("date-fns/getUnixTime");
const handleBlocklistAccessToken = require("../../redis/handle-blocklist");
const { InvalidArgumentError } = require("../errors");

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

async function checkJWTToken(token, blocklist, name) {
  await checkBlacklistToken(token, blocklist, name);
  const { id } = jwt.verify(token, process.env.JWT_KEY);
  return id;
}

async function checkBlacklistToken(token, blocklist, name) {
  if (!blocklist) return;

  const blocklistToken = await blocklist.hasToken(token);
  if (blocklistToken) {
    throw new jwt.JsonWebTokenError(`Invalid ${name} due logout!`);
  }
}

function checkInvalidToken(id, name) {
  if (!id) throw new InvalidArgumentError(`${name} token invalid`);
}

function checkToken(refreshToken, name) {
  if (!refreshToken) throw new InvalidArgumentError(`${name} token not sent`);
}

async function checkRefreshToken(refreshToken, allowList, name) {
  checkToken(refreshToken, name);
  const id = await allowList.getValue(refreshToken);
  checkInvalidToken(id, name);
  return id;
}

async function setJWTTokenInvalid(token, blocklist) {
  await blocklist.add(token);
}

async function setRefreshTokenInvalid(refreshToken, allowlist) {
  await allowlist.delete(refreshToken);
}
module.exports = {
  access: {
    expiration: [3600],
    list: handleBlocklistAccessToken,
    name: "Access Token",
    create(id) {
      return createJWTToken(id, this.expiration);
    },
    check(token) {
      return checkJWTToken(token, this.list, this.name);
    },
    invalid(token) {
      return setJWTTokenInvalid(token, this.list);
    },
  },
  refresh: {
    expiration: [5],
    name: "Refresh token",
    list: allowListRefresh,
    create(id) {
      return createRefreshToken(id, this.expiration, this.list);
    },
    check(token) {
      return checkRefreshToken(token, this.list, this.name);
    },
    invalid(token) {
      return setRefreshTokenInvalid(token, this.list);
    },
  },
  verifyEmail: {
    name: "Verify email token",
    expiration: [3600],
    create(id) {
      return createJWTToken(id, this.expiration);
    },
    check(token) {
      return checkJWTToken(token, null, this.name);
    },
  },
};
