angular.module('psPage', [])
	.controller('EditorController', [
		'$scope',
		function($scope) {
			$scope.lines = ["Insert text..."];
		}
	])
	.directive('pspLine', [
		function() {
			return {
				link: function(scope, iElement) {
					iElement.bind("keydown keypress", function(event) {
						if (event.which === 13) {
							scope.$apply(function () {
								scope.lines.push(""+scope.lines.length);

								console.log('lines:', scope.lines);
							});

							event.preventDefault();
						}
					});
				}
			};
		}
	]);