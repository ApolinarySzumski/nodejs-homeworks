const service = require("../service/contact.js");
const Joi = require("joi");

const genereteJSON = (status, code, dataKey, valueKey) => ({
  status,
  code,
  data: { [dataKey]: valueKey },
});

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

const create = async (req, res, next) => {
  const { name, email, phone } = req.body;

  const bodyData = { name, email, phone };

  try {
    // I use synchronical validation
    const validationByJoi = schema.validate(bodyData);
    // This is example which explains condition in next line.
    // console.log("Moj blad ", Boolean(validationByJoi.error));
    //  We have two cases:
    // In first we have error. Why ? Boolean(validationByJoi) returns true because validationByJoi has error key which value is string.
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

const remove = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const deletedContact = await service.removeContact(contactId);
    res.json(genereteJSON("success", 200, "contact", deletedContact));
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

const update = async (req, res, next) => {
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
