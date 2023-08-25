const jwt = require("jsonwebtoken");
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

const verifyJwtToken = catchAsync(async (req, res, next) => {
  if (req.headers["authorization"]) {
    try {
      let authorization = req.headers["authorization"].split(" ");
      if (authorization[0] !== "Bearer") {
        throw new Error("Bearer Missing in token");
      } else {
        req.jwt = jwt.verify(authorization[1], process.env.JWTTOKEN);
        return next();
      }
    } catch (err) {
      throw new Error("Invalid User");
    }
  } else {
    throw new Error("Token Not Found");
  }
});

module.exports = { verifyJwtToken };
