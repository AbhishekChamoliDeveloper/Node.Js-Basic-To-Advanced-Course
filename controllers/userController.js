const validator = require("validator");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const User = require("../models/userModel");

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

// Getting All Users Informations
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      totalUser: users.length,
      data: users,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Internal Server Error" });
  }
};

// Creating New User
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.find({ email: email });

    if (existingUser.length !== 0) {
      res.status(400).json({ message: "User already Exists" });
    }

    if (!name || !email || !password) {
      res.status(400).json({
        message:
          "To Create Account We Need Your Need Your Name, Email and Password",
      });
    }

    if (password.length <= 6 || password.length >= 18) {
      res
        .status(400)
        .json({ messsage: "Password should be between 6 and 18 characters" });
    }

    if (validator.default.isEmail(email) === false) {
      res.status(400).json({ messsage: "Not a valid email" });
    }

    const normalizedName = name.toUpperCase().trim();
    const normalizedEmail = validator.default.normalizeEmail(email);
    const normalizedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: normalizedPassword,
    });

    res.status(201).json({
      message: "User has been Created",
      data: newUser,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Internal Server Error" });
  }
};

// Getting User By Id
exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.find({ _id: id });

    if (user.length === 0) {
      res.status(404).json({ message: "User not founed With This Id" });
    }

    res.status(200).json({
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Internal Server Error" });
  }
};

// Updating By Id
exports.updateUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const existingUser = await User.find({ _id: id });

    if (existingUser.length === 0) {
      res.status(404).json({ message: "User not found with this Id." });
    }

    const updatedUser = await User.findByIdAndUpdate(id, body, {
      new: true,
    });

    res.status(202).json({
      data: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Internal Server Error" });
  }
};

// Deleting User by Id
exports.deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;

    const existingUser = await User.find({ _id: id });

    if (existingUser.length === 0) {
      res.status(404).json({
        message: "User not found with this ID",
      });
    }

    await User.deleteOne({ _id: id });

    res.status(204).json({
      message: "User not has deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Internal Server Error" });
  }
};

// Upload Photo
exports.uploadUserPhotoByID = async (req, res) => {
  const id = req.params.id;
  const profileToUpload = req.file;

  const user = await User.findOne({ _id: id });

  if (!user) {
    res.status(400).json({ message: "User not found with this id" });
  }

  const profileName = `${user._id}-${profileToUpload.originalname}`;

  const writeStream = fs.createWriteStream(`./upload/${profileName}`);

  writeStream.on("finish", async () => {
    const uploadResult = await cloudinary.uploader.upload(
      `./upload/${profileName}`,
      {
        folder: "Dev",
        public_id: profileName,
      }
    );

    user.profile = uploadResult.secure_url;
    await user.save();

    await fs.promises.unlink(`./upload/${profileName}`);

    res.status(201).json({
      message: "Photo has been uploaded",
    });
  });

  writeStream.on("error", (err) => {
    console.log(err);
  });

  writeStream.write(profileToUpload.buffer);
  writeStream.end();
};
