const fs = require("fs").promises;

const contactsPath = "./models/contacts.json";

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  return contacts;
};

const getContactById = async (contactId) => {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);

  const isContactId = contacts.find((contact) => contact.id === contactId);
  const arrayWithContact = contacts.filter(
    (contact) => contact.id === contactId,
  );

  const contact = arrayWithContact[0];

  if (isContactId) {
    return contact;
  }

  return false;
};

const removeContact = async (contactId) => {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  const newContacts = contacts.filter((contact) => contact.id !== contactId);
  const newData = JSON.stringify(newContacts);
  await fs.writeFile(contactsPath, newData);
};

const addContact = async (body) => {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  const newContacts = [...contacts, body];
  const newData = JSON.stringify(newContacts);
  await fs.writeFile(contactsPath, newData);
};

const updateContact = async (contactId, body) => {
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
  await fs.writeFile(contactsPath, newData);
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
