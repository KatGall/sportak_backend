import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

function ExerciseList() {
  const [exercises, setExercises] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editedExercise, setEditedExercise] = useState(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  async function loadExercises() {
    const response = await fetch(`${API_URL}/exercise/list`);
    const data = await response.json();
    setExercises(data.exerciseList || []);
  }

  function openCreateForm() {
    setEditedExercise(null);
    setName("");
    setNote("");
    setFormVisible(true);
  }

  function openUpdateForm(exercise) {
    setEditedExercise(exercise);
    setName(exercise.name);
    setNote(exercise.note || "");
    setFormVisible(true);
  }

  function closeForm() {
    setEditedExercise(null);
    setName("");
    setNote("");
    setFormVisible(false);
  }

  async function saveExercise(event) {
    event.preventDefault();

    const url = editedExercise
      ? `${API_URL}/exercise/update`
      : `${API_URL}/exercise/create`;

    const body = editedExercise
      ? { id: editedExercise.id, name, note }
      : { name, note };

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    closeForm();
    loadExercises();
  }

  async function deleteExercise(id) {
    await fetch(`${API_URL}/exercise/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    loadExercises();
  }

  useEffect(() => {
    loadExercises();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        {!formVisible && <h2>Exercises</h2>}

        {!formVisible && (
          <button className="header-action" onClick={openCreateForm}>
            Create exercise
          </button>
        )}
      </div>

      {formVisible && (
        <form className="form" onSubmit={saveExercise}>
          <button type="button" onClick={closeForm}>
            ← Exercise overview
          </button>

          <h3>{editedExercise ? "Update exercise" : "Create exercise"}</h3>

          <input
            placeholder="Exercise name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <textarea
            placeholder="Note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />

          <button type="submit">Save exercise</button>
        </form>
      )}

      {!formVisible && (
        <div className="item-list">
          {exercises.length === 0 && <p>There are no exercises yet.</p>}

          {exercises.map((exercise) => (
            <div className="item" key={exercise.id}>
              <strong>{exercise.name}</strong>

              {exercise.note && <div className="note">{exercise.note}</div>}

              <div className="item-actions">
                <button onClick={() => openUpdateForm(exercise)}>Edit</button>

                <button onClick={() => deleteExercise(exercise.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExerciseList;
