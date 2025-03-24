angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-employees.Employees.Employee';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts";
	}])
	.controller('PageController', ['$scope',  '$http', 'Extensions', 'messageHub', 'entityApi', function ($scope,  $http, Extensions, messageHub, entityApi) {

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

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-employees-custom-action').then(function (response) {
			$scope.entityActions = response.filter(e => e.perspective === "Employees" && e.view === "Employee" && e.type === "entity");
		});

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

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsGender = [];
				$scope.optionsNationality = [];
				$scope.optionsStatus = [];
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entitySelected", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.BirthDate) {
					msg.data.entity.BirthDate = new Date(msg.data.entity.BirthDate);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsGender = msg.data.optionsGender;
				$scope.optionsNationality = msg.data.optionsNationality;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsGender = msg.data.optionsGender;
				$scope.optionsNationality = msg.data.optionsNationality;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.action = 'create';
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.BirthDate) {
					msg.data.entity.BirthDate = new Date(msg.data.entity.BirthDate);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsGender = msg.data.optionsGender;
				$scope.optionsNationality = msg.data.optionsNationality;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.action = 'update';
			});
		});

		$scope.serviceGender = "/services/ts/codbex-employees/gen/codbex-employees/api/EmployeesSettings/GenderService.ts";
		$scope.serviceNationality = "/services/ts/codbex-countries/gen/codbex-countries/api/Countries/CountryService.ts";
		$scope.serviceStatus = "/services/ts/codbex-employees/gen/codbex-employees/api/EmployeesSettings/MartialStatusService.ts";

		//-----------------Events-------------------//

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("Employee", `Unable to create Employee: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Employee", "Employee successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Employee", `Unable to update Employee: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Employee", "Employee successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};
		
		//-----------------Dialogs-------------------//
		
		$scope.createGender = function () {
			messageHub.showDialogWindow("Gender-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createNationality = function () {
			messageHub.showDialogWindow("Country-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createStatus = function () {
			messageHub.showDialogWindow("MartialStatus-details", {
				action: "create",
				entity: {},
			}, null, false);
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshGender = function () {
			$scope.optionsGender = [];
			$http.get("/services/ts/codbex-employees/gen/codbex-employees/api/EmployeesSettings/GenderService.ts").then(function (response) {
				$scope.optionsGender = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshNationality = function () {
			$scope.optionsNationality = [];
			$http.get("/services/ts/codbex-countries/gen/codbex-countries/api/Countries/CountryService.ts").then(function (response) {
				$scope.optionsNationality = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshStatus = function () {
			$scope.optionsStatus = [];
			$http.get("/services/ts/codbex-employees/gen/codbex-employees/api/EmployeesSettings/MartialStatusService.ts").then(function (response) {
				$scope.optionsStatus = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};

		//----------------Dropdowns-----------------//	
		

	}]);