const redis = require("redis");
const handleList = require("./handle-list");
const resetPasswordList = redis.createClient({ prefix: "reset-password-token:" });
module.exports = handleList(resetPasswordList);
