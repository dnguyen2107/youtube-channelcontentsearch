'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Video Schema
 */
var VideoSchema = new Schema({
	_id: {
		type: String,
		index: true
	},
	channelId: String,
	snippet: {
		publishedAt: Date,
		title: String,
		description: String,
		tags: Array
	},
	contentDetails: {
		duration: Number,
		dimension: String,
		difinition: String
	},
	statistics: {
		viewCount: Number,
		likeCount: Number,
		dislikeCount: Number,
		favoriteCount: Number,
		commentCount: Number
	}
}, {
	_id: false
});

mongoose.model('Video', VideoSchema);

// db.videos.ensureIndex({
//     'snippet.tags': 'text',
//     'snippet.title': 'text',
//     'snippet.description': 'text'
// }, {
//     weights: {
//         'snippet.tags': 10,
//         'snippet.title': 5,
//         'snippet.description': 1
//     },
//     name: 'text_index'
// })