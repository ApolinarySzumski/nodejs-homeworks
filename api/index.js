const express = require("express");

const ctrlContact = require("../controller/contact.js");
const ctrlUser = require("../controller/user.js");

const router = express.Router();

// Contacts
router.get("/contacts", ctrlContact.get);
router.get("/contacts/:contactId", ctrlContact.getById);
router.post("/contacts", ctrlContact.create);
router.delete("/contacts/:contactId", ctrlContact.remove);
router.put("/contacts/:contactId", ctrlContact.update);
router.patch("/contacts/:contactId/favorite", ctrlContact.updateByFavorite);

// Users
router.post("/users/signup", ctrlUser.create);

module.exports = router;
