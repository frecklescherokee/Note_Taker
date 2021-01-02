// do this to use express.js
const express = require('express');

// connect to js files with route code
const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");

// tell heroku we're using port 3001 instead of the default of 80
const PORT = process.env.PORT || 3001;

// instantiate a server
const app = express();

// use the followint middleware functions any time you need to accept POST data
// middleware to parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// middleware to parse incoming JSON data
app.use(express.json());
// this should make it where the HTML page can always access the associated CSS file for styling
// ues every time express will be dealing with JSON data and HTML front end
app.use(express.static('public'));
// routes for api
app.use("/api", apiRoutes);
// routes for html
app.use('/', htmlRoutes);






// make the server listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });

