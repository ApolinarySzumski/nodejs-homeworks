// npm modules
const Joi = require("joi");

// my modules
const service = require("../service/contact.js");
const genereteJSON = require("../functions/genereteJSON.js");

// eslint-disable-next-line prefer-regex-literals
const phonePattern = new RegExp("^[+]?[0-9]*$");

const schema = Joi.object({
  name: Joi.string().alphanum().min(5).max(15).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "pl"] },
    })
    .required(),
  phone: Joi.string().pattern(phonePattern).required(),
});

const get = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { page, limit, filter } = req.query;
  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  const parsedFilter = filter === "true";

  try {
    // Pagination for query params: Page and Limit
    const contacts = await service.getContacts(userId, parsedPage, parsedLimit);

    // Pagination for query param: Filter
    const contactsFilteredByFavorite = contacts.filter(
      (c) => c.favorite === parsedFilter,
    );

    if (filter) {
      return res.json(
        genereteJSON("success", 200, "contacts", {
          user: req.user,
          contacts: contactsFilteredByFavorite,
        }),
      );
    }

    res.json(
      genereteJSON("success", 200, "body", {
        user: req.user,
        userContacts: contacts,
      }),
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getById = async (req, res, _) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;

  try {
    const contact = await service.getContactById(contactId);

    if (contact.owner.toString() === userId.toString()) {
      return res.json(genereteJSON("success", 200, "contact", contact));
    }

    res
      .status(404)
      .json(genereteJSON("error", 404, "error message", "Contact not found"));
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json(
        genereteJSON(
          "error",
          404,
          "error message",
          error.message || "Something went wrong",
        ),
      );
  }
};

const create = async (req, res, _) => {
  const { _id: userId } = req.user;
  const { name, email, phone } = req.body;

  const bodyData = { name, email, phone };

  try {
    // I use synchronical validation
    const validationByJoi = schema.validate(bodyData);
    // This is example which explains condition in next line.
    //  We have two cases:
    // In first we have error. Why? Boolean(validationByJoi) returns true because validationByJoi has error key which value is string.
    // In second we haven't error. Why? Boolean(validationByJoi) returns undefind. Key error does't exist.
    if (validationByJoi.error) {
      return res
        .status(401)
        .json(
          genereteJSON(
            "error",
            401,
            "error message",
            "Unsuccessful validation",
          ),
        );
    }
    // added guard feature which disable creating contacts with existing email
    const newContactExistenceByEmail = await service.getContactByEmail(email);

    if (!newContactExistenceByEmail) {
      const newContact = await service.addContact(name, email, phone, userId);
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
      .json(
        genereteJSON(
          "error",
          400,
          "error message",
          error.message || "Something went wrong",
        ),
      );
  }
};

const remove = async (req, res, _) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;

  try {
    const contactToDelete = await service.getContactById(contactId);

    if (contactToDelete.owner.toString() === userId.toString()) {
      const deletedContact = await service.removeContact(contactId);
      return res.json(genereteJSON("success", 200, "contact", deletedContact));
    }

    res
      .status(404)
      .json(genereteJSON("error", 404, "error message", "Contact not found"));
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json(
        genereteJSON(
          "error",
          404,
          "error message",
          error.message || "Something went wrong",
        ),
      );
  }
};

const update = async (req, res, _) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  const { name, email, phone } = req.body;

  const bodyData = { name, email, phone };

  try {
    const validationByJoi = schema.validate(bodyData);

    if (validationByJoi.error) {
      return res
        .status(401)
        .json(
          genereteJSON(
            "error",
            401,
            "error message",
            "Unsuccessful validation",
          ),
        );
    }

    const contactToUpdate = await service.getContactById(contactId);

    if (contactToUpdate.owner.toString() === userId.toString()) {
      const updatedContact = await service.updateContact(
        contactId,
        name,
        email,
        phone,
      );
      return res.json(genereteJSON("success", 200, "contact", updatedContact));
    }

    res
      .status(404)
      .json(genereteJSON("error", 404, "error message", "Contact not found"));
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json(
        genereteJSON(
          "error",
          404,
          "error message",
          error.message || "Something went wrong",
        ),
      );
  }
};

const updateByFavorite = async (req, res, _) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  const { favorite } = req.body;

  try {
    const contactToUpdate = await service.getContactById(contactId);

    if (contactToUpdate.owner.toString() === userId.toString()) {
      const updatedContact = await service.updateContactByFavorite(
        contactId,
        favorite,
      );
      return res.json(genereteJSON("success", 200, "contact", updatedContact));
    }

    res
      .status(404)
      .json(genereteJSON("error", 404, "error message", "Contact not found"));
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json(
        genereteJSON(
          "error",
          400,
          "error message",
          error.message || "Something went wrong",
        ),
      );
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
