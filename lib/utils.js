'use strict';

var core = require('ournet.core');
var _ = core._;
var url = require('url');
var external = module.exports;

external.normalizeQuote = function(data) {
	//data = _.cloneDeep(data);
	data = _.pick(data, 'text', 'author', 'topics', 'country', 'lang', 'webpage', 'category', 'storyId', 'createdAt');
	data.country = data.country || data.webpage.country;
	data.category = data.category || data.webpage.category;
	data.lang = data.lang || data.webpage.lang;
	data.culture = [data.country, data.lang].join('_').toUpperCase();
	data.createdAt = data.createdAt || new Date();
	data.dateKey = [data.country, data.lang, data.createdAt.toISOString()].join('').toUpperCase();
	data.text = core.text.wrapAt(data.text, 881);
	if (data.text.length < 30) {
		return null;
	}
	data.textHash = external.createQuoteHash(data);
	data.id = external.createQuoteId(data);

	data.author = core.util.clearObject(_.pick(data.author, 'id', 'key', 'uniqueName', 'category', 'name', 'abbr'));
	data.authorId = data.author.id;

	data.storyId = data.storyId || data.webpage.storyId;

	//data.webpageId = data.webpage.id;
	data.webpage = _.pick(data.webpage, 'id', 'uniqueName', 'host', 'path', 'url', 'title');
	if (!data.webpage.host || !data.webpage.path) {
		data.webpage.url = url.parse(data.webpage.url);
		data.webpage.host = data.webpage.url.host;
		data.webpage.path = data.webpage.url.path;
	}
	delete data.webpage.url;

	data.topics = data.topics || [];
	data.topics = data.topics.map(function(topic) {
		return core.util.clearObject(_.pick(topic, 'id', 'key', 'name', 'abbr', 'uniqueName', 'category', 'type'));
	});

	return core.util.clearObject(data);
};

external.get = function(data) {
	if (_.isNull(data) || _.isUndefined(data)) {
		return data;
	}
	if (_.isArray(data)) {
		return data.map(external.get);
	}
	if (_.isFunction(data.toJSON)) {
		return data.toJSON();
	}
	if (_.isObject(data)) {
		Object.keys(data).forEach(function(key) {
			data[key] = external.get(data[key]);
		});
	}
	return data;
};

external.createQuoteId = function(quote) {
	var hash = quote.textHash || external.createQuoteHash(quote);
	return core.util.md5([quote.author.id, hash].join('_'));
};

external.createQuoteHash = function(quote) {
	var text = quote.text || quote;

	text = text.trim().toLowerCase();
	text = text.replace(/[\s!-\/:-@\[-`{-¿–-™]+/g, ' ');
	text = text.replace(/\s{2,}/g, ' ');
	text = text.trim();

	text = core.text.atonic(text);

	return core.util.md5(text);
};
