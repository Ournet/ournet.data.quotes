'use strict';

var utils = require('../utils');
var _ = utils._;

function normalize(data) {
	data = _.pick(data, 'topicId', 'quoteId', 'createdAt');
	data.createdAt = new Date(data.createdAt || Date.now());
	data.createdAt = data.createdAt.toISOString();

	return data;
}

exports.config = {
	// updateSchema: updateSchema,
	createNormalize: normalize //,
		// updateNormalize: normalizeUpdate,
		// createValidate: validateCreate,
		// updateValidate: validateUpdate
};

exports.normalize = normalize;
