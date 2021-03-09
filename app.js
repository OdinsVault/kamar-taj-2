const express = require("express");
const app = express();
const morgan = require("morgan");

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
app.use(express.urlencoded({extended: false}));
app.use(express.json());

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
app.use('/v1', require('./routes'));


// Handle unmatched routes
app.use((req, res) => {
  res.status(500).json({
    error: {
      message: 'Not found!',
    },
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server listening on port ${port}!`));
