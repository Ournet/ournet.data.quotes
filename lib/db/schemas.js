'use strict';

var Joi = require('vogels-helpers').Joi;

exports.Quote = {
	// md5 AUTHOR_ID + TEXT_HASH
	id: Joi.string().length(32).required(),
	text: Joi.string().trim().min(30).max(884).required(),
	textHash: Joi.string().length(32).required(),
	//slug: Joi.string().trim().lowercase().max(64).required(),

	culture: Joi.string().trim().uppercase().length(5).required(),
	//MDROYYYY-MM-DDTHH:mm:ss.sssZ
	dateKey: Joi.string().trim().uppercase().length(28).required(),

	webpage: Joi.object().keys({
		host: Joi.string().trim().lowercase().max(64).required(),
		uniqueName: Joi.string().trim().lowercase().max(64).required(),
		path: Joi.string().trim().max(512).required(),
		id: Joi.string().length(32),
		title: Joi.string().max(200).required()
	}).required(),

	lang: Joi.string().trim().length(2).lowercase().required(),
	country: Joi.string().trim().length(2).lowercase().required(),

	category: Joi.valid(10, 20, 30, 40, 50, 60, 70, 80, 90),

	//CATEGORY_DATE
	//categoryKey: Joi.string().trim().uppercase().length(28).required(),

	countViews: Joi.number().integer().min(0).default(0),

	topics: Joi.array().items(Joi.object().keys({
		id: Joi.number().integer().required(),
		key: Joi.string().trim().length(32).required(),
		name: Joi.string().trim().max(100).required(),
		uniqueName: Joi.string().trim().lowercase().max(100).required(),
		abbr: Joi.string().trim().max(20),
		wikiId: Joi.number().integer(),
		type: Joi.valid(1, 2, 3, 4, 5),
		category: Joi.valid(10, 20, 30, 40, 50, 60, 70, 80, 90)
	})),

	authorId: Joi.number().integer().required(),
	author: Joi.object().keys({
		id: Joi.number().integer().required(),
		key: Joi.string().trim().length(32).required(),
		name: Joi.string().trim().max(100).required(),
		uniqueName: Joi.string().trim().lowercase().max(100).required(),
		abbr: Joi.string().trim().max(20),
		wikiId: Joi.number().integer(),
		type: Joi.valid(1, 2, 3, 4, 5),
		category: Joi.valid(10, 20, 30, 40, 50, 60, 70, 80, 90)
	}).required(),

	storyId: Joi.number().integer(),
	createdAt: Joi.string().isoDate().required()
};

exports.TargetQuote = {
	topicId: Joi.number().integer().min(1).required(),
	quoteId: Joi.string().length(32).required(),
	createdAt: Joi.string().isoDate().required()
};
