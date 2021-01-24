const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const port = 3000;
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: "http://localhost",
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "SIG_21",
  password: "joseco",
  port: 5432,
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
  console.log(req);
});

app.listen(port, () => {
  console.log(`runnig server! http://localhost:${port}/`);
});
