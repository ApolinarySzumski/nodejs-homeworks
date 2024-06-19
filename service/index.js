const Contact = require("./schemas/contact.js");

const getContacts = async () => Contact.find();

module.exports = {
  getContacts,
};
