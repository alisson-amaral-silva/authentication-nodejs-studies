const daoUsers = require("./dao");
const { InvalidArgumentError, NotFoundError } = require("../errors");
const validations = require("../default-validations");
const bcrypt = require("bcrypt");
/**
 * This user class is responsible to manage all operation related to the user
 */
class User {
  /**
   * The constructor receive the user data and add into the actual instance
   * @param {object} user
   */
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.hashPassword = user.hashPassword;
    this.verifyEmail = user.verifyEmail;
    this.role = user.role;

    this.check();
  }

  /**
   * @throws {InvalidArgumentError} - this error will be thrown when the user has an e-mail already registered
   */
  async add() {
    if (await User.findByEmail(this.email)) {
      throw new InvalidArgumentError("User already exists");
    }

    await daoUsers.add(this);
    const { id } = await daoUsers.findByEmail(this.email);
    this.id = id;
  }

  /**
   * @throws {InvalidArgumentError} - this error will be thrown when you're not sending a valid role
   */
  check() {
    validations.isStringFieldNotNull(this.name, "name");
    validations.isStringFieldNotNull(this.email, "email");
    const validRoles = ["admin", "editor", "subscriber"];
    if (validRoles.indexOf(this.role) === -1)
      throw new InvalidArgumentError("Role field is invalid");
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
      throw new NotFoundError("user");
    }

    return new User(user);
  }

  static async findByEmail(email) {
    const user = await daoUsers.findByEmail(email);
    if (!user) {
      throw new NotFoundError("user");
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

  async updatePassword() {
    return await daoUsers.updatePassword(this.hashPassword,this.id);
  }

  static generateHashPassword(password) {
    const hashCost = 12;
    return bcrypt.hash(password, hashCost);
  }
}

module.exports = User;
