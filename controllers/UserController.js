const User = require("../models/User");
const bcrypt = require("bcrypt");
const createUserToken =require("../helpers/create-user-token");

module.exports = class UserController {
  static async register(req, res) {
    const { name, email, password, confirmPassword, phone } = req.body;

    //validation
    if (!name) {
      res.status(422).json({ message: "nome obrigatório" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "senha é obrigatória" });
      return;
    }
    if (!phone) {
      res.status(422).json({ message: "numero é obrigatório" });
      return;
    }
    if (!email) {
      res.status(422).json({ message: "email é obrigatório" });
      return;
    }
    if (!confirmPassword) {
      res.status(422).json({ message: "confirmação de senha é obrigatório" });
      return;
    }
    if (password !== confirmPassword) {
      res.status(422).json({ message: "senhas não conferem" });
      return;
    }

    //confirm if User exists
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      res.status(422).json({ message: "email já cadastrado! Use outro" });
      return;
    }

    //create password
    var salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //create User
    const user = new User({
      name,
      email,
      phone,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();
      await createUserToken(req, res, newUser);

    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
};
