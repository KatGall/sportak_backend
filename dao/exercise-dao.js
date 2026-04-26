const path = require("path");
const crypto = require("crypto");
const { readJson, writeJson } = require("./file-storage");

const filePath = path.join(__dirname, "../data/exercises.json");

function list() {
  return readJson(filePath, []);
}

function create(exercise) {
  const exercises = list();

  const newExercise = {
    id: crypto.randomUUID(),
    name: exercise.name,
    note: exercise.note || "",
  };

  exercises.push(newExercise);
  writeJson(filePath, exercises);

  return newExercise;
}

function get(id) {
  return list().find((e) => e.id === id);
}

function update(id, data) {
  const exercises = list();
  const index = exercises.findIndex((e) => e.id === id);

  if (index === -1) return null;

  exercises[index] = {
    ...exercises[index],
    ...data,
    id,
  };

  writeJson(filePath, exercises);

  return exercises[index];
}

function remove(id) {
  const exercises = list();
  const filtered = exercises.filter((e) => e.id !== id);

  if (filtered.length === exercises.length) return false;

  writeJson(filePath, filtered);
  return true;
}

module.exports = {
  create,
  get,
  list,
  update,
  remove,
};
