const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

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

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({ message: "email é obrigatório" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "senha é obrigatório" });
      return;
    }

    //check if user exists
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(422).json({ message: "usuario não cadastrado" });
      return;
    }

    //check password in password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(422).json({ message: "senha invalida" });
      return;
    }

    await createUserToken(req, res, user);
  }

  static async checkUser(req, res) {
    var currentUser;
    console.log(req.headers.authorization);

    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, "secret");

      currentUser = await User.findById(decoded.id);

      currentUser.password = undefined;
    } else {
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }
  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(422).json({
        message: "usuario não encontrado!",
      });
      return;
    }
    res.status(200).json({ user });
  }

  static async editUser(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    var image = "";

    const { name, email, phone, password, confirmPassword } = req.body;

    // validations
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório!" });
      return;
    }

    user.name = name;

    if (!email) {
      res.status(422).json({ message: "O e-mail é obrigatório!" });
      return;
    }

    // check if user exists
    const userExists = await User.findOne({ email: email });

    if (user.email !== email && userExists) {
      res.status(422).json({ message: "Por favor, utilize outro e-mail!" });
      return;
    }

    user.email = email;



    if (!phone) {
      res.status(422).json({ message: "O telefone é obrigatório!" });
      return;
    }

    user.phone = phone;

    // check if password match
    if (password != confirmPassword) {
      res.status(422).json({ error: "As senhas não conferem." });
    }
  }
};
