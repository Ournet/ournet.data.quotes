'use strict';

require('./db/models');

var utils = require('./utils');
var _ = utils._;
var vogels = require('vogels-helpers');
var buildOptions = utils.buildServiceOptions;

function Service() {}

module.exports = Service;

/**
 * Quote by id
 */
Service.prototype.quote = function(id, options) {
	options = buildOptions(options);

	return vogels.access.getItem('Quote', id, options);
};

/**
 * Quotes by ids
 */
Service.prototype.quotes = function(ids, options) {
	options = buildOptions(options);

	return vogels.access.getItems('Quote', ids, options)
		.then(function(quotes) {
			if (!quotes || quotes.length === 0 || !options.sort) {
				return quotes;
			}
			var item, list = [];
			ids.forEach(function(id) {
				item = _.find(quotes, {
					id: id
				});
				if (item) {
					list.push(item);
				}
			});
			return list;
		});
};

/**
 * Quotes by author
 */
Service.prototype.quotesByAuthor = function(authorId, options) {
	var self = this;
	options = _.defaults({ index: 'Author-index', key: authorId }, options, {
		format: 'items',
		sort: 'descending',
		limit: 10
	});

	var params = options.params;
	delete options.params;

	return vogels.access.query('Quote', options)
		.then(function(quotes) {
			if (!quotes || quotes.length === 0) {
				return quotes;
			}

			quotes = quotes.map(function(item) {
				return item.id;
			});

			return self.quotes(_.uniq(quotes), { sort: true, params: params });
		});
};

/**
 * Quotes about topicId
 */
Service.prototype.quotesAbout = function(topicId, options) {
	var self = this;
	options = _.defaults({ key: topicId }, options, {
		format: 'items',
		sort: 'descending',
		limit: 10
	});

	var params = options.params;
	delete options.params;

	return vogels.access.query('TargetQuote', options)
		.then(function(quotes) {
			if (!quotes || quotes.length === 0) {
				return quotes;
			}

			quotes = quotes.map(function(item) {
				return item.quoteId;
			});

			return self.quotes(_.uniq(quotes), { sort: true, params: params });
		});
};
