'use strict';

var core = require('ournet.core');
var Promise = core.Promise;
var _ = core._;
var models = require('./db/models');
var internal = {};
var utils = require('./utils');

internal.get = utils.get;

var Service = module.exports = function() {

};

/**
 * Quote by id
 */
Service.prototype.quote = function(params) {
	return models.Quote.getAsync(params.id, params.params).then(internal.get);
};

/**
 * Quotes by ids
 */
Service.prototype.quotes = function(params) {
	return models.Quote.getItemsAsync(params.ids, params.params)
		.then(internal.get)
		.then(function(quotes) {
			if (!quotes || quotes.length === 0 || !params.sort) {
				return quotes;
			}
			var item, list = [];
			params.ids.forEach(function(id) {
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
Service.prototype.quotesByAuthor = function(params) {
	var self = this;
	return new Promise(function(resolve, reject) {
		models.Quote
			.query(params.authorId)
			.usingIndex('Author-index')
			.limit(params.limit || 10)
			.descending()
			.exec(function(error, result) {
				if (error) {
					return reject(error);
				}
				result = internal.get(result.Items);
				if (!result || result.length === 0) {
					return resolve(result);
				}
				result = result.map(function(item) {
					return item.id;
				});
				self.quotes({
					ids: _.uniq(result),
					sort: true
				}).then(resolve).catch(reject);
			});
	});
};

/**
 * Quotes about topicId
 */
Service.prototype.quotesAbout = function(params) {
	var self = this;
	return new Promise(function(resolve, reject) {
		models.TargetQuote
			.query(params.topicId)
			.limit(params.limit || 10)
			.descending()
			.exec(function(error, result) {
				if (error) {
					return reject(error);
				}
				result = internal.get(result.Items);
				if (!result || result.length === 0) {
					return resolve(result);
				}
				result = result.map(function(item) {
					return item.quoteId;
				});
				self.quotes({
					ids: _.uniq(result),
					sort: true
				}).then(resolve).catch(reject);
			});
	});
};
