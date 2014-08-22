'use strict';

angular.module('mean.channels')

.controller('ManageChannelsCtrl', ['$scope', 'channels', 'Global', 'Channels', '$modal',
	function($scope, channels, Global, Channels, $modal) {
		$scope.global = Global;
		$scope.package = {
			name: 'channels'
		};

		$scope.channels = channels;

		$scope.openAddChannelForm = function() {
			$modal.open({
				templateUrl: 'channels/views/addChannelDialog.html',
				controller: 'AddChannelDialogCtrl',
				resolve: {
					refresh: function() {
						return function() {
							$scope.channels = Channels.query();
						};
					}
				}
			});
		};

		$scope.fetchVideos = function() {
			Channels.fetchVideos({});
		};

		$scope.fetchChannelVideos = function(channel) {
			Channels.fetchVideos({
				id: channel._id
			});
		};

		$scope.removeChannel = function(channel) {
			var index = $scope.channels.indexOf(channel);
			Channels.remove({
				id: channel._id
			}).$promise.then(function() {
				$scope.channels.splice(index, 1);
			});
		};
	}
])

.controller('AddChannelDialogCtrl', ['$scope', 'refresh', '$modalInstance', 'Channels', '$log',
	function($scope, refresh, modalInstance, Channels, $log) {

		$scope.closeDialog = function() {
			modalInstance.dismiss('cancel');
		};

		$scope.searchChannel = function(query) {
			$scope.loading = true;
			$scope.noresult = false;
			$scope.result = null;

			$scope.addError = false;
			$scope.addSuccess = false;
			$scope.addLoading = false;

			Channels.search({
				q: query
			}).$promise.then(function(data) {
				$scope.loading = false;
				if (data.entry) {
					data.entry.channelId = 'UC' + data.entry.id.$t.substring(data.entry.id.$t.lastIndexOf('/') + 1);
					$scope.result = data;
				} else {
					$scope.noresult = true;
				}
			}, function() {
				$scope.loading = false;
				$scope.noresult = true;
			});
		};

		$scope.addChannel = function() {
			$scope.addError = false;
			$scope.addSuccess = false;
			$scope.addLoading = true;

			if ($scope.result) {
				Channels.add({
					id: $scope.result.entry.channelId
				}).$promise.then(function(res) {
					$scope.addLoading = false;
					$scope.addSuccess = true;
					refresh();
				}, function(res) {
					$scope.addLoading = false;
					$scope.addError = res.data.message;
				});
			}
		};

	}
])
;