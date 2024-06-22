const bcrypt = require("bcrypt");

const verifyPassword = async (password, hash) => {
  try {
    const match = await bcrypt.compare(password, hash);
    if (match) return true;
    return false;
  } catch (error) {
    console.log(error);
  }
};

module.exports = verifyPassword;
