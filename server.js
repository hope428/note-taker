const express = require("express");
const app = express();
const PORT = 3001;
const path = require("path");
const fs = require("fs");
const notes = require("./db/db.json");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  let currentData;
  const newNote = req.body;

  fs.readFile("./db/db.json", (err, data) => {
    currentData = JSON.parse(data);
    currentData.push(newNote);

    fs.writeFile("./db/db.json", JSON.stringify(currentData), (err) => {
      err ? console.error(err) : console.log("success");
    });
  });

  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT);
