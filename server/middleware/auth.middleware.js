const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      jwt.verify(token, "masai", (err, decoded) => {
        if (decoded) {
          req.body.userID = decoded.userID;
          req.body.roles = decoded.roles;
          next();
        } else {
          res.status(400).send({ error: "You are not authorized" });
        }
      });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  } else {
    res.status(400).send({ msg: "Please Login" });
  }
};

module.exports = {
  auth,
};
