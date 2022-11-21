const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require('./config/corsOptions');
// Cross Origin Resource Sharing -
app.use(cors(corsOptions));
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
// require("dotenv").config();
//Error handling
const ErrorHandler = require("./middlewares/error");

app.use(express.json());
app.use(cookieParser());


app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload());

// //config db
// dotenv.config({
//   path: "backend/.env",
// });

// config production
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "backend/.env",
  });
}

//Route imports
const companyinfo = require("./routes/CompanyInfoRoute");
const appointment = require("./routes/AppointmentRoute");
const service = require("./routes/ServiceRoute");
const user = require("./routes/UserRoute");
const banner = require("./routes/BannerRoute");
const quote = require("./routes/QuotationRoute");

//Routes middlewares
app.use("/api/v2", companyinfo);
app.use("/api/v2", appointment);
app.use("/api/v2", service);
app.use("/api/v2", user);
app.use("/api/v2", banner);
app.use("/api/v2", quote);

//Deploying
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

//It's for error handling
app.use(ErrorHandler);

module.exports = app;
