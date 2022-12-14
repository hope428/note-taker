const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const path = require("path");
const fs = require("fs");
const notes = require("./db/db.json");
const nanoid = require("nanoid");

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
  const newNote = { ...req.body, id: nanoid() };
  notes.push(newNote);
  fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
    err ? console.error(err) : console.log("success");
  });

  res.status(201).json('Note added');
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  notes.forEach((note, i) =>
    note.id === id ? notes.splice(i, 1) : console.log("not found")
  );

  fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
    err ? console.error(err) : console.log("note removed");
  });
  
  res.json('Note deleted');
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT);
