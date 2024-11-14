const Joi = require('joi');

const validateUserData = Joi.object({
    Listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.object({url:Joi.string()}).required(),//allow("",null),
        location:Joi.string().required(),
        country:Joi.string().required(),
    }).required(),
});
module.exports  = validateUserData;

const validateUserRating = Joi.object({
    reviews:Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment:Joi.string().required()
    }).required()
});

module.exports = validateUserRating;