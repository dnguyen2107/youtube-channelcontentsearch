'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Channel = mongoose.model('Channel'),
	Video = mongoose.model('Video'),
	YouTube = require('youtube-api'),
	_ = require('lodash'),
	YtUtils = require('../libs/yt');

/**
 * Find channel by id
 */
exports.channel = function(req, res, next, id) {
	Channel.findById(id, function(err, channel) {
		if (err) {
			return next(err);
		}
		if (!channel) {
			return next(new Error('Failed to load channel ' + id));
		}
		req.channel = channel;
		next();
	});
};

/**
 * Create an channel
 */
exports.create = function(req, res) {
	Channel.findById(req.body.id, function(err, channel) {
		if (err) {
			res.status(500).json({
				message: 'Unexpected error!'
			});
		} else {
			if (channel) {
				res.status(500).json({
					message: 'Already added'
				});
			} else {
				YouTube.channels.list({
					part: 'snippet,statistics',
					id: req.body.id
				}, function(err, data) {
					if (err || !data || !data.items || data.items.length !== 1) {
						res.status(500).json({
							message: 'Cannot get channel info'
						});
					} else {
						var channel = new Channel({
							_id: data.items[0].id,
							snippet: data.items[0].snippet,
							statistics: data.items[0].statistics
						});

						// update thumbnails
						var t = data.items[0].snippet.thumbnails.high || data.items[0].snippet.thumbnails.medium || data.items[0].snippet.thumbnails.default;
						channel.snippet.thumbnail = t.url;

						channel.save(function(err) {
							if (err) {
								console.log(err);
								res.status(500).json({
									error: 'Cannot add the channel'
								});
							} else {
								res.json(channel);
							}
						});
					}
				});
			}
		}
	});
};

/**
 * Update an channel
 */
exports.update = function(req, res) {
	var channel = req.channel;

	channel = _.extend(channel, req.body);

	channel.save(function(err) {
		if (err) {
			return res.json(500, {
				error: 'Cannot update the channel'
			});
		}
		res.json(channel);
	});
};

/**
 * Delete an channel
 */
exports.destroy = function(req, res) {
	var channel = req.channel;

	channel.remove(function(err) {
		if (err) {
			return res.json(500, {
				error: 'Cannot delete the channel'
			});
		}

		// remove videos
		Video.remove({
			channelId: channel._id
		}).exec();

		res.json({});
	});
};

/**
 * Show an channel
 */
exports.show = function(req, res) {
	res.json(req.channel);
};

/**
 * List of channels
 */
exports.all = function(req, res) {
	Channel.find().sort('-created').exec(function(err, channels) {
		if (err) {
			return res.json(500, {
				error: 'Cannot list the channels'
			});
		}
		res.json(channels);
	});
};

exports.search = function(req, res) {
	YtUtils.getChannel(req.query.q, function(response) {
		res.json(response.body);
	});
};

exports.fetchChannelVideos = function(req, res) {
	YtUtils.fetchChannel(req.channel);
	res.json({});
};

exports.fetchAllVideos = function(req, res) {
	YtUtils.fetchAll();
	res.json({});
};
