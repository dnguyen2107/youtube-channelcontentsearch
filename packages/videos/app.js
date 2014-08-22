'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Videos = new Module('videos');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Videos.register(function(app, auth, database) {

	// We enable routing. By default the Package Object is passed to the routes
	Videos.routes(app, auth, database);

	Videos.aggregateAsset('css', 'videos.css');

	// We are adding a link to the main menu for all authenticated users
	// Videos.menus.add({
	// title: 'YouTube Videos Search',
	// link: 'videos',
	// roles: [],
	// menu: 'main'
	// });

	return Videos;
});