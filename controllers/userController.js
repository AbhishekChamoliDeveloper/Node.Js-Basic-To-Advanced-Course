const validator = require("validator");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const User = require("../models/userModel");
const AppError = require("../utility/appError");
const catchAsyncError = require("../utility/catchAsyncError");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    totalUser: users.length,
    data: users,
  });
});

exports.createUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    next(
      new AppError(
        "Email, Password and Name Required For Creating a Account",
        400
      )
    );
  }

  if (password.length <= 6 || password.length >= 18) {
    return next(
      new AppError("Password should be between 6 and 18 characters", 400)
    );
  }

  if (validator.default.isEmail(email) === false) {
    return next(new AppError("Email is not valid", 400));
  }

  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    return next(new AppError("User already exists", 404));
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
    message: "User has been created",
    data: newUser,
  });
});

exports.getUserById = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found by this ID", 404));
  }

  res.status(200).json({
    data: user,
  });
});

exports.updateUserById = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;

  const existingUser = await User.findById(id);

  if (!existingUser) {
    return next(new AppError("User not found with this ID", 404));
  }

  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(202).json({
    data: updatedUser,
  });
});

exports.deleteUserById = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;

  const existingUser = await User.findById(id);

  if (!existingUser) {
    return next(new AppError("User not found with this ID", 404));
  }

  await User.deleteOne({ _id: id });

  res.status(204).json({
    message: "User has been deleted",
  });
});

// Upload Photo
exports.uploadUserPhotoByID = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const profileToUpload = req.file;

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError("User not found with this id", 404));
  }

  const profileName = `${user._id}-${profileToUpload.originalname}`;

  const cloudinaryStream = cloudinary.uploader.upload_stream(
    {
      folder: "Dev",
      public_id: profileName,
    },
    async (error, result) => {
      if (error) {
        console.log(error);
        return next(new AppError("Error upload photo", 500));
      } else {
        user.profile = result.secure_url;
        await user.save();
        res.status(201).json({
          status: "success",
          message: "Profile photo has been uploaded",
          data: user,
        });
      }
    }
  );

  streamifier.createReadStream(profileToUpload.buffer).pipe(cloudinaryStream);
});
