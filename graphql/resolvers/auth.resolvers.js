const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

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
      return { ...newUser._doc, _id: user.id, password: null };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
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
  },
};
