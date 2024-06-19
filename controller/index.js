const service = require("../service/index.js");

const genereteJSON = (status, code, dataKey, valueKey) => ({
  status,
  code,
  data: { dataKey: valueKey },
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

// const getById = async (req, res, next) => {
//   const { contactId } = req.params;
//   try {
//     const contact = await service.getTaskById(contactId);
//     if (contact) {
//       return res.json(genereteJSON("success", 200, "contact", contact));
//     }
//     return res
//       .status(404)
//       .json(
//         genereteJSON(
//           "error",
//           404,
//           "message",
//           `Not found contact with id: ${contactId}`,
//         ),
//       );
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };

module.exports = {
  get,
};
