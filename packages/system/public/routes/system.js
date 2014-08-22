'use strict';

//Setting up route
angular.module('mean.system')

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider) {
		// For unmatched routes:
		$urlRouterProvider.otherwise('/');

		// // states for my app
		// $stateProvider.state('home', {
		// url: '/',
		// templateUrl: 'system/views/index.html'
		// });

		// $locationProvider.html5Mode(true);
	}
])

.config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);