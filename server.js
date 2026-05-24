const express = require("express");
const cors = require("cors");

const workoutDao = require("./dao/workout-dao");
const exerciseDao = require("./dao/exercise-dao");

const {
  createExerciseSchema,
  updateExerciseSchema,
  idSchema,
} = require("./validation/exercise-validation");

const {
  createWorkoutSchema,
  updateWorkoutSchema,
} = require("./validation/workout-validation");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

function validate(schema, dtoIn, res) {
  const validationResult = schema.validate(dtoIn);

  if (validationResult.error) {
    res.status(400).json({
      code: "dtoInIsNotValid",
      message: validationResult.error.message,
    });
    return false;
  }

  return true;
}

app.get("/", (req, res) => {
  res.json({
    app: "SPORŤÁK backend",
    status: "running",
  });
});

// EXERCISE

app.post("/exercise/create", (req, res) => {
  const dtoIn = req.body;

  if (!validate(createExerciseSchema, dtoIn, res)) return;

  const exercise = exerciseDao.create({
    name: dtoIn.name,
    note: dtoIn.note,
  });

  res.json(exercise);
});

app.get("/exercise/list", (req, res) => {
  res.json({
    exerciseList: exerciseDao.list(),
  });
});

app.get("/exercise/get", (req, res) => {
  const dtoIn = req.query;

  if (!validate(idSchema, dtoIn, res)) return;

  const exercise = exerciseDao.get(dtoIn.id);

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

  if (!validate(updateExerciseSchema, dtoIn, res)) return;

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

  if (!validate(idSchema, dtoIn, res)) return;

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

// WORKOUT

app.post("/workout/create", (req, res) => {
  const dtoIn = req.body;

  if (!validate(createWorkoutSchema, dtoIn, res)) return;

  const workout = workoutDao.create({
    name: dtoIn.name,
    note: dtoIn.note,
    exercises: dtoIn.exercises || [],
  });

  res.json(workout);
});

app.get("/workout/list", (req, res) => {
  res.json({
    workoutList: workoutDao.list(),
  });
});

app.get("/workout/get", (req, res) => {
  const dtoIn = req.query;

  if (!validate(idSchema, dtoIn, res)) return;

  const workout = workoutDao.get(dtoIn.id);

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

  if (!validate(updateWorkoutSchema, dtoIn, res)) return;

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

  if (!validate(idSchema, dtoIn, res)) return;

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
