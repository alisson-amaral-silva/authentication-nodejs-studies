require("dotenv").config();

const app = require("./app");
const port = 3000;
require("./database");
require("./redis/handle-blocklist");
require("./redis/allowlist-refresh-token");
const { InvalidArgumentError, NotFoundError, NotAuthorizedError } = require("./src/errors");
const jwt = require("jsonwebtoken");

const routes = require("./routes");
routes(app);

app.use((error, req, res, next) => {
  let status = 500;
  const body = {
    message: error.message,
  };

  if (error instanceof InvalidArgumentError) {
    status = 400;
  }

  if (error instanceof NotAuthorizedError) {
    status = 401;
  }

  if (error instanceof jwt.TokenExpiredError) {
    status = 401;
  }

  if (error instanceof jwt.JsonWebTokenError) {
    status = 401;
    body.expiredAt = error.expiredAt;
  }

  if (error instanceof NotFoundError) {
    status = 404;
  }

  res.status(status);
  res.json(body);
});

app.listen(port, () => console.log(`App listening on port ${port}`));
