module.exports = function (action) {
  return function (req, res, next) {
    action(req, (err, result) => {
      if (err) {
        console.error("POST error: ", err);
        return next(err);
      }
      res.status(201).json();
    });
  };
};
