const bcrypt = require("bcrypt");

const saltRounds = 10;

const hashPassword = async (password) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = hashPassword;
