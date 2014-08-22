'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Video = mongoose.model('Video'),
	_ = require('lodash');


/**
 * Find video by id
 */
exports.video = function(req, res, next, id) {
	Video.findById(id, function(err, video) {
		if (err) {
			return next(err);
		}
		if (!video) {
			return next(new Error('Failed to load video ' + id));
		}
		req.video = video;
		next();
	});
};

/**
 * Create an video
 */
exports.create = function(req, res) {
	var video = new Video(req.body);

	video.save(function(err) {
		if (err) {
			return res.json(500, {
				error: 'Cannot save the video'
			});
		}
		res.json(video);
	});
};

/**
 * Update an video
 */
exports.update = function(req, res) {
	var video = req.video;

	video = _.extend(video, req.body);

	video.save(function(err) {
		if (err) {
			return res.json(500, {
				error: 'Cannot update the video'
			});
		}
		res.json(video);
	});
};

/**
 * Delete an video
 */
exports.destroy = function(req, res) {
	var video = req.video;

	video.remove(function(err) {
		if (err) {
			return res.json(500, {
				error: 'Cannot delete the video'
			});
		}
		res.json(video);

	});
};

/**
 * Show an video
 */
exports.show = function(req, res) {
	res.json(req.video);
};

/**
 * List of videos
 */
exports.all = function(req, res) {
	console.log('all videos');
	Video.find().sort('-created').exec(function(err, videos) {
		if (err) {
			return res.json(500, {
				error: 'Cannot list the videos'
			});
		}
		res.json(videos);
	});
};

exports.search = function(req, res) {
	var page = req.query.page || 1;
	var pageSize = req.query.pageSize || 10;
	var skip = (page - 1) * pageSize;
	var sort = req.query.sort || '-created';
	var query = null;

	var searchQuery = null;
	if (req.query.q) {
		searchQuery = {
			$text: {
				$search: req.query.q
			}
		};
	} else {
		searchQuery = {};
	}

	if (sort === 'relevance' && req.query.q) {
		query = Video.find(searchQuery, {
			score: {
				$meta: 'textScore'
			}
		}).sort({
			score: {
				$meta: 'textScore'
			}
		}).skip(skip).limit(pageSize);
	} else {
		query = Video.find(searchQuery).sort(sort).skip(skip).limit(pageSize);
	}

	// execute search
	Video.find(searchQuery).count(function(err, count) {
		if (err) {
			res.status(500).json({
				errors: err
			});
		}
		query.exec(function(err, videos) {
			if (err) {
				return res.status(500).json({
					error: err
				});
			}
			res.json({
				pageInfo: {
					page: page,
					pageSize: pageSize,
					totalResults: count
				},
				items: videos
			});
		});
	});
};