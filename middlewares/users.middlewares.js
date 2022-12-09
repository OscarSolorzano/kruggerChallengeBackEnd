var crypto = require('crypto');

// Models
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const userExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    attributes: { exclude: ['password'] },
    where: { id },
  });

  // If user doesn't exist, send error message
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // req.anyPropName = 'anyValue'
  req.user = user;
  next();
});

const addUserNameAndPassword = catchAsync(async (req, res, next) => {
  const { name, middlename, lastName, secondLastName, govId } = req.body;
  password = await crypto.randomBytes(8).toString('hex');
  req.password = password;

  if (await User.findAll({ where: { name, lastName } })) {
    userName = name.toLowerCase() + '.' + lastName.toLowerCase();
    req.userName = userName;
    next();
  } else if (
    await User.findAll({ where: { name, lastName, secondLastName } })
  ) {
    userName =
      name.toLowerCase() +
      '.' +
      lastName.toLowerCase() +
      '.' +
      secondLastName.toLowerCase();
    req.userName = userName;
    next();
  } else if (
    await User.findAll({
      where: { name, middlename, lastName, secondLastName },
    })
  ) {
    userName =
      name.toLowerCase() +
      '.' +
      middlename.toLowerCase() +
      '.' +
      lastName.toLowerCase() +
      '.' +
      secondLastName.toLowerCase();
    req.userName = userName;
    next();
  } else {
    userName = userName = name + '.' + lastName + '.' + govId.slice(7);
    req.userName = userName;
    next();
  }
});

module.exports = {
  userExists,
  addUserNameAndPassword,
};
