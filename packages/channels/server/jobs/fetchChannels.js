'use strict';

var schedule = require('node-schedule'),
	YtUtils = require('../libs/yt.js');

schedule.scheduleJob('0 */4 * * *', function() {
	console.log('[ScheduleJob] BEING to fetch videos');
	YtUtils.fetchAll(function() {
		console.log('[ScheduleJob] END to fetch videos');
	});
});