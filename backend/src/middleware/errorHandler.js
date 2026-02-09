export const errorHandler = (err, req, res, _next) => {
  console.error(err.stack || err.message);
  // Prefer custom ApiError.statusCode, then Express-style err.status, then 500
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
  });
};

export const notFound = (req, res) => {
  res.status(404).json({ error: "Route not found" });
};
