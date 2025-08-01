const joi = require('joi');

const listingSchema = joi.object(
  {
    listing: joi.object({
      title: joi.string().required(),
      description: joi.string().required(),
      material: joi.string().required(),
      dimension: joi.string().required(),
      price: joi.string().required(),
      image: joi.string().allow("", null),
    }).required()
  }
);

const reviewSchema = joi.object(
  {
    review: joi.object({
      rating: joi.number().required().min(0).max(5),
      comment: joi.string().required(),
    }).required()
  }
);

module.exports = {
  listingSchema,
  reviewSchema
};