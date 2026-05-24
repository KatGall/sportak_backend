const Joi = require("joi");

const exerciseInWorkoutSchema = Joi.object({
  exerciseId: Joi.string().required(),
  repetitions: Joi.number().optional(),
  sets: Joi.number().optional(),
});

const createWorkoutSchema = Joi.object({
  name: Joi.string().required(),
  note: Joi.string().allow("").optional(),
  exercises: Joi.array().items(exerciseInWorkoutSchema).optional(),
});

const updateWorkoutSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  note: Joi.string().allow("").optional(),
  exercises: Joi.array().items(exerciseInWorkoutSchema).optional(),
});

module.exports = {
  createWorkoutSchema,
  updateWorkoutSchema,
};
