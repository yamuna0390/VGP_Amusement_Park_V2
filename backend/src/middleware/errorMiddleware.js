const response = require("../utils/response");

function errorMiddleware(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const code = err.code || null;

  return response.error(
    res,
    message,
    statusCode,
    code
  );
}

module.exports = errorMiddleware;