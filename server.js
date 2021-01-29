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

app.post("/savePt", (req, res) => {
  console.log("savePt:");

  pool.query(`DELETE FROM public.point;`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      var datai = req.body.length;
      console.log(datai + " Pontos");
      for (i = 0; i < datai; i++) {
        var long = req.body[i][0].coordinates[0];

        var lat = req.body[i][0].coordinates[1];

        var datatype = req.body[i][0].type;
        var coordinates = req.body[i].coordinates;
        pool.query(
          `SELECT ST_GeomFromEWKT('SRID=4326;POINT(${long} ${lat})');`,
          (error, results) => {
            if (error) {
              throw error;
            }

            var geomGeo = results.rows[0].st_geomfromewkt;
            pool.query(
              `INSERT INTO public.point(type,geometry,coordinates) VALUES ('${datatype}','${geomGeo}','${coordinates}')`,
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
    }
  });
});

app.post("/savePl", (req, res) => {
  console.log("savePl:");

  pool.query(`DELETE FROM public.poly`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
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
        var coordinates = req.body[i].coordinates;
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
              `INSERT INTO public.poly(type, geometry,coordinates) VALUES ('${datatype}','${geomGeo}','${coordinates}')`,
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
    }
  });
});
app.post("/saveLs", (req, res) => {
  console.log("saveLs:");

  pool.query(`DELETE FROM public.linhas `, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      var datai = req.body.length;
      console.log(datai);

      console.log(req.body);
      //  console.log(req.body);

      for (i = 0; i < datai; i++) {
        console.log(i);
        console.log("-----------");
        var datatype = req.body[i].type;
        console.log(datatype);
        var coordinates = req.body[i].coordinates;
        console.log(coordinates);
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
              `INSERT INTO public.linhas(type, geometry,coordinates) VALUES ('${datatype}','${geomGeo}','${coordinates}')`,
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
    }
  });
});
//-------------------------------------------------

app.get("/getpontos", (req, res) => {
  pool.query("SELECT id,coordinates,type FROM public.point", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
    }
  });
});
app.get("/getls", (req, res) => {
  pool.query("SELECT id,coordinates,type FROM public.linhas", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
    }
  });
});
app.get("/getpl", (req, res) => {
  pool.query("SELECT id,coordinates,type FROM public.poly", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result.rows);
    }
  });
});
app.post("/deletePto", (req, res) => {
  const id = req.body.id;

  pool.query(`DELETE FROM public.point WHERE id=${id};`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Ponto de id: ${id} foi eliminado!`);
    }
  });
});
app.post("/deleteLs", (req, res) => {
  const id = req.body.id;

  pool.query(`DELETE FROM public.linhas WHERE id=${id};`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Linha de id: ${id} foi eliminado!`);
    }
  });
});
app.post("/deletePoly", (req, res) => {
  const id = req.body.id;

  pool.query(`DELETE FROM public.poly WHERE id=${id};`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Poly de id: ${id} foi eliminado!`);
    }
  });
});

app.post("/saveGeojson", (req, res) => {
  var json = JSON.stringify(req.body.json);
  console.log(json);

  pool.query(`DELETE FROM public.leaflet_layer`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      pool.query(
        `INSERT INTO public.leaflet_layer(
	json)
	VALUES ('${json}');`,
        (error, results) => {
          if (error) {
            throw error;
          } else {
            console.log("----------sl");
            console.log(results.rows);
          }
        }
      );
    }
  });
});
app.get("/getlayer", (req, res) => {
  pool.query("SELECT CONCAT(json)	FROM public.leaflet_layer;", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("......");
      res.json(result);
      console.log(result);
    }
  });
});

app.listen(port, () => {
  console.log(`runnig server! http://localhost:${port}/`);
});
