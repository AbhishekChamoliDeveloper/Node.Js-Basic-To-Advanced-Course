const express = require("express");
const multer = require("multer");

const userController = require("../controllers/userController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router
  .route("/users")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/users/:id")
  .get(userController.getUserById)
  .patch(userController.updateUserById)
  .delete(userController.deleteUserById);

router
  .route("/users/:id/profile")
  .post(upload.single("profile"), userController.uploadUserPhotoByID);

module.exports = router;
