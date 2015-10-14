'use strict';

var core = require('ournet.core');
var Promise = core.Promise;
var models = require('./db/models');
var utils = require('./utils');
var internal = {};

internal.get = utils.get;

var Service = module.exports = function() {

};

/**
 * Create a quote
 */
Service.prototype.createQuote = function(data) {
	data = utils.normalizeQuote(data);
	if (!data) {
		return Promise.reject(new Error('Invalid quote: too short or ...'));
	}
	var self = this;

	var params = {};
	params.ConditionExpression = '#id <> :id';
	params.ExpressionAttributeNames = {
		'#id': 'id'
	};
	params.ExpressionAttributeValues = {
		':id': data.id
	};

	return models.Quote.createAsync(data, params).then(function(quote) {
		if (!quote) {
			return quote;
		}
		quote = internal.get(quote);
		return self.createTargetQuotesFromQuote(quote).then(function() {
			return quote;
		});
	}).catch(function(error) {
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
Service.prototype.createTargetQuote = function(data) {
	return models.TargetQuote.createAsync(data).then(internal.get);
};

/**
 * Update Quote
 */
Service.prototype.updateQuote = function(data) {
	return models.Quote.updateAsync(data).then(internal.get);
};

Service.prototype.createTargetQuotesFromQuote = function(quote) {
	if (!quote.topics || quote.topics.length === 0) {
		return Promise.resolve();
	}

	var self = this;

	return Promise.resolve(quote.topics).each(function(topic) {
		return self.createTargetQuote({
			quoteId: quote.id,
			topicId: topic.id
		});
	});
};
