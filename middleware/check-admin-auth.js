const jwt = require("jsonwebtoken");
const constants = require("../resources/constants");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log('Admin:', token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // check if the token has the admin role
    if (!decoded.roles?.includes(constants.ROLE.ADMIN))
        return res.status(401).json({message: 'Admin authorization failed'});

    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed!",
      error
    });
  }
};
