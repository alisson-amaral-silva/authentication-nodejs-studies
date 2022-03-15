const { promisify } = require("util");

module.exports = (list) => {
  const setAsync = promisify(list.set).bind(list);
  const existsAsync = promisify(list.exists).bind(list);
  const getAsync = promisify(list.get).bind(list);
  const delAsync = promisify(list.del).bind(list);

  return {
    async add(key, value, expireDate) {
      await setAsync(key, value);
      list.expireat(key, expireDate);
    },
    async hasKey(token) {
      const result = await existsAsync(token);
      return result === 1;
    },
    async getValue(key) {
      return await getAsync(key);
    },
    async delete(key) {
      await delAsync(key);
    },
  };
};
