// do this to use express.js
const express = require('express');

// allows writing to the db.json file
const fs = require('fs');
const path = require('path');

// tell heroku we're using port 3001 instead of the default of 80
const PORT = process.env.PORT || 3001;

// instantiate a server
const app = express();

// use the followint middleware functions any time you need to accept POST data
// middleware to parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// middleware to parse incoming JSON data
app.use(express.json());


// link to json file where notes are stored
const { notes } = require('./Develop/db/db.json');

// tried to use the below commented out code to access other routes in the prefabricated index.js file, but
// got an error relating to an undefined 'window' variable
// // add to be able to use all the routes in the route files
// const otherRoutes = require('./Develop/public/assets/js/index.js');

// // use the other routes
// app.use('/api', otherRoutes);





// method to filter JSON results by query headers
function filterByQuery(query, notesArray) {
    let filteredResults = notesArray;
    if (query.id) {
      filteredResults = filteredResults.filter(note => note.id === query.id);
    }
    return filteredResults;
  }

// function used to find a note by it's ID
function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
}

// function to create a new note
function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './Develop/db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
      );
    return note;
  }

// function to validate new note data before creating a new note
function validateNote(note) {
    if (!note.title || typeof note.title !== 'string') {
      return false;
    }
    if (!note.text || typeof note.text !== 'string') {
        return false;
      }
    return true;
  }
  
  

// Route to GET the notes
app.get('/api/notes', (req, res) => {
    let results = notes;
    if (req.query) {
        results = filterByQuery(req.query, results);
      }
    res.json(results);
  });

// Route to GET a specific note by ID
// this "param route" must come after the generic GET route above
app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if (result) {
        res.json(result);
      } else {
        res.send(404);
      }
})

// Route to POST new notes
app.post('/api/notes', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = notes.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateNote(req.body)) {
        res.status(400).send('The note is not properly formatted.');
    } else {
        const note = createNewNote(req.body, notes);
        res.json(note);
    }

  });
  
  


// make the server listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });