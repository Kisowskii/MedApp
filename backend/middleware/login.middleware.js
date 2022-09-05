const jwt = require("jsonwebtoken");

module.exports = function (user) {
  return function (req, res, next) {
    user
      .findOne({ login: req.body.login })
      .then((fetchedUser) => {
        if (!fetchedUser) {
          return res.status(401).json({ message: "Auth failed" });
        }
        if (fetchedUser.password !== req.body.password) {
          return res.status(401).json({ message: "Auth failed" });
        }
        if (!fetchedUser.password) {
          return res.status(403).json({ message: "Auth failed" });
        }

        const token = jwt.sign(
          { login: fetchedUser, userId: fetchedUser._id },
          `${user}Paswword`,
          { expiresIn: "1h" }
        );
        res.status(200).json({ token: token, id: fetchedUser._id });
      })
      .catch((err) => {
        console.error(err);
        res.status(401).json({ message: "Auth failed" });
      });
  };
};
