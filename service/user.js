const User = require("./schemas/user");

const storeHash = async (hash) => await User.Create({ hash });

module.exports = { storeHash };
