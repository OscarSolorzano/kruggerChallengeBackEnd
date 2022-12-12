const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');
const { Profile } = require('../models/profile.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

// Gen random jwt signs
// require('crypto').randomBytes(64).toString('hex') -> Enter into the node console and paste the command

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    where: { status: 'active' },
    include: { model: Profile },
  });

  res.status(200).json({
    status: 'success',
    data: { users },
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { names, lastNames, govId, email, role } = req.body;
  const { userName, password } = req;

  if (role !== 'admin' && role !== 'user') {
    return next(new AppError('Invalid role', 400));
  }

  // Encrypt the password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  await User.create({
    names,
    lastNames,
    govId,
    email,
    userName,
    role,
    password: hashedPassword,
  });

  // Remove password from response
  // newUser.password = undefined;

  // 201 -> Success and a resource has been created
  res.status(201).json({
    status: 'success',
    data: { userName, password },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  let { names, lastNames, govId, email, role, userName, password } = req.body;
  let { user } = req;

  // Encrypt the password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  user = await user.update({
    name,
    middleName,
    lastName,
    secondLastName,
    govId,
    email,
    userName,
    role,
    password: hashedPassword,
  });

  user.password = undefined;

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});

const login = catchAsync(async (req, res, next) => {
  // Get email and password from req.body
  const { userName, password } = req.body;

  // Validate if the user exist with given email
  const user = await User.findOne({
    where: { userName, status: 'active' },
    include: { model: Profile },
  });

  // Compare passwords (entered password vs db password)
  // If user doesn't exists or passwords doesn't match, send error
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Wrong credentials', 400));
  }

  // Remove password from response
  user.password = undefined;

  // Generate JWT (payload, secretOrPrivateKey, options)
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.status(200).json({
    status: 'success',
    data: { user, token },
  });
});

const addProfile = catchAsync(async (req, res, next) => {
  let { sessionUser } = req;
  const {
    birthday,
    address,
    phone,
    isVaccinated,
    vaccine,
    vaccinationDate,
    numberOfDoses,
  } = req.body;
  sessionUser.profile = await sessionUser.createProfile({
    birthday,
    address,
    phone,
    isVaccinated,
    vaccine,
    vaccinationDate,
    numberOfDoses,
  });

  res.status(200).json({
    status: 'success',
    data: { sessionUser },
  });
});

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
  addProfile,
};
