'use strict';

var mongoose = require('mongoose'),
	Channel = mongoose.model('Channel'),
	Video = mongoose.model('Video'),
	YouTube = require('youtube-api'),
	unirest = require('unirest'),
	_ = require('lodash'),
	async = require('async');


var fetchPlaylist = function(playlistId, pageToken, callback) {
	console.log('Getting videos of ' + playlistId + ' - ' + pageToken);

	var params = {
		part: 'snippet',
		playlistId: playlistId,
		maxResults: 25
	};

	if (pageToken) {
		params.pageToken = pageToken;
	}

	YouTube.playlistItems.list(params, function(err, response) {
		if (err) {
			console.log('ERROR: Cannot get playlist items');
			console.log(err);
			console.log(response);

			if (callback && typeof callback === 'function') {
				callback(err);
			}
		} else {
			var nextPageToken = response.nextPageToken;
			var vIds = [];
			_.forEach(response.items, function(item) {
				vIds.push(item.snippet.resourceId.videoId);
			});

			if (vIds.length > 0) {
				var channelId = response.items[0].snippet.channelId;

				// get/update videos
				YouTube.videos.list({
					part: 'snippet,statistics,contentDetails',
					id: vIds.join(',')
				}, function(err, response) {
					if (err) {
						console.log('ERROR: Cannot get videos details');
						console.log(err);
					} else {
						_.forEach(response.items, function(item) {
							Video.findById({
								_id: item.id
							}, function(err, video) {
								if (!video) {
									video = new Video({
										_id: item.id,
									});
								}

								// cal duration
								var d = item.contentDetails.duration.substring(2);
								var min = 0;
								var sec = 0;
								if (d.indexOf('M') > -1) {
									var arr = d.split('M');
									min = parseInt(arr[0], 10);
									d = arr[1];
								}
								if (d.indexOf('S') > -1) {
									sec = parseInt(d.split('S')[0], 10);
								}
								item.contentDetails.duration = min * 60 + sec;

								video.channelId = channelId;
								video = _.assign(video, item);

								video.save(function(err) {
									if (err) {
										console.log('ERROR: Cannot save video');
										console.log('Details:');
										console.log(err);
									}
								});
							});
						});
					}

					// check next page
					if (nextPageToken) {
						fetchPlaylist(playlistId, nextPageToken, callback);
					} else {
						console.log('Done');
						if (callback && typeof callback === 'function') {
							callback();
						}
					}
				});
			} else {
				if (callback && typeof callback === 'function') {
					callback();
				}
			}
		}
	});
};


var fetchChannelVideos = function(channel, callback) {
	// update channel info
	YouTube.channels.list({
		part: 'snippet,statistics',
		id: channel._id
	}, function(err, data) {
		if (err || !data || !data.items || data.items.length !== 1) {
			console.log(err);
		} else {
			channel = _.extend(channel, data.items[0]);

			// update thumbnails
			var t = data.items[0].snippet.thumbnails.high || data.items[0].snippet.thumbnails.medium || data.items[0].snippet.thumbnails.default;
			channel.snippet.thumbnail = t.url;

			channel.save(function(err) {
				if (err) {
					console.log(err);
				}
			});
		}

		var playlistId = channel._id.replace('UC', 'UU');
		fetchPlaylist(playlistId, null, function(err) {
			if (err) {
				channel.status = 'ERROR';
			} else {
				channel.status = 'SUCCESS';
			}
			channel.lastRun = new Date();

			channel.save(function() {
				if (callback && typeof callback === 'function') {
					callback();
				}
			});
		});
	});
};

var wasScheduled = function(channel) {
	var now = new Date();
	return channel.status === 'SCHEDULED' && (now.getTime() - channel.lastRun.getTime()) < 60 * 60 * 1000;
};

exports.fetchChannel = function(channel, callback) {
	if (wasScheduled(channel)) {
		if (callback && typeof callback === 'function') {
			callback(channel.status);
		}
	} else {
		channel.status = 'SCHEDULED';
		channel.save();
		fetchChannelVideos(channel, callback);
	}
};

exports.fetchAll = function(callback) {
	var channelIds = [];
	Channel.find().exec(function(err, channels) {
		var tasks = [];

		_.forEach(channels, function(channel) {
			channelIds.push(channel._id);

			if (!wasScheduled(channel)) {
				channel.status = 'SCHEDULED';
				channel.save();

				tasks.push(function(callback) {
					fetchChannelVideos(channel, callback);
				});
			}
		});

		async.waterfall(tasks, function() {
			// remove orphan videos
			if (channelIds.length > 0) {
				Video.remove({
					channelId: {
						$nin: channelIds
					}
				}).exec();
			}

			if (callback && typeof callback === 'function') {
				callback();
			}
		});
	});
};

exports.getChannel = function(query, callback) {
	var url = 'https://gdata.youtube.com/feeds/api/users/' + query + '?alt=json';
	unirest.get(url).end(callback);
};
