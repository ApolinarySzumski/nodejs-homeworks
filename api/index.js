// npm modules
const express = require("express");

//  my modules
const ctrlContact = require("../controller/contact.js");
const ctrlUser = require("../controller/user.js");
const auth = require("../functions/auth");
const upload = require("../config/multer.js");

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
router.post("/users/login", ctrlUser.login);
router.get("/users/logout", auth, ctrlUser.logout);
router.get("/users/current", auth, ctrlUser.getUserById);
router.patch("/users", auth, ctrlUser.updateSubscription);
router.patch(
  "/users/avatars",
  auth,
  upload.single("avatar"),
  ctrlUser.updateAvatar,
);

module.exports = router;
