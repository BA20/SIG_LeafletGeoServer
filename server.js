const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const cors = require("cors");

const { Pool, Client } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "SIG_21",
  password: "joseco",
  port: 56185,
});

pool.connect((err) => {
  if (err) throw err;
  console.log("Connected...");
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  app.use(cors());
  next();
});
app.post("/save", (req, res) => {
  const convertedData = req.body.data;
  console.log(req);
  res.send(res);
});

app.listen(3001, () => {
  console.log(`runnig server! http://localhost:3001/`);
});
