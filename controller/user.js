/* eslint-disable prefer-regex-literals */
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const service = require("../service/user");
const genereteJSON = require("../functions/genereteJSON");
const hashPassword = require("../functions/hashPassword");
const verifyPassword = require("../functions/verifyPassword");

// Regex has following rules:
// - Minimum one digit,
// - Minimum one uppercase letter,
// - Minimum one lowercase letter,
// - Minimum one special character,
const passwordPattern = new RegExp(
  '^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,}$',
);

const schema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "pl"] },
    })
    .required(),
  password: Joi.string().pattern(passwordPattern).required(),
});

const subscriptionSchema = Joi.string().valid("starter", "pro", "business");

const SECRET = process.env.SECRET_WORD;

const create = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const newUserTemplate = {
      email,
      password,
    };

    const validationByJoi = schema.validate(newUserTemplate);

    if (validationByJoi.error) {
      const validationErrorMessage = validationByJoi.error.details[0].message;
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

    // If getUserByEmail doesn't find user with argument email, it returns null
    const isEmailUsed = Boolean(await service.getUserByEmail(email));

    if (isEmailUsed) {
      return res
        .status(409)
        .json(genereteJSON("error", 409, "error message", "Email in use"));
    }

    const hash = await hashPassword(password);

    const newUser = { ...newUserTemplate, password: hash };

    await service.addUser(newUser);

    res.status(201).json(
      genereteJSON("success", 201, "user", {
        email,
        subscription: "starter",
      }),
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validationByJoi = schema.validate({
      email,
      password,
    });

    if (validationByJoi.error) {
      const validationErrorMessage = validationByJoi.error.details[0].message;
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

    const user = await service.getUserByEmail(email);

    const result = await verifyPassword(password, user.password);

    if (!result) {
      return res
        .status(401)
        .json(
          genereteJSON(
            "error",
            401,
            "error message",
            "Email or password is wrong",
          ),
        );
    }

    const payload = {
      _id: user._id,
    };

    // creates jwt lasts 5 minutes
    const token = jwt.sign(payload, SECRET, { expiresIn: 60 * 5 });

    const responseBody = {
      token,
      user: { email: user.email, subscription: user.subscription },
    };

    res.json(genereteJSON("success", 200, "body", responseBody));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const logout = async (req, res, next) => {
  const { _id: id } = req.user;

  try {
    const user = await service.getUserById(id);

    if (user.token) {
      await service.updateUserById(id, { token: null });
    }

    res.status(204).json();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  const { _id: id } = req.user;

  try {
    const user = await service.getUserById(id);

    res.json(genereteJSON("success", 200, "user", user));
  } catch (error) {
    console.log(error);
    next();
  }
};

const update = async (req, res, next) => {
  const { _id: id } = req.user;
  const { subscription } = req.body;

  try {
    const validationByJoi = subscriptionSchema.validate(subscription);

    if (validationByJoi.error) {
      res
        .status(400)
        .json(
          genereteJSON(
            "error",
            400,
            "error message",
            "Unknown subscription type",
          ),
        );
    }

    await service.updateUserById(id, { subscription });

    res.json(genereteJSON("success", 200, "subscription", subscription));
  } catch (error) {
    console.log(error);
    next();
  }
};

module.exports = {
  create,
  login,
  logout,
  getUserById,
  update,
};
