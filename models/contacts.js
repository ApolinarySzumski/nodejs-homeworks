const fs = require("fs").promises;

const contactsPath = "./models/contacts.json";

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    console.log("Error:", error.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);

    const isContactId = contacts.find((contact) => contact.id === contactId);
    const arrayWithContact = contacts.filter(
      (contact) => contact.id === contactId,
    );

    const contact = arrayWithContact[0];

    if (isContactId) {
      return contact;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error:", error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const newContacts = contacts.filter((contact) => contact.id !== contactId);
    const newData = JSON.stringify(newContacts);
    fs.writeFile(contactsPath, newData);
  } catch (error) {
    console.log("Error:", error.message);
  }
};

const addContact = async (body) => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const newContacts = [...contacts, body];
    const newData = JSON.stringify(newContacts);
    fs.writeFile(contactsPath, newData);
  } catch (error) {
    console.log("Error:", error.message);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const arrayWithContact = contacts.filter(
      (contact) => contact.id === contactId,
    );
    const contact = arrayWithContact[0];
    const newContact = { ...contact, ...body };
    const newContacts = [
      ...contacts.filter((contact) => contact.id !== contactId),
      newContact,
    ];
    const newData = JSON.stringify(newContacts);
    fs.writeFile(contactsPath, newData);
  } catch (error) {
    console.log("Error:", error.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
