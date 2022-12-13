const express = require('express');

// Controllers
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
  addProfile,
  getProfileById,
} = require('../controllers/users.controller');

// Middlewares
const {
  userExists,
  addUserNameAndPassword,
} = require('../middlewares/users.middlewares');
const {
  protectSession,
  protectUsersAccount,
  protectAdmin,
} = require('../middlewares/auth.middlewares');
const {
  createUserValidators,
} = require('../middlewares/validators.middlewares');

const usersRouter = express.Router();

usersRouter.post('/', addUserNameAndPassword, createUser);

usersRouter.post('/login', login);

// Protecting below endpoints
usersRouter.use(protectSession);

usersRouter.post('/profile', addProfile);

usersRouter.use(protectAdmin);

usersRouter.get('/', getAllUsers);

usersRouter.get('/:id', userExists, getProfileById);

usersRouter.patch('/:id', userExists, updateUser);

usersRouter.delete('/:id', userExists, deleteUser);

module.exports = { usersRouter };
