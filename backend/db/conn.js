const mongoose = require("mongoose");

async function main() {
    await mongoose.connect("mongodb://localhost:27017/getapet");
    console.log("conexão bem sucedida");
}

main().catch(error => console.log(error))

module.exports = mongoose;