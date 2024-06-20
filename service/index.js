const Contact = require("./schemas/contact.js");

const getContacts = async () => await Contact.find();
const getContactById = async (contactId) => await Contact.findById(contactId);
const addContact = async (name, email, phone) =>
  await Contact.create({ name, email, phone });
const removeContact = async (contactId) =>
  await Contact.findByIdAndDelete(contactId);
const updateContact = async (contactId, name, email, phone) =>
  await Contact.findByIdAndUpdate(
    contactId,
    { name, email, phone },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
const updateContactByFavorite = async (contactId, favorite) =>
  await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    { returnDocument: "after", runValidators: true },
  );

module.exports = {
  getContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateContactByFavorite,
};
