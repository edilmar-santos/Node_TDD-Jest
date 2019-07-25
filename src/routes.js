const routes = require("express").Router();

const SessionController = require("./app/controllers/Sessions");
const { User } = require("./app/models");

const authMiddleware = require("./app/middlewares/auth");

routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);

routes.get("/dashboard", (req, res) => {
  return res.send("Access Allowed");
});

module.exports = routes;
