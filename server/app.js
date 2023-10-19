const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const mongoose = require("mongoose")
mongoose
.connect("mongodb://127.0.0.1:27017/cohorts-tools-api")
.then(x => console.log(`Connected to Database: "${x.connections[0].name}"`))
.catch(err => console.error("Error connecting to MongoDB", err));

const Student = require("./models/Student.model");
const Cohort = require("./models/Cohort.model");

const cohorts = require("./data/cohorts.json"); 
const students = require("./data/students.json");
const bodyParser = require('body-parser');


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
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// Cohort
app.get("/api/cohorts", async(request, response) => {
  try {
    const newCohort= await Cohort.find(request.body)
    response.status(201).json({cohort: newCohort})
  } catch (error) {
    response.status(500).json({error})
  }
});

app.post("/api/cohorts", async(request, response) =>{
  try {
    const newCohort = await Cohort.create(request.body)
    response.status(201).json({cohort: newCohort})
  } catch (error) {
    response.status (500).json({error})   
  }
})

app.get('/api/cohorts/:cohortId', async (request, response) => {
  const {cohortId} = request.params;
  if (mongoose.isValidObjectId(cohortId)) {
  try {
      const oneCohort = await Cohort.findById(cohortId)
      if (oneCohort) {      
      console.log(request.body);
      response.status(201).json({cohort: oneCohort})
      } else {
          response.status(404).json({message: 'cohort not found'})
      } 
  } catch (error) {
      console.log(error)
      response.status(500).json({error})
  }
  } else {
  response.status(500).json({message: 'id seems wrong'})
  }
});


app.put('/api/cohorts/:cohortId', async (request, response) => {
  const {cohortId} = request.params;
  try {
      const updateCohort = await Cohort.findByIdAndUpdate(cohortId, request.body.cohort,{new:true})
      console.log(request.body)
      response.status(201).json({cohort: updateCohort})
  } catch (error) {
      console.log(error)
      response.status(500).json({error})
    }
});

app.delete('/api/cohorts/:cohortId', async (request, response) => {
  const {cohortId} = request.params;
  try {
      await Cohort.findByIdAndDelete(cohortId)
      response.status(204).json({message: "Cohort deleted"})
  } catch (error) {
      console.log(error)
      response.status(500).json({error})
    }
});

// Students
app.get("/api/students", async(request, response) => {
  try {
    const newStudent= await Student.find(request.body)
    response.status(201).json({student: newStudent})
  } catch (error) {
    response.status(500).json({error})
    }
});

app.post("/api/students", async(request, response) => {
  try {
    const newStudent = await Student.create(request.body)
    response.status(201).json({student: newStudent})
  } catch (error) {
    response.status (500).json({error})   
  }
});

app.get('/api/students/cohort/:cohortId', async (request, response) => {
  const {cohortId} = request.params;
  console.log (cohortId)
  if (mongoose.isValidObjectId(cohortId)) {
  try {
      const cohortStudents = await Cohort.findById(cohortId)
      console.log(cohortStudents)
      if (cohortStudents) {      
      console.log(request.body);
      response.status(201).json({cohort: cohortStudents})
      } else {
          response.status(404).json({message: 'cohort not found'})
        } 
  } catch (error) {
      console.log(error)
      response.status(500).json({error})
  }
  } else {
  response.status(500).json({message: 'id seems wrong'})
    }
});

app.get('/api/students/:studentId', async (request, response) => {
  const {studentId} = request.params;
  if (mongoose.isValidObjectId(studentId)) {
  try {
      const oneStudent = await Student.findById(studentId)
      if (oneStudent) {      
      console.log(request.body);
      response.status(201).json({student: oneStudent})
      } else {
          response.status(404).json({message: 'student not found'})
      } 
  } catch (error) {
      console.log(error)
      response.status(500).json({error})
    }
  } else {
  response.status(500).json({message: 'id seems wrong'})
  }
});

app.put('/api/students/:studentId', async (request, response) => {
  const {studentId} = request.params;
  console.log(studentId)
  try {
      const updateStudent = await Student.findByIdAndUpdate(studentId, request.body.student,{new:true})
      console.log(request.body)
      response.status(201).json({student: updateStudent})
  } catch (error) {
      console.log(error)
      response.status(500).json({error})
  }
});


app.delete('/api/students/:studentId', async (request, response) => {
  const {studentId} = request.params;
  
  try {
      await Student.findByIdAndDelete(studentId)
      response.status(204).json({message: "Student deleted"})

  } catch (error) {
      console.log(error)
      response.status(500).json({error})
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});