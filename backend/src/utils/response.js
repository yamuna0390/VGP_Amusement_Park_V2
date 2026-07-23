/**
 * Standard API Response Helper
 */

function success(res, message, data = null, status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

function error(res, message, status = 400, errors = null) {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
}

module.exports = {
  success,
  error,
};