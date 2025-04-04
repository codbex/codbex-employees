angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-employees.Employees.Employee';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts";
	}])
	.controller('PageController', ['$scope',  '$http', 'messageHub', 'ViewParameters', 'entityApi', function ($scope,  $http, messageHub, ViewParameters, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "Employee Details",
			create: "Create Employee",
			update: "Update Employee"
		};
		$scope.action = 'select';

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			if (params.entity.BirthDate) {
				params.entity.BirthDate = new Date(params.entity.BirthDate);
			}
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsGender = params.optionsGender;
			$scope.optionsNationality = params.optionsNationality;
			$scope.optionsMartialStatus = params.optionsMartialStatus;
		}

		$scope.create = function () {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.create(entity).then(function (response) {
				if (response.status != 201) {
					$scope.errorMessage = `Unable to create Employee: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("Employee", "Employee successfully created");
			});
		};

		$scope.update = function () {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.update(id, entity).then(function (response) {
				if (response.status != 200) {
					$scope.errorMessage = `Unable to update Employee: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("Employee", "Employee successfully updated");
			});
		};

		$scope.serviceGender = "/services/ts/codbex-employees/gen/codbex-employees/api/EmployeesSettings/GenderService.ts";
		
		$scope.optionsGender = [];
		
		$http.get("/services/ts/codbex-employees/gen/codbex-employees/api/EmployeesSettings/GenderService.ts").then(function (response) {
			$scope.optionsGender = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.serviceNationality = "/services/ts/codbex-countries/gen/codbex-countries/api/Countries/CountryService.ts";
		
		$scope.optionsNationality = [];
		
		$http.get("/services/ts/codbex-countries/gen/codbex-countries/api/Countries/CountryService.ts").then(function (response) {
			$scope.optionsNationality = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.serviceMartialStatus = "/services/ts/codbex-employees/gen/codbex-employees/api/EmployeesSettings/MartialStatusService.ts";
		
		$scope.optionsMartialStatus = [];
		
		$http.get("/services/ts/codbex-employees/gen/codbex-employees/api/EmployeesSettings/MartialStatusService.ts").then(function (response) {
			$scope.optionsMartialStatus = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$scope.cancel = function () {
			$scope.entity = {};
			$scope.action = 'select';
			messageHub.closeDialogWindow("Employee-details");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);