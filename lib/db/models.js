'use strict';

var vogels = require('vogels-helpers');
var schemas = require('./schemas');
var Quote = require('./quote');
var TargetQuote = require('./target_quote');

exports.Quote = vogels.define('Quote', {
	tableName: 'Quotes',
	hashKey: 'id',
	timestamps: true,
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
	timestamps: true,
	updatedAt: false,
	schema: schemas.TargetQuote
}, TargetQuote.config);
