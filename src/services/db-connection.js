const mongoose = require("mongoose");
const { DB_USER, DB_PASSWORD } = require("../../configurations.js");

const DB_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.aq1acry.mongodb.net/mini-game?retryWrites=true&w=majority`;
// const DB_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.aq1acry.mongodb.net/localtest?retryWrites=true&w=majority`;

function connectToDB() {
  mongoose.connect(DB_URI, { useNewUrlParser: true });
  mongoose.connection.on("connected", function () {
    console.log("Mongoose default connection open.");
  });
  mongoose.connection.on("error", function (err) {
    console.log("Mongoose default connection error: " + err);
  });
  mongoose.connection.on("disconnected", function () {
    console.log("Mongoose default connection disconnected");
  });
}

module.exports = connectToDB;
// export default connectToDB;
