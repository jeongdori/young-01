const Joi = require('joi');

exports.updateSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).required(),
});
