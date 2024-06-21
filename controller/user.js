const Joi = require("joi");
const bcrypt = require("bcrypt");
const service = require("../service/user");
const genereteJSON = require("../functions/genereteJSON");

// Regex has following rules:
// - Minimum one digit,
// - Minimum one uppercase letter,
// - Minimum one lowercase letter,
// - Minimum one special character,
const passwordPattern =
  // eslint-disable-next-line prefer-regex-literals
  new RegExp(`^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,}$
`);

const schema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "pl"] },
    })
    .required(),
  password: Joi.string().pattern(passwordPattern).required(),
});

const saltRounds = 10;

const create = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      try {
        await service.storeHash(hash);
      } catch (error) {
        console.log(error);
        console.log(err);
      }
    });

    const newUser = {
      email,
      password,
    };

    const validationByJoi = schema.validate(newUser);
    const validationErrorMessage = validationByJoi.error.details[0].message;
    if (validationByJoi.error) {
      return res
        .status(400)
        .json(
          genereteJSON(
            "error",
            400,
            "error message",
            validationErrorMessage || "Unsuccessful validation",
          ),
        );
    }

    if (newUser.email) {
      return res
        .status(409)
        .json(genereteJSON("error", 400, "error message", "Email in use"));
    }

    res.status(201).json(
      genereteJSON("success", 201, "user", {
        email,
        subscription: "starter",
      }),
    );
  } catch (error) {
    console.log(error);
    next();
  }
};

module.exports = {
  create,
};
