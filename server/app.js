const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const mongoose = require("mongoose")
mongoose
.connect("mongodb://127.0.0.1:27017/cohort-tools-api")
.then(x => console.log(`Connected to Database: "${x.connections[0].name}"`))
.catch(err => console.error("Error connecting to MongoDB", err));

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
const cohorts = require("./data/cohorts.json"); 
const students = require("./data/students.json");



// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();
const cors = require('cors');

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin:['http://localhost:5005']
}))

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});



app.get("/api/cohorts", (request, response) => {
  response.json(cohorts); // Send the cohorts JSON data
});

app.get("/api/students",(request, response) => {
  console.log (request);
  response.json(students)
});



// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});