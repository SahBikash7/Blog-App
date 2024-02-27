const { verifyJWT } = require("./token");
const userModel = require("../modules/users/user.model");

const checkRole = (sysRole) => {
  return async (req, res, next) => {
    try {
      const { access_token } = req.headers || "";
      if (!access_token) throw new Error("Access Token is required");

      const data = verifyJWT(access_token);
      if (!data) throw new Error("Access Denied");

      const { data: user } = data;
      const { email } = user;
      const userData = await userModel.findOne({ email, isActive: true });
      if (!userData) throw new Error("User Not Found");

      const isValidRole = sysRole.some((role) => userData.roles.includes(role));
      if (!isValidRole) throw new Error("Permission Denied");

      req.currentUser = userData._id;

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { checkRole };
