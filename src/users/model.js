const daoUsers = require("./dao");
const { InvalidArgumentError } = require("../errors");
const validations = require("../default-validations");
const bcrypt = require("bcrypt");

class User {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.hashPassword = user.hashPassword;
    this.verifyEmail = user.verifyEmail;

    this.check();
  }

  async add() {
    if (await User.findByEmail(this.email)) {
      throw new InvalidArgumentError("User already exists");
    }

    await daoUsers.add(this);
    const { id } = await daoUsers.findByEmail(this.email);
    this.id = id;
  }

  check() {
    validations.isStringFieldNotNull(this.name, "name");
    validations.isStringFieldNotNull(this.email, "email");
  }

  async delete() {
    return daoUsers.delete(this);
  }

  async emailCheck() {
    this.verifyEmail = true;
    daoUsers.modifyVerifiedEmail(this, this.verifyEmail);
  }

  static async findById(id) {
    const user = await daoUsers.findById(id);
    if (!user) {
      return null;
    }

    return new User(user);
  }

  static async findByEmail(email) {
    const user = await daoUsers.findByEmail(email);
    if (!user) {
      return null;
    }

    return new User(user);
  }

  static list() {
    return daoUsers.list();
  }

  async addPassword(password) {
    validations.isStringFieldNotNull(password, "password");
    validations.isFieldMinSize(password, "password", 8);
    validations.isFieldMaxSize(password, "password", 64);

    this.hashPassword = await User.generateHashPassword(password);
  }

  static generateHashPassword(password) {
    const hashCost = 12;
    return bcrypt.hash(password, hashCost);
  }
}

module.exports = User;
