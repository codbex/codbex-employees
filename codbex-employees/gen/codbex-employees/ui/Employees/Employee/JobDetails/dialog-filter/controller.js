angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-employees.Employees.JobDetails';
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', function ($scope, messageHub, ViewParameters) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			if (params?.entity?.HireDateFrom) {
				params.entity.HireDateFrom = new Date(params.entity.HireDateFrom);
			}
			if (params?.entity?.HireDateTo) {
				params.entity.HireDateTo = new Date(params.entity.HireDateTo);
			}
			$scope.entity = params.entity ?? {};
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsDepartment = params.optionsDepartment;
			$scope.optionsJobStatus = params.optionsJobStatus;
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
			if (entity.JobTitle) {
				filter.$filter.contains.JobTitle = entity.JobTitle;
			}
			if (entity.HireDateFrom) {
				filter.$filter.greaterThanOrEqual.HireDate = entity.HireDateFrom;
			}
			if (entity.HireDateTo) {
				filter.$filter.lessThanOrEqual.HireDate = entity.HireDateTo;
			}
			if (entity.Department !== undefined) {
				filter.$filter.equals.Department = entity.Department;
			}
			if (entity.JobStatus !== undefined) {
				filter.$filter.equals.JobStatus = entity.JobStatus;
			}
			if (entity.Employee !== undefined) {
				filter.$filter.equals.Employee = entity.Employee;
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
			messageHub.closeDialogWindow("JobDetails-filter");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);