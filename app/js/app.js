angular.module('psPage', [])
	.controller('EditorController', [
		'$scope',
		function($scope) {
			var column;

			$scope.lines = [{
				value: "Insert text..."
			}];

			$scope.setColumn = function(newColumn) {
				column = newColumn;
			};

			$scope.getColumn = function() {
				return column;
			};
		}
	])
	.directive('pspLine', [
		function() {
			return {
				link: function(scope, iElement) {
					iElement.focus();
					scope.column = scope.lines[scope.$index].value.length;

					// Keydown/keypress listener
					iElement.bind("keydown keypress", function(event) {
						// Enter
						if (event.which === 13) {
							scope.$apply(function() {
								scope.lines.splice(scope.$index + 1, 0, {
									value: ""
								});
							});
							event.preventDefault();
						}

						// Backspace
						if (event.which === 8) {
							// If cursor is at the text area beginning
							if (iElement.prop("selectionStart") === 0) {
								if (scope.$index !== 0) {
									var previousLine = iElement.parent().children()[scope.$index - 1];
									var column = scope.lines[scope.$index - 1].value.length;

									scope.lines[scope.$index - 1].value += scope.lines[scope.$index].value;
									scope.lines.splice(scope.$index, 1);
									scope.$apply();

									previousLine.focus();
									previousLine.setSelectionRange(column, column);
								}

								event.preventDefault();
								event.stopPropagation();
								return false;
							}
						}

						// Up
						if (event.which == 38 && scope.$index > 0) {
							iElement.parent().children()[scope.$index - 1].focus();
							console.log('up column:', scope.getColumn());
							iElement.parent().children()[scope.$index - 1].setSelectionRange(scope.getColumn(), scope.getColumn());

							event.preventDefault();
							event.stopPropagation();
							return false;
						}

						// Down
						if (event.which == 40 && scope.$index < (scope.lines.length - 1)) {
							iElement.parent().children()[scope.$index + 1].focus();
							console.log('down column:', scope.getColumn());
							iElement.parent().children()[scope.$index + 1].setSelectionRange(scope.getColumn(), scope.getColumn());

							event.preventDefault();
							event.stopPropagation();
							return false;
						}

						// Left
						if (event.which == 37) {
							scope.setColumn(iElement.prop("selectionStart") - 1);
							//console.log('left column:', scope.getColumn());
							scope.$apply();
						} else {
							scope.setColumn(iElement.prop("selectionStart") + 1);
							//console.log('right/any column:', scope.getColumn());
							scope.$apply();
						}
					});
				}
			};
		}
	]);