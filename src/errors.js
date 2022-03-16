class InvalidArgumentError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidArgumentError";
  }
}

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.name = "InternalServerError";
  }
}

class NotFoundError extends Error {
  constructor(entity) {
    const message = `${entity} not found`;
    super(message);
    this.name = "NotFoundError";
  }
}

class NotAuthorizedError extends Error {
  constructor() {
    const message = `Cannot access this resource`;
    super(message);
    this.name = "NotAuthorizedError";
  }
}

module.exports = {
  InvalidArgumentError: InvalidArgumentError,
  InternalServerError: InternalServerError,
  NotFoundError: NotFoundError,
  NotAuthorizedError: NotAuthorizedError,
};
