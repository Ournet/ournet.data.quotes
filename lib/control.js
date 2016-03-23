'use strict';

require('./db/models');

var vogels = require('vogels-helpers');
var utils = require('./utils');
var Promise = utils.Promise;
var buildOptions = utils.buildServiceOptions;

function Service() {}

module.exports = Service;

/**
 * Create a quote
 */
Service.prototype.createQuote = function(data, options) {
	var self = this;

	options = buildOptions(options);

	return vogels.control.create('Quote', data, options)
		.then(function(quote) {
			if (!quote) {
				return quote;
			}
			return self.createTargetQuotesFromQuote(quote)
				.then(function() {
					return quote;
				});
		})
		.catch(function(error) {
			if (error.code === 'ConditionalCheckFailedException') {
				return {
					id: data.id
				};
			}
			return Promise.reject(error);
		});
};

/**
 * Create a target quote
 */
Service.prototype.createTargetQuote = function(data, options) {
	options = buildOptions(options);

	return vogels.control.create('TargetQuote', data, options);
};

/**
 * Update Quote
 */
Service.prototype.updateQuote = function(data, options) {
	options = buildOptions(options);

	return vogels.control.update('Quote', data, options);
};

Service.prototype.createTargetQuotesFromQuote = function(quote) {
	if (!quote.topics || quote.topics.length === 0) {
		return Promise.resolve();
	}

	var self = this;

	return Promise.resolve(quote.topics)
		.each(function(topic) {
			return self.createTargetQuote({
				quoteId: quote.id,
				topicId: topic.id
			});
		});
};
