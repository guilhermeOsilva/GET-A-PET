const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("./db/conn");




//Config JSON response
app.use(express.json());

//Cors
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

//Public folder
app.use(express.static("public"));

//Routes
const UserRoutes = require("./routes/UserRoutes");
app.use("/users", UserRoutes);

app.listen(5000, (req, res)=> {
    console.log("server on");
});
