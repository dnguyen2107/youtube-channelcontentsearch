'use strict';

angular.module('mean.videos').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.state('videos', {
			url: '/',
			templateUrl: 'videos/views/index.html',
			controller: 'VideosController'
		});
	}
]);