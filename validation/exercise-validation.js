const Joi = require("joi");

const idSchema = Joi.object({
  id: Joi.string().required(),
});

const createExerciseSchema = Joi.object({
  name: Joi.string().required(),
  note: Joi.string().allow("").optional(),
});

const updateExerciseSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  note: Joi.string().allow("").optional(),
});

module.exports = {
  idSchema,
  createExerciseSchema,
  updateExerciseSchema,
};
