// my module
const User = require("./schemas/user");

const storeHash = async (hash) => await User.create({ hash });
const getUserByEmail = async (email) => await User.findOne({ email });
const addUser = async (userData) => await User.create(userData);
const getUserById = async (id) => await User.findById(id);
const updateUserById = async (id, obj) => await User.findByIdAndUpdate(id, obj);

module.exports = {
  storeHash,
  getUserByEmail,
  addUser,
  getUserById,
  updateUserById,
};
