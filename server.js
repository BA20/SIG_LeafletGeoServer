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

function geom(long, lat) {
  pool.query(
    `SELECT ST_SetSRID( ST_Point( ${long}, ${lat}), 4326)`,
    (error, results) => {
      if (error) {
        throw error;
      }
      console.log(results);
    }
  );
}

app.post("/savePt", (req, res) => {
  console.log("savePt:");
  var datai = req.body.length;
  console.log(req.body);
  //  for (i = 0; i < datai; i++) {
  var long = req.body[0][0];
  console.log(long);
  var lat = req.body[0][1];
  console.log(lat);

  pool.query(
    `INSERT INTO public.occurrences_point(id,name,type,date,point,image) VALUES (,'point', 1, '2021-01-01 00:00:00', ST_SetSRID(ST_MakePoint(${req.body[0]}), 4326), '10926638')`,
    [long, lat],
    (error, results) => {
      if (error) {
        throw error;
      }

      console.log(results);
    }
  );
  //}
});
app.post("/savePl", (req, res) => {
  console.log("savePl:");
  var geoJson = JSON.stringify(req.body);
  console.log(geoJson);
});
app.post("/saveLs", (req, res) => {
  console.log("saveLs:");

  var geoJson = JSON.stringify(req.body);
  console.log(geoJson);
});

app.listen(port, () => {
  console.log(`runnig server! http://localhost:${port}/`);
});
