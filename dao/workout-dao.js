const path = require("path");
const crypto = require("crypto");
const { readJson, writeJson } = require("./file-storage");

const filePath = path.join(__dirname, "../data/workouts.json");

function list() {
  return readJson(filePath, []);
}

function create(workout) {
  const workouts = list();

  const newWorkout = {
    id: crypto.randomUUID(),
    name: workout.name,
    note: workout.note || "",
    exercises: workout.exercises || [],
  };

  workouts.push(newWorkout);
  writeJson(filePath, workouts);

  return newWorkout;
}

function get(id) {
  return list().find((w) => w.id === id);
}

function update(id, data) {
  const workouts = list();
  const index = workouts.findIndex((w) => w.id === id);

  if (index === -1) return null;

  workouts[index] = {
    ...workouts[index],
    ...data,
    id,
  };

  writeJson(filePath, workouts);

  return workouts[index];
}

function remove(id) {
  const workouts = list();
  const filtered = workouts.filter((w) => w.id !== id);

  if (filtered.length === workouts.length) return false;

  writeJson(filePath, filtered);
  return true;
}

function removeExerciseFromAllWorkouts(exerciseId) {
  const workouts = list();

  const updatedWorkouts = workouts.map((workout) => ({
    ...workout,
    exercises: (workout.exercises || []).filter(
      (exercise) => exercise.exerciseId !== exerciseId,
    ),
  }));

  writeJson(filePath, updatedWorkouts);
}

module.exports = {
  create,
  get,
  list,
  update,
  remove,
  removeExerciseFromAllWorkouts,
};
