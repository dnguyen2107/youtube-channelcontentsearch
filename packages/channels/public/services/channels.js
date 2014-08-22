'use strict';

angular.module('mean.channels').factory('Channels', ['$resource',

	function($resource) {
		return $resource('channels/:listPath:id/:docPath', {
			id: '@_id'
		}, {
			add: {
				method: 'POST'
			},
			remove: {
				method: 'DELETE'
			},
			fetchVideos: {
				method: 'GET',
				params: {
					docPath: 'fetchVideos'
				}
			},
			update: {
				method: 'PUT'
			},
			search: {
				method: 'GET',
				isArray: false,
				params: {
					listPath: 'search'
				}
			}
		});
	}

]);