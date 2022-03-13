const { InvalidArgumentError } = require('./errors');


module.exports = {
  isStringFieldNotNull: (value, name) => {
    if (typeof value !== 'string' || value === 0)
      throw new InvalidArgumentError(`Field ${name} is missing!`);
  },

  isFieldMinSize: (value, name, min) => {
    if (value.length < min)
      throw new InvalidArgumentError(
        `Field ${name} must be greater than or equal ${min} characters!`
      );
  },

  isFieldMaxSize: (value, name, max) => {
    if (value.length > max)
      throw new InvalidArgumentError(
        `Field ${name} must be less than ${max} characters!`
      );
  }
};
