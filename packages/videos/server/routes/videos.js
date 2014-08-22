'use strict';

var videos = require('../controllers/videos');

module.exports = function(Videos, app, auth) {

	app.route('/videos/search').get(videos.search);

};