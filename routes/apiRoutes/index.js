// use in place of 'app', which is only used on server.js
const router = require("express").Router();

// use the routes in the notes.js file
const notesRoutes = require("./notes.js")
router.use(notesRoutes);

// export the router
module.exports = router;