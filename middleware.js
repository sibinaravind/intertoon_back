let checkToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (token != null) {
    token = token.substring(7);

    if (token === 'akhil@intertoons.com') {
      next();
    }
    else {
      return res.status(500).json({
        status: false,
        msg: "token is invalid",
      });
    }

  }
};
module.exports = {
  checkToken: checkToken,
};