const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router
  .route("/users")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/users/:id")
  .get(userController.getUserById)
  .patch(userController.updateUserById)
  .delete(userController.deleteUserById);

module.exports = router;