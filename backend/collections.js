const db = require("./connect");

const doctors = db.collection("Doctors");
const patients = db.collection("Patients");
const admins = db.collection("Admins");

module.exports = {
  doctors,
  admins,
  patients,
};
