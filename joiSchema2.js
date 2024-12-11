const Joi = require('joi');


const validateUserRating = Joi.object({
    reviews:Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment:Joi.string().required()
    }).required()
});

module.exports = validateUserRating;