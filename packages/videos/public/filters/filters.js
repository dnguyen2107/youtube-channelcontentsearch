'use strict';

angular.module('mean.videos')

.filter('durationFormatter', function() {
	return function(n) {
		var sec = n % 60;
		n = Math.floor(n / 60);
		var min = n % 60;
		var hour = Math.floor(n / 60);

		var str = '';
		if (hour > 0) {
			str += hour + ':';
		}
		if (min < 10 && hour > 0) {
			str += '0' + min + ':';
		} else {
			str += min + ':';
		}
		if (sec < 10) {
			str += '0' + sec;
		} else {
			str += sec;
		}

		return str;
	};
})

.filter('ordinalPart', function() {
	return function(n) {
		var s = ['th', 'st', 'nd', 'rd'],
			v = n % 100;
		return s[(v - 20) % 10] || s[v] || s[0];

	};
});