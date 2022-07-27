const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/user/:id", (req, res) => {
  console.log("Hello");
});

app.listen(5001, () => {
  console.log("User Server running on port 5001");
});
