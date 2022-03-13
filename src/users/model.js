const daoUsers = require('./dao');
const { InvalidArgumentError } = require('../errors');
const validations = require('../default-validations');

class User {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;

    this.check();
  }

  async add() {
    if (await User.getByEmail(this.email)) {
      throw new InvalidArgumentError('User already exists');
    }

    return daoUsers.add(this);
  }

  check() {
    validations.isStringFieldNotNull(this.name, 'name');
    validations.isStringFieldNotNull(this.email, 'email');
    validations.isStringFieldNotNull(this.password, 'password');
    validations.isFieldMinSize(this.password, 'password', 8);
    validations.isFieldMaxSize(this.password, 'password', 64);
  }

  
  async delete() {
    return daoUsers.delete(this);
  }
  
  static async getById(id) {
    const user = await daoUsers.getById(id);
    if (!user) {
      return null;
    }
    
    return new User(user);
  }
  
  static async getByEmail(email) {
    const user = await daoUsers.getByEmail(email);
    if (!user) {
      return null;
    }
    
    return new User(user);
  }

  static list() {
    return daoUsers.list();
  }
}

module.exports = User;
