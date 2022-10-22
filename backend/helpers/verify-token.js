const jwt = require("jsonwebtoken");
const getToken = require("./get-token");

//middleware validação
const checkToken =  (req, res, next) => {
    const token = getToken(req);
    console.log(req.headers.authorization);
    if (!req.headers.authorization) {
        res.status(401).json({ message: "Acesso negado" })
    }
    if (!token) {
        res.status(401).json({ message: "Acesso negado" })
    }

    try {
        const verified = jwt.verify(token, "secret");
        req.user = verified;
        next();
       
    }


    catch (error) {
        res.status(400).json({ message: "Token Invalido" });
    }

}

module.exports = checkToken