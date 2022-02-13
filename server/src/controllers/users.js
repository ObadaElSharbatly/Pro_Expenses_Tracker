import Users from "../models/Users.js";
import bcrypt from "bcrypt";
import { isRightPassword, isValidEmail } from "../utils/users.js";

export const createNewUser = async (req, res) => {
  const { name, email, password, confirmPassword, currency, gender } = req.body;

  try {
    //check if the email is valid
    if (!(await isValidEmail(email)))
      throw new Error("This email is already exists .. you may need to login");
    // check if passwords are match
    console.log("is match pass:", isRightPassword(password, confirmPassword));
    if (!isRightPassword(password, confirmPassword))
      throw new Error("Password doesn't match");

    // create hash to secure the password
    const hash = bcrypt.hashSync(password, 10);

    // if no currency use EUR
    let theCurrency = currency;
    if (currency === "") {
      theCurrency = "EUR";
    }

    // if everything is okay we can create a new account
    const newUser = await Users.create({
      name,
      email,
      password: hash,
      currency: theCurrency,
      gender,
    });

    // return the user object to response without the password
    const result = {
      name: newUser.name,
      email: newUser.email,
      currency: newUser.currency,
      gender: newUser.gender,
      _id: newUser._id,
    };

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: `Error: ${error.message}`,
    });

    console.error(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      throw new Error(
        "like any website in the world => Email and password are required to login"
      );
    // check if email is exist
    const isUser = await Users.findOne({ email });
    if (!isUser)
      throw new Error(
        "This Email is not exist .. maybe you need to create and account"
      );

    // compare and check the password
    const hash = isUser.password;
    const isCorrectPassword = bcrypt.compareSync(password, hash); // true
    if (!isCorrectPassword) throw new Error("Wrong password");

    // return the user object to response without the password
    const result = {
      name: isUser.name,
      email: isUser.email,
      currency: isUser.currency,
      _id: isUser._id,
      gender: isUser.gender,
    };
    //login successfully
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: `Error: ${error.message}`,
    });
  }
};