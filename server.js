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
  console.log(datai + " Pontos");
  for (i = 0; i < datai; i++) {
    var long = req.body[i][0].coordinates[0];

    var lat = req.body[i][0].coordinates[1];

    var datatype = req.body[i][0].type;

    pool.query(
      `SELECT ST_GeomFromEWKT('SRID=4326;POINT(${long} ${lat})');`,
      (error, results) => {
        if (error) {
          throw error;
        }

        var geom = results.rows[0].st_geomfromewkt;
        pool.query(
          `INSERT INTO public.point(type,geometry) VALUES ('${datatype}','${geom}')`,
          (err, rese) => {
            if (err) {
              throw err;
            }

            console.log("Novo ponto");
          }
        );
      }
    );
  }
});
app.post("/savePl", (req, res) => {
  console.log("savePl:");
  var datai = req.body.length;
  console.log(datai);

  console.log(req.body);
  //  console.log(req.body);

  for (i = 0; i < datai; i++) {
    console.log(i);
    console.log("-----------");
    var datatype = req.body[i].type;
    console.log(datatype);
    var dataNCoordinates = req.body[i].coordinates[0].length;
    console.log(dataNCoordinates);
    var geomClong = [];
    var geomClat = [];
    for (z = 0; z < dataNCoordinates; z++) {
      geomClong.push(req.body[i].coordinates[0][z][0]);

      geomClat.push(req.body[i].coordinates[0][z][1]);
    }
    var queryG = "";
    for (w = 0; w < dataNCoordinates; w++) {
      if (w < dataNCoordinates - 1) {
        queryG += `${geomClong[w]} ${geomClat[w]},`;
      } else {
        queryG += `${geomClong[w]} ${geomClat[w]}`;
      }
    }

    pool.query(
      `SELECT ST_GeomFromEWKT('SRID=4326;POLYGON((${queryG}))');`,
      (error, results) => {
        if (error) {
          throw error;
        }
        var geomGeo = results.rows[0].st_geomfromewkt;

        pool.query(
          `INSERT INTO public.poly(type, geometry) VALUES ('${datatype}','${geomGeo}')`,
          (err, rese) => {
            if (err) {
              throw err;
            }

            console.log("Novo Poly");
          }
        );
      }
    );
  }
});
app.post("/saveLs", (req, res) => {
  console.log("saveLs:");

  var datai = req.body.length;
  console.log(datai);

  console.log(req.body);
  //  console.log(req.body);
  for (i = 0; i < datai; i++) {
    console.log(i);
    console.log("-----------");
    var datatype = req.body[i].type;
    console.log(datatype);
    var geomC1long = req.body[i].coordinates[0][0];
    var geomC1lat = req.body[i].coordinates[0][1];
    var geomC2long = req.body[i].coordinates[1][0];
    var geomC2lat = req.body[i].coordinates[1][1];

    pool.query(
      `SELECT ST_GeomFromEWKT('SRID=4326;LINESTRING(${geomC1long} ${geomC1lat},${geomC2long} ${geomC2lat}) ');`,
      (error, results) => {
        if (error) {
          throw error;
        }
        var geomGeo = results.rows[0].st_geomfromewkt;
        console.log(geomGeo);
        pool.query(
          `INSERT INTO public.linhas(type, geometry) VALUES ('${datatype}','${geomGeo}')`,
          (err, rese) => {
            if (err) {
              throw err;
            }

            console.log("Novo LINHA");
          }
        );
      }
    );
  }
});

app.listen(port, () => {
  console.log(`runnig server! http://localhost:${port}/`);
});
