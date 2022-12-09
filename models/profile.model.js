const { db, DataTypes } = require('../utils/database.util');

const Profile = db.define('profile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  birthday: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  isVaccinated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  vaccine: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  vaccinationDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  numberOfDoses: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = { Profile };
