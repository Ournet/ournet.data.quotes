'use strict';

var utils = require('../utils');
var _ = utils._;
var url = require('url');

function createQuoteHash(quote) {
	var text = quote.text || quote;

	text = text.trim().toLowerCase();
	text = text.replace(/[\s!-\/:-@\[-`{-¿–-™]+/g, ' ');
	text = text.replace(/\s{2,}/g, ' ');
	text = text.trim();

	text = utils.atonic(text);

	return utils.md5(text);
}

function createQuoteId(quote) {
	var hash = quote.textHash || createQuoteHash(quote);
	return utils.md5([quote.author.id, hash].join('_'));
}

function normalizeQuote(data) {
	data = _.pick(data, 'text', 'author', 'topics', 'country', 'lang', 'webpage', 'category', 'storyId', 'createdAt');

	if (!data.text || !data.author || !data.webpage) {
		return null;
	}

	if (!data.text || data.text.length < 30) {
		return null;
	}

	data.country = data.country || data.webpage.country;
	data.lang = data.lang || data.webpage.lang;
	data.category = data.category || data.webpage.category;
	data.culture = [data.country, data.lang].join('_').toUpperCase();

	data.createdAt = new Date(data.createdAt || Date.now());
	data.dateKey = [data.country, data.lang, data.createdAt.toISOString()].join('').toUpperCase();
	data.createdAt = data.createdAt.toISOString();

	data.text = utils.wrapAt(data.text, 881);
	data.textHash = createQuoteHash(data);
	data.id = createQuoteId(data);

	data.author = utils.cleanObject(_.pick(data.author, 'id', 'key', 'uniqueName', 'category', 'name', 'abbr'));
	data.authorId = data.author.id;

	data.storyId = data.storyId || data.webpage.storyId;

	data.webpage = _.pick(data.webpage, 'id', 'uniqueName', 'host', 'path', 'url', 'title');
	if (!data.webpage.host || !data.webpage.path) {
		data.webpage.url = url.parse(data.webpage.url);
		data.webpage.host = data.webpage.url.host;
		data.webpage.path = data.webpage.url.path;
	}
	delete data.webpage.url;

	data.topics = data.topics || [];
	data.topics = data.topics.map(function(topic) {
		return utils.cleanObject(_.pick(topic, 'id', 'key', 'name', 'abbr', 'uniqueName', 'category', 'type'));
	});

	return utils.cleanObject(data);
}

exports.config = {
	// updateSchema: updateSchema,
	createNormalize: normalizeQuote //,
		// updateNormalize: normalizeUpdate,
		// createValidate: validateCreate,
		// updateValidate: validateUpdate
};

exports.createQuoteId = createQuoteId;
exports.createQuoteHash = createQuoteHash;
exports.normalizeQuote = normalizeQuote;
