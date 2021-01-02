// makes working with directory paths more predictable
const path = require("path");
// use in place of 'app', which is only used on server.js
const router = require("express").Router();

// set the url for the main page
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"))
})

// set the route for the page to see and interact with the notes
router.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/../../public/notes.html"))
})

// export the router
module.exports = router