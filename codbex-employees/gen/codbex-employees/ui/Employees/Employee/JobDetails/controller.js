angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-employees.Employees.JobDetails';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-employees/gen/codbex-employees/api/Employees/JobDetailsService.ts";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', 'Extensions', function ($scope, $http, messageHub, entityApi, Extensions) {
		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-employees-custom-action').then(function (response) {
			$scope.pageActions = response.filter(e => e.perspective === "Employees" && e.view === "JobDetails" && (e.type === "page" || e.type === undefined));
			$scope.entityActions = response.filter(e => e.perspective === "Employees" && e.view === "JobDetails" && e.type === "entity");
		});

		$scope.triggerPageAction = function (action) {
			messageHub.showDialogWindow(
				action.id,
				{},
				null,
				true,
				action
			);
		};

		$scope.triggerEntityAction = function (action) {
			messageHub.showDialogWindow(
				action.id,
				{
					id: $scope.entity.Id
				},
				null,
				true,
				action
			);
		};
		//-----------------Custom Actions-------------------//

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("codbex-employees.Employees.Employee.entitySelected", function (msg) {
			resetPagination();
			$scope.selectedMainEntityId = msg.data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}, true);

		messageHub.onDidReceiveMessage("codbex-employees.Employees.Employee.clearDetails", function (msg) {
			$scope.$apply(function () {
				resetPagination();
				$scope.selectedMainEntityId = null;
				$scope.data = null;
			});
		}, true);

		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entitySearch", function (msg) {
			resetPagination();
			$scope.filter = msg.data.filter;
			$scope.filterEntity = msg.data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber, filter) {
			let Employee = $scope.selectedMainEntityId;
			$scope.dataPage = pageNumber;
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {};
			}
			if (!filter.$filter) {
				filter.$filter = {};
			}
			if (!filter.$filter.equals) {
				filter.$filter.equals = {};
			}
			filter.$filter.equals.Employee = Employee;
			entityApi.count(filter).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("JobDetails", `Unable to count JobDetails: '${response.message}'`);
					return;
				}
				if (response.data) {
					$scope.dataCount = response.data;
				}
				filter.$offset = (pageNumber - 1) * $scope.dataLimit;
				filter.$limit = $scope.dataLimit;
				entityApi.search(filter).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("JobDetails", `Unable to list/filter JobDetails: '${response.message}'`);
						return;
					}

					response.data.forEach(e => {
						if (e.HireDate) {
							e.HireDate = new Date(e.HireDate);
						}
					});

					$scope.data = response.data;
				});
			});
		};

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.showDialogWindow("JobDetails-details", {
				action: "select",
				entity: entity,
				optionsDepartment: $scope.optionsDepartment,
				optionsJobStatus: $scope.optionsJobStatus,
			});
		};

		$scope.openFilter = function (entity) {
			messageHub.showDialogWindow("JobDetails-filter", {
				entity: $scope.filterEntity,
				optionsDepartment: $scope.optionsDepartment,
				optionsJobStatus: $scope.optionsJobStatus,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("JobDetails-details", {
				action: "create",
				entity: {},
				selectedMainEntityKey: "Employee",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsDepartment: $scope.optionsDepartment,
				optionsJobStatus: $scope.optionsJobStatus,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("JobDetails-details", {
				action: "update",
				entity: entity,
				selectedMainEntityKey: "Employee",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsDepartment: $scope.optionsDepartment,
				optionsJobStatus: $scope.optionsJobStatus,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete JobDetails?',
				`Are you sure you want to delete JobDetails? This action cannot be undone.`,
				[{
					id: "delete-btn-yes",
					type: "emphasized",
					label: "Yes",
				},
				{
					id: "delete-btn-no",
					type: "normal",
					label: "No",
				}],
			).then(function (msg) {
				if (msg.data === "delete-btn-yes") {
					entityApi.delete(id).then(function (response) {
						if (response.status != 204) {
							messageHub.showAlertError("JobDetails", `Unable to delete JobDetails: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage, $scope.filter);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsDepartment = [];
		$scope.optionsJobStatus = [];


		$http.get("/services/ts/codbex-employees/gen/codbex-employees/api/entities/undefinedService.ts").then(function (response) {
			$scope.optionsDepartment = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-employees/gen/codbex-employees/api/entities/undefinedService.ts").then(function (response) {
			$scope.optionsJobStatus = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$scope.optionsDepartmentValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsDepartment.length; i++) {
				if ($scope.optionsDepartment[i].value === optionKey) {
					return $scope.optionsDepartment[i].text;
				}
			}
			return null;
		};
		$scope.optionsJobStatusValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsJobStatus.length; i++) {
				if ($scope.optionsJobStatus[i].value === optionKey) {
					return $scope.optionsJobStatus[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
