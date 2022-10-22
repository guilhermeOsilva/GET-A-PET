const jwt = require("jsonwebtoken");

//Create Token
const createUserToken = async(req, res, user)=> {
    const token = jwt.sign({
        name: user.name,
        id: user._id,
    }, "secret");
    
//Return Token
    res.status(200).json({ 
        message: "Você está autenticado",
        token: token,
    })
}


module.exports = createUserToken;