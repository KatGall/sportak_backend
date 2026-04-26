const express = require("express");
const cors = require("cors");

const workoutDao = require("./dao/workout-dao");
const exerciseDao = require("./dao/exercise-dao");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    app: "SPORŤÁK backend",
    status: "running",
  });
});

app.post("/exercise/create", (req, res) => {
  const dtoIn = req.body;

  if (!dtoIn.name) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "name is required",
    });
  }

  const exercise = exerciseDao.create({
    name: dtoIn.name,
    note: dtoIn.note,
  });

  res.json(exercise);
});
app.get("/exercise/list", (req, res) => {
  const exercises = exerciseDao.list();

  res.json({
    exerciseList: exercises,
  });
});
app.get("/exercise/get", (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "id is required",
    });
  }

  const exercise = exerciseDao.get(id);

  if (!exercise) {
    return res.status(404).json({
      code: "exerciseDoesNotExist",
      message: "Exercise does not exist",
    });
  }

  res.json(exercise);
});
app.post("/exercise/update", (req, res) => {
  const dtoIn = req.body;

  if (!dtoIn.id) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "id is required",
    });
  }

  const exercise = exerciseDao.update(dtoIn.id, {
    name: dtoIn.name,
    note: dtoIn.note,
  });

  if (!exercise) {
    return res.status(404).json({
      code: "exerciseDoesNotExist",
      message: "Exercise does not exist",
    });
  }

  res.json(exercise);
});
app.post("/exercise/delete", (req, res) => {
  const dtoIn = req.body;

  if (!dtoIn.id) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "id is required",
    });
  }

  const deleted = exerciseDao.remove(dtoIn.id);

  if (!deleted) {
    return res.status(404).json({
      code: "exerciseDoesNotExist",
      message: "Exercise does not exist",
    });
  }

  workoutDao.removeExerciseFromAllWorkouts(dtoIn.id);

  res.json({});
});
app.post("/workout/create", (req, res) => {
  const dtoIn = req.body;

  if (!dtoIn.name) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "name is required",
    });
  }

  const workout = workoutDao.create({
    name: dtoIn.name,
    note: dtoIn.note,
    exercises: dtoIn.exercises || [],
  });

  res.json(workout);
});
app.get("/workout/list", (req, res) => {
  const workouts = workoutDao.list();

  res.json({
    workoutList: workouts,
  });
});
app.get("/workout/get", (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "id is required",
    });
  }

  const workout = workoutDao.get(id);

  if (!workout) {
    return res.status(404).json({
      code: "workoutDoesNotExist",
      message: "Workout does not exist",
    });
  }

  res.json(workout);
});
app.post("/workout/update", (req, res) => {
  const dtoIn = req.body;

  if (!dtoIn.id) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "id is required",
    });
  }

  const workout = workoutDao.update(dtoIn.id, {
    name: dtoIn.name,
    note: dtoIn.note,
    exercises: dtoIn.exercises,
  });

  if (!workout) {
    return res.status(404).json({
      code: "workoutDoesNotExist",
      message: "Workout does not exist",
    });
  }

  res.json(workout);
});
app.post("/workout/delete", (req, res) => {
  const dtoIn = req.body;

  if (!dtoIn.id) {
    return res.status(400).json({
      code: "dtoInIsNotValid",
      message: "id is required",
    });
  }

  const deleted = workoutDao.remove(dtoIn.id);

  if (!deleted) {
    return res.status(404).json({
      code: "workoutDoesNotExist",
      message: "Workout does not exist",
    });
  }

  res.json({});
});
app.listen(port, () => {
  console.log(`SPORŤÁK backend běží na http://localhost:${port}`);
});
