const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// create a connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "jimhalpert",
  database: "languages",
});

// connect to the database
db.connect((err) => {
  if (err) throw err;
  console.log("connected to languages");
});

// get all the code blocks
app.get("/:language/all", (req, res) => {
  let sql = `SELECT * FROM ${req.params.language}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send(`${req.params.language} table not found`);
    } else {
      res.send(result);
    }
  });
});

// get the code block with the id passed in
app.get("/:language/:id", (req, res) => {
  let sql = `SELECT body FROM ${req.params.language} WHERE id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(400)
        .send(
          `${req.params.language} table or element with id ${req.params.id} not found`
        );
    } else {
      res.send(result);
    }
  });
});

// get the number of code blocks available
app.get("/:language", (req, res) => {
  let sql = `SELECT COUNT(id) AS count FROM ${req.params.language}`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res
        .status(400)
        .send(
          `${req.params.name} table or category ${req.params.category} not found`
        );
    } else {
      res.send(result);
    }
  });
});

app.listen(3001, () => {
  console.log("Languages Server running on port 3001");
});
