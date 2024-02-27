const userModel = require("./user.model");
const { mailer } = require("../../services/mailer");
const { hashPassword, comparePassword } = require("../../utils/bcrypt");
const { signJWT, generateRandomToken } = require("../../utils/token");

const register = async (payload) => {
  delete payload.roles;
  payload.password = hashPassword(payload.password);
  const user = await userModel.create(payload);
  if (!user) throw new Error("Registeration Failed");
  const result = await mailer(
    user.email,
    "Registeration Successfull",
    "User-SignUp Successfull"
  );
  if (result) return "User Registeration Successfull";
  return "User Registeration Failed";
};

const getById = (_id) => {
  return userModel.findOne({ _id });
};

const getAll = async (search, page = 1, limit = 20) => {
  //Searching, sorting and filter with pagination

  const query = [];

  // Searching By Name :
  if (search?.name) {
    query.push({
      $match: {
        name: new RegExp(search.name, "gi"),
      },
    });
  }

  // Searching By Email :
  if (search?.email) {
    query.push({
      $match: {
        email: new RegExp(search.email, "gi"),
      },
    });
  }

  // Searching By Phone Number :
  // if (search?.phone) {
  //   query.push({
  //     $match: {
  //       phone: new RegExp(phone.email, "gi"),
  //     },
  //   });
  // }

  // Sorting By createdAt :
  // if (sortBy === "createdAt") {
  //   query.push({ $sort: { createdAt: sortStatus === "ascending" ? -1 : 1 } });
  // }

  query.push(
    {
      $match: {
        name: new RegExp("bik", "gi"),
      },
    },
    {
      $facet: {
        metadata: [
          {
            $count: "total",
          },
        ],
        data: [
          {
            $skip: (+page - 1) * +limit,
          },
          {
            $limit: +limit,
          },
        ],
      },
    },
    {
      $addFields: {
        total: {
          $arrayElemAt: ["$metadata.total", 0],
        },
      },
    },
    {
      $project: {
        metadata: 0,
      },
    }
  );

  const result = await userModel.aggregate(query);
  return {
    msg: result[0].data,
    total: result[0].total || 0,
    page: +page,
    limit: +limit,
  };
};

const logIn = async (payload) => {
  const { email, password } = payload;
  if (!email) throw new Error("Email is Missing");
  if (!password) throw new Error("Password is Missing");

  // check if user exist or not using email and then get the hashPassword and then compare it and if password matched login into the system

  const user = await userModel
    .findOne({ email, isActive: true })
    .select("+password");
  if (!user) throw new Error("User doesn't exist");

  const { password: hashPw } = user;
  const result = comparePassword(password, hashPw);
  if (!result) throw new Error("Incorrect Password or Email");

  const userPayload = { name: user.name, email: user.email, roles: user.roles };
  const token = signJWT(userPayload);
  return token;
};

const updateById = (_id, payload) => {
  return userModel.updateOne({ _id }, payload);
};

const generateFpToken = async (payload) => {
  /*
  1. in req.body send email
  2. check if user exists ornot
  3. send the email with recovery token
  4. store the token in the server as well
  5. compare the token
  6. if token matches,ask for new password
  7. hash the password
  8. upadate the database password for that email  
  */

  const { email } = payload;
  if (!email) throw new Error("Email is Missing");

  const user = await userModel.findOne({ email });
  if (!user) throw new Error("User doesn't exist");

  const randomToken = generateRandomToken();

  await userModel.updateOne({ email }, { token: randomToken });

  const isEmailSent = await mailer(
    user.email,
    "Forget Password",
    `Your Token is ${randomToken}`
  );
  if (isEmailSent) return "Forget Password Token Sent To Your Email";
};

const verifyFpToken = async (payload) => {
  const { token, email, password } = payload;
  if (!token) throw new Error("Token is Missing");
  if (!email) throw new Error("Email is Missing");
  if (!password) throw new Error("Password is Missing");

  const user = await userModel.findOne({ email });
  if (!user) throw new Error("User doesn't Exist");

  const { token: tokenToVerify } = user;
  if (token !== tokenToVerify) throw new Error("Token didn't Match");

  await userModel.updateOne(
    { email },
    { password: hashPassword(password), token: "" }
  );

  return "Password Updated Successfully";
};

const resetPassword = async (payload) => {
  const { userId, password } = payload;
  if (!userId) throw new Error("userID is Missing");
  if (!password) throw new Error("Password is Missing");
  const result = await userModel.updateOne(
    { _id: userId },
    { password: hashPassword(password) }
  );
  res.json({ msg: result });
};

const changePassword = async (payload) => {
  const { userId, oldPassword, newPassword } = payload;
  if (!userId) throw new Error("UserId is Missing");
  if (!oldPassword) throw new Error("Old Password is Missing");
  if (!newPassword) throw new Error("New Password is Missing");

  const user = await userModel.findOne({ _id: userId }).select("+password");
  if (!user) throw new Error("User doesn't Exist");

  const isPasswordVerified = comparePassword(oldPassword, user.password);
  if (!isPasswordVerified) throw new Error("Incorrect Previous Password");

  await userModel.updateOne(
    { _id: userId },
    { password: hashPassword(newPassword) }
  );

  return "Password Changed Successfully";
};

const create = async (payload) => {
  return await userModel.create(payload);
};

const getProfile = async (_id) => {
  return await userModel.findOne({ _id });
};

const updateProfile = async (_id, payload) => {
  delete payload.email;
  return await userModel.updateOne({ _id }, payload);
};

const blockUser = async (_id) => {
  const user = await userModel.findOne({ _id });
  if (!user) throw new Error("User doesn't Exist");
  const payload = { isActive: !user.isActive };
  return await userModel.updateOne({ _id }, payload);
};

module.exports = {
  // BOTH USER AND ADMIN
  logIn,
  changePassword,

  // ADMIN ONLY
  create,
  getById,
  updateById,
  generateFpToken,
  verifyFpToken,
  resetPassword,
  blockUser,
  getAll,

  // User Only
  register,
  getProfile,
  updateProfile,
};
