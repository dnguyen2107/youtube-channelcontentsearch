'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


/**
 * Channel Schema
 */
var ChannelSchema = new Schema({
	_id: {
		type: String,
		index: true
	},
	snippet: {
		title: String,
		description: String,
		publishedAt: Date,
		thumbnail: String,
	},
	statistics: {
		viewCount: Number,
		videoCount: Number,
		commentCount: Number,
		subscriberCount: Number
	},
	created: {
		type: Date,
		default: Date.now
	},
	status: String,
	lastRun: Date
}, {
	_id: false
});

mongoose.model('Channel', ChannelSchema);