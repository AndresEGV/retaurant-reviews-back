require("dotenv").config();
const morgan = require("morgan");
const express = require("express");
const path = require("path");
const cors = require("cors");
const routes = require("./routes/restaurant");
const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(routes);

const port = process.env.PORT || 3001;
app.listen(`${port}`, console.log("Server up"));
