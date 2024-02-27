const bcryptjs = require("bcryptjs");

const hashPassword = (password) =>
  bcryptjs.hashSync(password, Number(process.env.SALT_ROUNDS));

const comparePassword = (password, hashPassword) =>
  bcryptjs.compareSync(password, hashPassword);

module.exports = { hashPassword, comparePassword };
