angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-employees.Employees.Employee';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', 'Extensions', function ($scope, $http, messageHub, entityApi, Extensions) {

		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataOffset = 0;
		$scope.dataLimit = 10;
		$scope.action = "select";

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-employees-custom-action').then(function (response) {
			$scope.pageActions = response.filter(e => e.perspective === "Employees" && e.view === "Employee" && (e.type === "page" || e.type === undefined));
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
		//-----------------Custom Actions-------------------//

		function refreshData() {
			$scope.dataReset = true;
			$scope.dataPage--;
		}

		function resetPagination() {
			$scope.dataReset = true;
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.selectedEntity = null;
				$scope.action = "select";
			});
		});

		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			refreshData();
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
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {};
			}
			$scope.selectedEntity = null;
			entityApi.count(filter).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Employee", `Unable to count Employee: '${response.message}'`);
					return;
				}
				if (response.data) {
					$scope.dataCount = response.data;
				}
				$scope.dataPages = Math.ceil($scope.dataCount / $scope.dataLimit);
				filter.$offset = ($scope.dataPage - 1) * $scope.dataLimit;
				filter.$limit = $scope.dataLimit;
				if ($scope.dataReset) {
					filter.$offset = 0;
					filter.$limit = $scope.dataPage * $scope.dataLimit;
				}

				entityApi.search(filter).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("Employee", `Unable to list/filter Employee: '${response.message}'`);
						return;
					}
					if ($scope.data == null || $scope.dataReset) {
						$scope.data = [];
						$scope.dataReset = false;
					}

					response.data.forEach(e => {
						if (e.BirthDate) {
							e.BirthDate = new Date(e.BirthDate);
						}
					});

					$scope.data = $scope.data.concat(response.data);
					$scope.dataPage++;
				});
			});
		};
		$scope.loadPage($scope.dataPage, $scope.filter);

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.postMessage("entitySelected", {
				entity: entity,
				selectedMainEntityId: entity.Id,
				optionsGender: $scope.optionsGender,
				optionsNationality: $scope.optionsNationality,
				optionsMartialStatus: $scope.optionsMartialStatus,
				optionsContract: $scope.optionsContract,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			$scope.action = "create";

			messageHub.postMessage("createEntity", {
				entity: {},
				optionsGender: $scope.optionsGender,
				optionsNationality: $scope.optionsNationality,
				optionsMartialStatus: $scope.optionsMartialStatus,
				optionsContract: $scope.optionsContract,
			});
		};

		$scope.updateEntity = function () {
			$scope.action = "update";
			messageHub.postMessage("updateEntity", {
				entity: $scope.selectedEntity,
				optionsGender: $scope.optionsGender,
				optionsNationality: $scope.optionsNationality,
				optionsMartialStatus: $scope.optionsMartialStatus,
				optionsContract: $scope.optionsContract,
			});
		};

		$scope.deleteEntity = function () {
			let id = $scope.selectedEntity.Id;
			messageHub.showDialogAsync(
				'Delete Employee?',
				`Are you sure you want to delete Employee? This action cannot be undone.`,
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
							messageHub.showAlertError("Employee", `Unable to delete Employee: '${response.message}'`);
							return;
						}
						refreshData();
						$scope.loadPage($scope.dataPage, $scope.filter);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		$scope.openFilter = function (entity) {
			messageHub.showDialogWindow("Employee-filter", {
				entity: $scope.filterEntity,
				optionsGender: $scope.optionsGender,
				optionsNationality: $scope.optionsNationality,
				optionsMartialStatus: $scope.optionsMartialStatus,
				optionsContract: $scope.optionsContract,
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsGender = [];
		$scope.optionsNationality = [];
		$scope.optionsMartialStatus = [];
		$scope.optionsContract = [];


		$http.get("/services/ts/codbex-employees/gen/codbex-employees/api/EmployeesSettings/GenderService.ts").then(function (response) {
			$scope.optionsGender = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-countries/gen/codbex-countries/api/Countries/CountryService.ts").then(function (response) {
			$scope.optionsNationality = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-employees/gen/codbex-employees/api/EmployeesSettings/MartialStatusService.ts").then(function (response) {
			$scope.optionsMartialStatus = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-contracts/gen/codbex-contracts/api/Contract/ContractService.ts").then(function (response) {
			$scope.optionsContract = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Number
				}
			});
		});

		$scope.optionsGenderValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsGender.length; i++) {
				if ($scope.optionsGender[i].value === optionKey) {
					return $scope.optionsGender[i].text;
				}
			}
			return null;
		};
		$scope.optionsNationalityValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsNationality.length; i++) {
				if ($scope.optionsNationality[i].value === optionKey) {
					return $scope.optionsNationality[i].text;
				}
			}
			return null;
		};
		$scope.optionsMartialStatusValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsMartialStatus.length; i++) {
				if ($scope.optionsMartialStatus[i].value === optionKey) {
					return $scope.optionsMartialStatus[i].text;
				}
			}
			return null;
		};
		$scope.optionsContractValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsContract.length; i++) {
				if ($scope.optionsContract[i].value === optionKey) {
					return $scope.optionsContract[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
