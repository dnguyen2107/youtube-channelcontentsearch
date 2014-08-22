'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Channels = new Module('channels');

// config
require('./server/config/yt.js');

// load scheduler
require('./server/jobs/fetchChannels.js');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Channels.register(function(app, auth, database) {

	// We enable routing. By default the Package Object is passed to the routes
	Channels.routes(app, auth, database);

	Channels.menus.add({
		title: 'Manage Channels',
		link: 'all channels',
		roles: ['admin'],
		menu: 'main'
	});

	return Channels;

});
