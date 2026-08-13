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

function error(res, message, status = 400, code = null, errors = null) {
  const payload = {
    success: false,
    message,
  };
  if (code) payload.code = code;
  if (errors) payload.errors = errors;
  
  return res.status(status).json(payload);
}

module.exports = {
  success,
  error,
};