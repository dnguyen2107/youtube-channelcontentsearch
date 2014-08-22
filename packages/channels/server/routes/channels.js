'use strict';

var channels = require('../controllers/channels');

// The Package is past automatically as first parameter
module.exports = function(Channels, app, auth) {

	app.route('/channels')
		.get(auth.requiresAdmin, channels.all)
		.post(auth.requiresAdmin, channels.create);

	app.route('/channels/search')
		.get(channels.search);

	app.route('/channels/fetchVideos').get(auth.requiresAdmin, channels.fetchAllVideos);

	app.route('/channels/:channelId')
		.get(auth.requiresAdmin, channels.show)
		.put(auth.requiresAdmin, channels.update)
		.delete(auth.requiresAdmin, channels.destroy);

	app.route('/channels/:channelId/fetchVideos').get(auth.requiresAdmin, channels.fetchChannelVideos);

	app.param('channelId', channels.channel);
};
