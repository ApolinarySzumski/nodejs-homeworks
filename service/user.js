const User = require("./schemas/user");

const storeHash = async (hash) => await User.create({ hash });
const getUserByEmail = async (email) => await User.findOne({ email });
const addUser = async (userData) => await User.create(userData);

module.exports = { storeHash, getUserByEmail, addUser };
