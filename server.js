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
    // const data = currentData.map(item => {
    //   return {...item, id: }
    // })

    fs.writeFile("./db/db.json", JSON.stringify(currentData), (err) => {
      err ? console.error(err) : console.log("success");
    });
  });

  res.redirect(path.join(__dirname, "/public/notes.html"));
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id
  for(let i = 0; i < notes.length; i++){
    if(notes[i].id === id){
      notes.splice(i, 1)
    }
  }

  fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
    err ? console.error(err) : console.log("note removed");
  })
  res.redirect(path.join(__dirname, "/public/notes.html"));
})

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT);
