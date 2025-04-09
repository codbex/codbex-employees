angular.module('page', ['blimpKit', 'platformView', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts';
	}])
	.controller('PageController', ($scope, $http, Extensions, EntityService) => {
		const Dialogs = new DialogHub();
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'Employee Details',
			create: 'Create Employee',
			update: 'Update Employee'
		};
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-employees-custom-action']).then((response) => {
			$scope.entityActions = response.data.filter(e => e.perspective === 'Employees' && e.view === 'Employee' && e.type === 'entity');
		});

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: action.label,
				path: action.path,
				params: {
					id: $scope.entity.Id
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-employees.Employees.Employee.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsGender = [];
				$scope.optionsNationality = [];
				$scope.optionsMartialStatus = [];
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-employees.Employees.Employee.entitySelected', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.BirthDate) {
					data.entity.BirthDate = new Date(data.entity.BirthDate);
				}
				$scope.entity = data.entity;
				$scope.optionsGender = data.optionsGender;
				$scope.optionsNationality = data.optionsNationality;
				$scope.optionsMartialStatus = data.optionsMartialStatus;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-employees.Employees.Employee.createEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsGender = data.optionsGender;
				$scope.optionsNationality = data.optionsNationality;
				$scope.optionsMartialStatus = data.optionsMartialStatus;
				$scope.action = 'create';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-employees.Employees.Employee.updateEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.BirthDate) {
					data.entity.BirthDate = new Date(data.entity.BirthDate);
				}
				$scope.entity = data.entity;
				$scope.optionsGender = data.optionsGender;
				$scope.optionsNationality = data.optionsNationality;
				$scope.optionsMartialStatus = data.optionsMartialStatus;
				$scope.action = 'update';
			});
		}});

		$scope.serviceGender = '/services/ts/codbex-employees/gen/codbex-employees/api/Settings/GenderService.ts';
		$scope.serviceNationality = '/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryService.ts';
		$scope.serviceMartialStatus = '/services/ts/codbex-employees/gen/codbex-employees/api/Settings/MartialStatusService.ts';

		//-----------------Events-------------------//

		$scope.create = () => {
			EntityService.create($scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-employees.Employees.Employee.entityCreated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-employees.Employees.Employee.clearDetails' , data: response.data });
				Dialogs.showAlert({
					title: 'Employee',
					message: 'Employee successfully created',
					type: AlertTypes.Success
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Employee',
					message: `Unable to create Employee: '${message}'`,
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			EntityService.update($scope.entity.Id, $scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-employees.Employees.Employee.entityUpdated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-employees.Employees.Employee.clearDetails', data: response.data });
				Dialogs.showAlert({
					title: 'Employee',
					message: 'Employee successfully updated',
					type: AlertTypes.Success
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Employee',
					message: `Unable to create Employee: '${message}'`,
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.cancel = () => {
			Dialogs.triggerEvent('codbex-employees.Employees.Employee.clearDetails');
		};
		
		//-----------------Dialogs-------------------//
		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: 'Description',
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};
		
		$scope.createGender = () => {
			Dialogs.showWindow({
				id: 'Gender-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createNationality = () => {
			Dialogs.showWindow({
				id: 'Country-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createMartialStatus = () => {
			Dialogs.showWindow({
				id: 'MartialStatus-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshGender = () => {
			$scope.optionsGender = [];
			$http.get('/services/ts/codbex-employees/gen/codbex-employees/api/Settings/GenderService.ts').then((response) => {
				$scope.optionsGender = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Gender',
					message: `Unable to load data: '${message}'`,
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshNationality = () => {
			$scope.optionsNationality = [];
			$http.get('/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryService.ts').then((response) => {
				$scope.optionsNationality = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Nationality',
					message: `Unable to load data: '${message}'`,
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshMartialStatus = () => {
			$scope.optionsMartialStatus = [];
			$http.get('/services/ts/codbex-employees/gen/codbex-employees/api/Settings/MartialStatusService.ts').then((response) => {
				$scope.optionsMartialStatus = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'MartialStatus',
					message: `Unable to load data: '${message}'`,
					type: AlertTypes.Error
				});
			});
		};

		//----------------Dropdowns-----------------//	
	});