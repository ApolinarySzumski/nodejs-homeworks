// my module
const User = require("./schemas/user");

const storeHash = async (hash) => await User.create({ hash });
const storeVerificationEmailToken = async (verificationToken) =>
  await User.create({ verificationToken });
const getUserByEmail = async (email) => await User.findOne({ email });
const addUser = async (userData) => await User.create(userData);
const getUserById = async (id) => await User.findById(id);
const updateUserById = async (id, obj) => await User.findByIdAndUpdate(id, obj);
const getUserByVerificationToken = async (verificationToken) =>
  await User.findOne({ verificationToken });

module.exports = {
  storeHash,
  getUserByEmail,
  addUser,
  getUserById,
  updateUserById,
  storeVerificationEmailToken,
  getUserByVerificationToken,
};
