const express = require("express");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

// eslint-disable-next-line prefer-regex-literals
const phonePattern = new RegExp("^[+]?[0-9]*$");

const schema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().alphanum().min(5).max(15).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "pl"] },
    })
    .required(),
  phone: Joi.string().pattern(phonePattern).required(),
});

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (error) {
    console.log("Error:", error.message);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.log("Error:", error.message);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const newContactToValidation = {
      id: uuidv4(),
      name,
      email,
      phone,
    };

    const newContact = await schema.validateAsync(newContactToValidation);

    addContact(newContact);
    res
      .status(201)
      .json({ message: "Validation Successful", data: newContact });
  } catch (error) {
    res.status(400).json({ message: "Please correctly fill all fields" });
    console.log("Error:", error.message);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contacts = await listContacts();
    // expected output is object with contact data || undefined
    const contact = contacts.find((contact) => contact.id === contactId);
    if (contact) {
      removeContact(contactId);
      res.json({ message: "Contact deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.log("Error:", error.message);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, email, phone } = req.body;

    const contacts = await listContacts();
    const contact = contacts.find((contact) => contact.id === contactId);

    if (contact) {
      const newContactToValidation = { ...contact, name, email, phone };
      const newContact = await schema.validateAsync(newContactToValidation);
      updateContact(contactId, newContact);
      res.json({ message: "Validation Successful", data: newContact });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Please correctly fill all fields" });
    console.log("Error:", error.message);
  }
});

module.exports = router;
