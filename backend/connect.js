const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://127.0.0.1:27017/MedApp/";

const client = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

client.connect((err, res) => {
  console.log("Connect success");
});

const db = client.db("MedApp");

module.exports = db;
