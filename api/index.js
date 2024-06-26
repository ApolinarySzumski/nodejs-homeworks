const express = require("express");

const ctrlContact = require("../controller/contact.js");
const ctrlUser = require("../controller/user.js");
const auth = require("../functions/auth");

const router = express.Router();

// Contacts
router.get("/contacts", auth, ctrlContact.get);
router.get("/contacts/:contactId", auth, ctrlContact.getById);
router.post("/contacts", auth, ctrlContact.create);
router.delete("/contacts/:contactId", auth, ctrlContact.remove);
router.put("/contacts/:contactId", auth, ctrlContact.update);
router.patch(
  "/contacts/:contactId/favorite",
  auth,
  ctrlContact.updateByFavorite,
);

// Users
router.post("/users/signup", ctrlUser.create);
router.post("/users/login", ctrlUser.logIn);
router.get("/users/logout", auth, ctrlUser.logOut);
router.get("/users/current", auth, ctrlUser.get);
router.patch("/users", auth, ctrlUser.update);

module.exports = router;
