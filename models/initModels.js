// Models
const { Profile } = require('./profile.model');
const { User } = require('./user.model');

const initModels = () => {
  // 1 User <----> 1 Profile
  User.hasOne(Profile);
  Profile.belongsTo(User);
};

module.exports = { initModels };
