const service = require("../service/index.js");

const genereteJSON = (status, code, dataKey, valueKey) => ({
  status,
  code,
  data: { [dataKey]: valueKey },
});

const get = async (req, res, next) => {
  try {
    const contacts = await service.getContacts();
    res.json(genereteJSON("success", 200, "contacts", contacts));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const contact = await service.getContactById(contactId);
    res.json(genereteJSON("success", 200, "contact", contact));
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json(genereteJSON("error", 404, "error message", error.message));
    next(error);
  }
};

const create = async (req, res, next) => {
  const { name, email, phone } = req.body;

  try {
    // added guard feature which disable creating contacts with existing email
    const contacts = await service.getContacts();
    const newContactToAdd = { name, email, phone };
    const newContactExistenceByEmail = contacts.find(
      (c) => c.email === newContactToAdd.email,
    );
    if (!newContactExistenceByEmail) {
      const newContact = await service.addContact(name, email, phone);
      return res
        .status(201)
        .json(genereteJSON("success", 201, "contact", newContact));
    }
    res
      .status(403)
      .json(
        genereteJSON(
          "error",
          403,
          "error message",
          "This email is already used",
        ),
      );
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json(genereteJSON("error", 400, "error message", error.message));
    next();
  }
};

const remove = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const deletedContact = await service.removeContact(contactId);
    res.json(genereteJSON("success", 200, "contact", deletedContact));
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json(genereteJSON("error", 404, "error message", error.message));
    next();
  }
};

const update = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;

  try {
    const updatedContact = await service.updateContact(
      contactId,
      name,
      email,
      phone,
    );
    res.json(genereteJSON("success", 200, "contact", updatedContact));
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json(genereteJSON("error", 404, "error message", error.message));
    next();
  }
};

const updateByFavorite = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  try {
    const updatedContact = await service.updateContactByFavorite(
      contactId,
      favorite,
    );
    res.json(genereteJSON("success", 200, "contact", updatedContact));
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json(
        genereteJSON("error", 400, "error message", "missing field favorite"),
      );
    next();
  }
};
module.exports = {
  get,
  getById,
  create,
  remove,
  update,
  updateByFavorite,
};
