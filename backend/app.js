const express = require("express");
const db = require("./connect");
const { doctors, patients, admins } = require("./collections");
const { ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const checkAuth = require("./middleware/check-auth.middleware");
const signup = require("./middleware/signup.middleware");
const login = require("./middleware/login.middleware");
app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

//////////////////////////AUTHENTICATION///////////////////////////////////////
app.post(
  "/api/users/doctors",
  signup((req, callback) => {
    const doc = {
      login: req.body.login,
      password: req.body.password,
      name: req.body.name,
      lastname: req.body.lastname,
    };
    doctors.insertOne(doc, callback);
  })
);
app.post(
  "/api/users/patients",
  signup((req, callback) => {
    const doc = {
      login: req.body.login,
      password: req.body.password,
      name: req.body.name,
      lastname: req.body.lastname,
    };
    patients.insertOne(doc, callback);
  })
);
app.post(
  "/api/users/admins",
  signup((req, callback) => {
    const doc = {
      login: req.body.login,
      password: req.body.password,
      name: req.body.name,
      lastname: req.body.lastname,
    };
    admins.insertOne(doc, callback);
  })
);
//////////////////////////////////Logowanie

app.post("/api/users/admins/login", login(admins));
app.post("/api/users/patients/login", login(patients));
app.post("/api/users/doctors/login", login(doctors));
///////////////////////////////////Doctors//////////////////////////////
app.post("/api/doctors", checkAuth("doctorsPaswword"), (req, res, next) => {
  const doc = {
    login: req.body.login,
    password: req.body.password,
    name: req.body.name,
    lastname: req.body.lastname,
    city: req.body.city,
    specjalizations: req.body.specjalizations,
  };
  doctors.insertOne(doc, (err, docs) => {
    if (err) {
      throw new Error("No file");
    }
    res.status(201).json();
  });
});

app.get("/api/doctors", async (req, res, next) => {
  doctors.find().toArray((err, result) => {
    if (err) {
      throw new Error("No file");
    }
    res.status(200).json({ doctors: result });
  });
});

app.get("/api/doctors/:id", async (req, res, next) => {
  doctors.findOne({ _id: ObjectId(req.params.id) }).then((doctor) => {
    if (doctor) {
      res.status(200).json(doctor);
    } else {
      res.status(404).json({ message: "Post not Found" });
    }
  });
});

app.put("/api/doctors/:id", (req, res, next) => {
  doctors
    .updateOne(
      { _id: ObjectId(req.params.id) },
      {
        $set: {
          login: req.body.login,
          password: req.body.password,
          name: req.body.name,
          lastname: req.body.lastname,
          city: req.body.city,
          specjalizations: req.body.specjalizations,
          visits: req.body.visits,
        },
      }
    )
    .then(() => {
      res.status(200).json();
    });
});

app.delete(
  "/api/doctors/:id",
  checkAuth("doctorsPaswword"),
  (req, res, next) => {
    doctors.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
      res.status(200).json({doctors: result,});
    });
  }
);
////////////////////////Patients/////////////////
app.post("/api/patients", checkAuth("patientsPaswword"), (req, res, next) => {
  const doc = {
    login: req.body.login,
    password: req.body.password,
    name: req.body.name,
    lastname: req.body.lastname,
    visit: req.body.visits,
  };
  patients.insertOne(doc, (err, docs) => {
    if (err) {
      throw new Error("No file");
    }
    res.status(201).json();
  });
});

app.get("/api/patients", async (req, res, next) => {
    patients.find().toArray((err, result) => {
      if (err) {
        throw new Error("No file");
      }
      res.status(200).json({ patients: result });
    });
  }
);

app.get("/api/patients/:id", async (req, res, next) => {
  patients.findOne({ _id: ObjectId(req.params.id) }).then((patient) => {
    if (patient) {
      res.status(200).json(patient);
    } else {
      res.status(404).json({ message: "patients not Found" });
    }
  });
});

app.put("/api/patients/:id", (req, res, next) => {
  patients
    .updateOne(
      { _id: ObjectId(req.params.id) },
      {
        $set: {
          login: req.body.login,
          password: req.body.password,
          name: req.body.name,
          lastname: req.body.lastname,
          visits: req.body.visits,
        },
      }
    )
    .then(() => {
      res.status(200).json();
    });
});

app.delete(
  "/api/patients/:id",
  checkAuth("patientsPaswword"),
  (req, res, next) => {
    patients.deleteOne({ _id: ObjectId(req.params.id) }).then(() => {
      res.status(200).json({patients: result,});
    });
  }
);
module.exports = app;
