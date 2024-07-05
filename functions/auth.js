const passport = require("passport");
const strategy = require("../config/passport");
const genereteJSON = require("./genereteJSON");

passport.use(strategy);

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (!user || error) {
      return res
        .status(401)
        .json(genereteJSON("error", 401, "error message", "Not authorized"));
    }
    req.user = user;
    next(error);
  })(req, res, next);
};

module.exports = auth;
