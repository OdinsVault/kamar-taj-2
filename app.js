const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://root:" +
    process.env.MONGO_ATLAS_PW +
    "@simplycluster.jqldp.mongodb.net/simply-mongodb?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORSE Error prevention
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    return res.status(200).json({});
  }
  next();
});

app.get("/", (req, res) => {
  console.log("Welcome to platform...");
  res.json({ message: "Welcome to platform..." });
});

//Routes>>>>>>>>>>>>>>>>
require("./routes/practiceQuestion.routes")(app);
require("./routes/competeQuestion.routes")(app);
require("./routes/user.routes")(app);
require("./routes/leaderboard.routes")(app);
require("./routes/answer.routes")(app);
require("./routes/admin.routes")(app);

app.use((req, res, next) => {
  const error = new Error("Not Found!");
  next(error);
});

app.use((error, req, res, next) => {
  res.status(500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
