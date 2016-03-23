'use strict';

var Data = require('./common/data');
if (!Data) {
	return;
}

var assert = require('assert');

describe('Access', function() {
	it('should get quote by id', function() {
		return Data.access.quote('a97c48526763695be7b3306814a742df')
			.then(function(quote) {
				assert.ok(quote);
				assert.equal('ro', quote.lang);
			});
	});
	it('should get quote by id (AttributesToGet)', function() {
		return Data.access.quote('a97c48526763695be7b3306814a742df', {
				params: {
					AttributesToGet: ['id', 'text']
				}
			})
			.then(function(quote) {
				assert.ok(quote);
				assert.equal('a97c48526763695be7b3306814a742df', quote.id);
				assert.equal(2, Object.keys(quote).length);
			});
	});
	it('should get quotes by ids', function() {
		return Data.access.quotes(['a97c48526763695be7b3306814a742df'])
			.then(function(quotes) {
				assert.ok(quotes);
				assert.equal(1, quotes.length);
			});
	});
});
