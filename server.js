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
});
app.post("/saveLs", (req, res) => {
  console.log("saveLs:");

  var datai = req.body.length;
  console.log(datai);
  console.log(req.body[0]);
  console.log(req.body[1]);
  //  console.log(req.body);
  for (i = 0; i < datai; i++) {
    console.log(i);
    // console.log(req.body);
    var coords1 = req.body[i].coordinates[0];
    console.log(coords1);
    var coords2 = req.body[i].coordinates[1];
    console.log(coords2);
    var datatype = req.body[i].type;
    console.log(datatype);
   
    
for(i=0;i<2;i++){




  
   pool.query(
    `SELECT ST_GeomFromEWKT('SRID=4326;POINT(${long} ${lat})');`,
    (error, results) => {
      if (error) {
        throw error;
      }
      //var geom;
      //  for (i = 0; results.rows.length; i++) {
      console.log(results.rows); } //[i].st_geomfromewkt);
  //   geom.push(results.rows[i].st_geomfromewkt);
  // }
    
    );
  }
  /*pool.query(
          `INSERT INTO public.linhas(type,geometry) VALUES ('${datatype}','${geom}')`,
          (err, rese) => {
            if (err) {
              throw err;
            }
            console.log(i);
            console.log(rese);
          }
        );*/
  // }

});

app.listen(port, () => {
  console.log(`runnig server! http://localhost:${port}/`);
});
