// do this to use express.js
const express = require('express');

// tell heroku we're using port 3001 instead of the default of 80
const PORT = process.env.PORT || 3001;

// instantiate a server
const app = express();

// link to json file where notes are stored
const { notes } = require('./Develop/db/db.json');





// method to filter JSON results by query headers
function filterByQuery(query, notesArray) {
    let filteredResults = notesArray;
    if (query.id) {
      filteredResults = filteredResults.filter(note => note.id === query.id);
    }
    return filteredResults;
  }
  

// Route to GET the notes
app.get('/api/notes', (req, res) => {
    let results = notes;
    if (req.query) {
        results = filterByQuery(req.query, results);
      }
    res.json(results);
  });
  


// make the server listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });