// Global error handler
const errorHandler = (err, req, res, next) => {
  // Set the status code and status message based on the error
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Send a JSON response with the error message and status code
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = errorHandler;
