const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

const loginCheck = async (email, password) => {
  try {
    const userData = await User.findOne({ email: email });
    if (!userData) {
      throw new Error("Invalid Credentials");
    }

    const passwordVerified = await bcrypt.compare(password, userData.password);
    if (!passwordVerified) {
      throw new Error("Invalid Credentials");
    }

    const token = jwt.sign(
      { userId: userData.id, email: userData.email },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    return { userId: userData.id, token: token, tokenExpiration: 1 };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User already exists");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      const newUser = await user.save();
      return await loginCheck(args.userInput.email, args.userInput.password);
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    return await loginCheck(email, password);
  },
};
