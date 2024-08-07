// npm modules
const { Strategy, ExtractJwt } = require("passport-jwt");
require("dotenv").config();

// my modules
const service = require("../service/user");

const secret = process.env.SECRET_WORD;

const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const strategy = new Strategy(params, async (payload, done) => {
  try {
    const user = await service.getUserById(payload._id);
    if (user) return done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = strategy;
