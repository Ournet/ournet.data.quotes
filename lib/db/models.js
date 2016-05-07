'use strict';

var vogels = require('vogels-helpers');
var schemas = require('./schemas');
var Quote = require('./quote');
var TargetQuote = require('./target_quote');

exports.Quote = vogels.define('Quote', {
	tableName: 'Quotes',
	hashKey: 'id',
	updatedAt: true,
	createdAt: false,
	schema: schemas.Quote,
	indexes: [{
		hashKey: 'authorId',
		type: 'global',
		name: 'Author-index'
	}]
}, Quote.config);

exports.TargetQuote = vogels.define('TargetQuote', {
	tableName: 'TargetQuotes',
	hashKey: 'topicId',
	rangeKey: 'createdAt',
	updatedAt: false,
	createdAt: false,
	schema: schemas.TargetQuote
}, TargetQuote.config);
