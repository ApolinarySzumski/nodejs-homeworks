// node modules
const path = require("path");

// npm modules
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// my modules
const router = require("./api/index");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(express.json());
app.use(cors());
app.use(morgan(formatsLogger));

app.use("/api", router);

// Enable to static deploy, it must be higher than errors handling
app.use(express.static(path.join(__dirname, "public")));

app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((error, _, res, __) => {
  res.status(500).json({ message: error.message });
});

const PORT = process.env.PORT || 3000;
const uriDb = process.env.DB_HOST;

// Funtion used to connection with database and running server
const connect = async () => {
  try {
    await mongoose.connect(uriDb, { dbName: "db-contacts" });
    app.listen(PORT, () =>
      console.log(`Server running. Use our API on port ${PORT}`),
    );
  } catch (error) {
    console.log(`Something went wrong, full error is: ${error}`);
    process.exit(1);
  }
};

// Funtion to inform developer about database answers
const registerListeners = () => {
  mongoose.connection.on("connected", () =>
    console.log("Database connection successful"),
  );
  mongoose.connection.on("disconnected", () =>
    console.log("Database connection is broken"),
  );
};

// Calling necessary funtions, order of calling is important
registerListeners();
connect();
