'use strict';

angular.module('mean.videos').factory('Videos', ['$resource',

	function($resource) {
		return $resource('videos/:listPath:id/:docPath', {
			id: '@_id'
		}, {
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