// libs
const express = require("express");
const path = require("path");
// create server
const app = express();
app.disable("x-powered-by");

const PORT = 5000;
const BUILD_FOLDER = "dist";

app.use(express.static(path.join(__dirname, BUILD_FOLDER)));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, BUILD_FOLDER, "index.html"));
});

console.log("Start on port " + PORT);
app.listen(PORT);
