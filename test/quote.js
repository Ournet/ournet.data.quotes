'use strict';

var Quote = require('../lib/db/quote');
var assert = require('assert');

describe('Quote', function() {
	it('should normalize a quote', function() {
		var q = Quote.normalizeQuote({
			country: 'ro',
			lang: 'ro',
			category: 1
		});
		assert.equal(null, q);

		q = Quote.normalizeQuote({
			country: 'ro',
			lang: 'ro',
			category: 1,
			text: 'Some quote kjvdfs jdjjsdsjdsjkjksdgj dfg dfjsgjdsfh gjksdfg df',
			author: { id: 12 },
			webpage: { id: 234, url: 'http://news.com' }
		});
		assert.equal('string', typeof q.id);
		assert.equal('string', typeof q.textHash);
		assert.equal('news.com', q.webpage.host);
	});
});
