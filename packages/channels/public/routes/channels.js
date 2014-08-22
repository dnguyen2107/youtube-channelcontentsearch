'use strict';

angular.module('mean.channels').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.state('all channels', {
			url: '/channels',
			controller: 'ManageChannelsCtrl',
			templateUrl: 'channels/views/index.html',
			resolve: {
				channels: ['Channels',
					function(Channels) {
						return Channels.query().$promise;
					}
				]
			}
		}).state('add channel', {
			url: '/channels/create',
			templateUrl: 'channels/views/create.html'
		});
	}
]);