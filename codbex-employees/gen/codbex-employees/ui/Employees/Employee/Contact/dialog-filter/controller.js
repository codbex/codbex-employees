angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-employees.Employees.Contact';
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', function ($scope, messageHub, ViewParameters) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.entity = params.entity ?? {};
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsCountry = params.optionsCountry;
			$scope.optionsCity = params.optionsCity;
		}

		$scope.filter = function () {
			let entity = $scope.entity;
			const filter = {
				$filter: {
					equals: {
					},
					notEquals: {
					},
					contains: {
					},
					greaterThan: {
					},
					greaterThanOrEqual: {
					},
					lessThan: {
					},
					lessThanOrEqual: {
					}
				},
			};
			if (entity.Id !== undefined) {
				filter.$filter.equals.Id = entity.Id;
			}
			if (entity.Employee !== undefined) {
				filter.$filter.equals.Employee = entity.Employee;
			}
			if (entity.Address) {
				filter.$filter.contains.Address = entity.Address;
			}
			if (entity.Country !== undefined) {
				filter.$filter.equals.Country = entity.Country;
			}
			if (entity.City !== undefined) {
				filter.$filter.equals.City = entity.City;
			}
			if (entity.PostalCode) {
				filter.$filter.contains.PostalCode = entity.PostalCode;
			}
			if (entity.Email) {
				filter.$filter.contains.Email = entity.Email;
			}
			if (entity.PhoneNumber) {
				filter.$filter.contains.PhoneNumber = entity.PhoneNumber;
			}
			messageHub.postMessage("entitySearch", {
				entity: entity,
				filter: filter
			});
			$scope.cancel();
		};

		$scope.resetFilter = function () {
			$scope.entity = {};
			$scope.filter();
		};

		$scope.cancel = function () {
			messageHub.closeDialogWindow("Contact-filter");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);