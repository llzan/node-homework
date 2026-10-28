const express = require("express");
const dogsRouter = require("./routes/dogs");
const { randomUUID } = require("crypto");
const path = require("path");


const app = express();

// Assignment 3b and 3c ask you to add middleware in this file.

// request ID middleware
app.use((req, res, next) => {
  req.requestId = randomUUID();
  res.setHeader("X-Request-Id", req.requestId);
  next();
});

// logging middleware
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}]: ${req.method} ${req.path} (${req.requestId})`);
  next();
});

// security headers middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

// JSON parsing middleware
app.use(express.json());

// state file middleware
app.use(express.static(path.join(__dirname, "public")));




app.use("/", dogsRouter);// Do not remove this line

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    requestId: req.requestId });
});

// error handler
app.use((err, req, res, next) => {
  res.status(500).json({ 
    error: "Internal Server Error",
    requestId: req.requestId });
});



if (require.main === module) {
  app.listen(3000, () => {
    console.log("Dog rescue app is listening on port 3000...");
  });
}

module.exports = app;

