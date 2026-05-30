import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);

  const [formVisible, setFormVisible] = useState(false);
  const [editedWorkout, setEditedWorkout] = useState(null);

  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [workoutExercises, setWorkoutExercises] = useState([]);

  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [sets, setSets] = useState("");
  const [repetitions, setRepetitions] = useState("");

  async function loadWorkouts() {
    const response = await fetch(`${API_URL}/workout/list`);
    const data = await response.json();
    setWorkouts(data.workoutList || []);
  }

  async function loadExercises() {
    const response = await fetch(`${API_URL}/exercise/list`);
    const data = await response.json();
    setExercises(data.exerciseList || []);
  }

  function openCreateForm() {
    setEditedWorkout(null);
    setName("");
    setNote("");
    setWorkoutExercises([]);
    setSelectedExerciseId("");
    setSets("");
    setRepetitions("");
    setFormVisible(true);
  }

  function openUpdateForm(workout) {
    setEditedWorkout(workout);
    setName(workout.name);
    setNote(workout.note || "");
    setWorkoutExercises(workout.exercises || []);
    setSelectedExerciseId("");
    setSets("");
    setRepetitions("");
    setFormVisible(true);
  }

  function closeForm() {
    setEditedWorkout(null);
    setName("");
    setNote("");
    setWorkoutExercises([]);
    setSelectedExerciseId("");
    setSets("");
    setRepetitions("");
    setFormVisible(false);
  }

  function addExerciseToWorkout() {
    if (!selectedExerciseId) return;

    setWorkoutExercises([
      ...workoutExercises,
      {
        exerciseId: selectedExerciseId,
        sets: Number(sets),
        repetitions: Number(repetitions),
      },
    ]);

    setSelectedExerciseId("");
    setSets("");
    setRepetitions("");
  }

  function removeExerciseFromWorkout(indexToRemove) {
    setWorkoutExercises(
      workoutExercises.filter((_, index) => index !== indexToRemove),
    );
  }

  function getExerciseName(exerciseId) {
    const exercise = exercises.find((item) => item.id === exerciseId);
    return exercise ? exercise.name : "Unknown exercise";
  }

  async function saveWorkout(event) {
    event.preventDefault();

    const url = editedWorkout
      ? `${API_URL}/workout/update`
      : `${API_URL}/workout/create`;

    const body = editedWorkout
      ? {
          id: editedWorkout.id,
          name,
          note,
          exercises: workoutExercises,
        }
      : {
          name,
          note,
          exercises: workoutExercises,
        };

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    closeForm();
    loadWorkouts();
  }

  async function deleteWorkout(id) {
    await fetch(`${API_URL}/workout/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    loadWorkouts();
  }

  useEffect(() => {
    loadWorkouts();
    loadExercises();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        {!formVisible && <h2>Workouts</h2>}

        {!formVisible && (
          <button className="header-action" onClick={openCreateForm}>
            Create workout
          </button>
        )}
      </div>

      {formVisible && (
        <form className="form" onSubmit={saveWorkout}>
          <button type="button" onClick={closeForm}>
            ← Workout overview
          </button>

          <h3>{editedWorkout ? "Update workout" : "Create workout"}</h3>

          <input
            placeholder="Workout name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <textarea
            placeholder="Note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />

          <h4>Add exercise to workout</h4>

          <select
            value={selectedExerciseId}
            onChange={(event) => setSelectedExerciseId(event.target.value)}
          >
            <option value="">Select exercise</option>
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Sets"
            value={sets}
            onChange={(event) => setSets(event.target.value)}
          />

          <input
            type="number"
            placeholder="Repetitions"
            value={repetitions}
            onChange={(event) => setRepetitions(event.target.value)}
          />

          <button type="button" onClick={addExerciseToWorkout}>
            Add exercise to workout
          </button>

          {workoutExercises.length > 0 && (
            <div>
              <h4>Exercises in this workout</h4>

              {workoutExercises.map((item, index) => (
                <div className="item" key={index}>
                  <strong>{getExerciseName(item.exerciseId)}</strong>

                  <div className="note">
                    {item.sets} sets × {item.repetitions} repetitions
                  </div>

                  <div className="item-actions">
                    <button
                      type="button"
                      onClick={() => removeExerciseFromWorkout(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button type="submit">Save workout</button>
        </form>
      )}

      {!formVisible && (
        <div className="item-list">
          {workouts.length === 0 && <p>There are no workouts yet.</p>}

          {workouts.map((workout) => (
            <div className="item" key={workout.id}>
              <strong>{workout.name}</strong>

              {workout.note && <div className="note">{workout.note}</div>}

              {workout.exercises && workout.exercises.length > 0 && (
                <div className="note">
                  <strong>Exercises:</strong>

                  {workout.exercises.map((item, index) => (
                    <div key={index}>
                      {getExerciseName(item.exerciseId)} — {item.sets} ×{" "}
                      {item.repetitions}
                    </div>
                  ))}
                </div>
              )}

              <div className="item-actions">
                <button onClick={() => openUpdateForm(workout)}>Edit</button>

                <button onClick={() => deleteWorkout(workout.id)}>
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

export default Dashboard;
