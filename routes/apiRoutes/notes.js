const router = require("express").Router();
                //const { validateNote, createNote } = require("../../lib/notes");
const { notes } = require("../../db/db.json");
const fs = require("fs");
const path = require("path");

// put a new note in the db.json file
function createNote(body, noteArray) {
    const note = body;
    if (body) {
    noteArray.push(note);
    }
    fs.writeFileSync(
      path.join(__dirname, "../data/notes.json"),
      JSON.stringify({ notes: noteArray }, null, 2)
    );
    return note
  };
  
// ensure both the title and text of each new note are strings
  function validateNote(note) {
    if (!note.title || typeof note.title !== "string") {
        return false;
    }
    if (!note.text || typeof note.text !== "string") {
        return false
    }
    return true
};

// route to GET the existing notes
router.get("/notes", (req, res) => {
  let results = notes;
  res.json(results);
});

// route to POST a new note
router.post("/notes", (req, res) => {
    // give each new note a unique identifier larger than the number of existing notes
    req.body.id = notes.length.toString();

    if (!validateNote(req.body)) {
        res.status(400).send("This note needs to be in string format, both title and text");
    } else {
        const note = createNote(req.body, notes);
        res.json(note);
    }
});

// route to delete a note
router.delete("/notes/:id", function (req, res) {
  let id = req.params.id;
  // remove the identified note by splicing
  if (notes[id].id == id) {
    notes.splice(id, 1);
  } else {
    res.status(400).send("Note ID does not exist");
  }
  // reformat IDs
  for (let i = 0; i < notes.length; i++) {
    notes[i].id = i.toString();
  }
  res.json(true);
});

// export the router
module.exports = router;