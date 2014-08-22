'use strict';

angular.module('mean.videos').controller('VideosController', ['$scope', '$location', '$anchorScroll', 'Global', 'Videos', '$sce',
	function($scope, $location, $anchorScroll, Global, Videos, $sce) {
		$scope.global = Global;
		$scope.package = {
			name: 'videos'
		};

		$scope.pageInfo = {
			q: '',
			page: 1,
			pageSize: 20,
			sort: '-snippet.publishedAt',
			totalResults: -1
		};

		$scope.scrollTo = function(ele) {
			if (!ele) {
				ele = 'player';
			}
			$location.hash(ele);
			$anchorScroll();
		};

		$scope.changeSortOption = function(option) {
			$scope.pageInfo.page = 1;
			$scope.pageInfo.sort = option;
			$scope.getVideos(true);
		};

		$scope.gotoPage = function(page) {
			$scope.pageInfo.page = page;
			$scope.getVideos();
		};

		$scope.prevPage = function() {
			$scope.pageInfo.page = $scope.pageInfo.page - 1;
			$scope.getVideos();
		};

		$scope.searchVideos = function() {
			$scope.pageInfo.page = 1;
			$scope.totalResults = -1;
			$scope.videos = null;
			$scope.firstVideo = null;
			$scope.getVideos(true, false);
		};

		$scope.openVideo = function(video, scrollTop) {
			$scope.firstVideo = video;
			$scope.firstVideo.url = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + $scope.firstVideo._id + '?autoplay=1');
			if (scrollTop) {
				$scope.scrollTo('top');
			} else {
				$scope.scrollTo('player');
			}
		};

		$scope.getVideos = function(loadFirst, scrollTop) {
			Videos.search($scope.pageInfo).$promise.then(function(data) {
				$scope.videos = data.items;
				$scope.pageInfo.totalResults = data.pageInfo.totalResults;

				angular.forEach($scope.videos, function(video, index) {
					video.index = ($scope.pageInfo.page - 1) * $scope.pageInfo.pageSize + index + 1;
				});

				// build paging
				$scope.lastPage = Math.ceil($scope.pageInfo.totalResults / $scope.pageInfo.pageSize);
				$scope.startPage = Math.max(1, $scope.pageInfo.page - 5);
				$scope.endPage = Math.min($scope.startPage + 9, $scope.lastPage);
				$scope.pages = [];
				for (var i = $scope.startPage; i <= $scope.endPage; i = i + 1) {
					$scope.pages.push(i);
				}

				if (loadFirst) {
					$scope.openVideo($scope.videos[0], scrollTop);
				} else {
					if (scrollTop) {
						$scope.scrollTo('top');
					} else {
						$scope.scrollTo('PageInfo');
					}

				}
			});
		};

		$scope.getVideos(true, true);
	}
]);