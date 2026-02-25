angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeController.ts';
	}])
	.controller('PageController', ($scope, $http, Extensions, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'Employee successfully created';
		let propertySuccessfullyUpdated = 'Employee successfully updated';
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

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-employees:codbex-employees-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-employees:codbex-employees-model.defaults.formHeadSelect', { name: '$t(codbex-employees:codbex-employees-model.t.EMPLOYEE)' });
			$scope.formHeaders.create = LocaleService.t('codbex-employees:codbex-employees-model.defaults.formHeadCreate', { name: '$t(codbex-employees:codbex-employees-model.t.EMPLOYEE)' });
			$scope.formHeaders.update = LocaleService.t('codbex-employees:codbex-employees-model.defaults.formHeadUpdate', { name: '$t(codbex-employees:codbex-employees-model.t.EMPLOYEE)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-employees:codbex-employees-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-employees:codbex-employees-model.t.EMPLOYEE)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-employees:codbex-employees-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-employees:codbex-employees-model.t.EMPLOYEE)' });
		});

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-employees-custom-action']).then((response) => {
			$scope.entityActions = response.data.filter(e => e.perspective === 'Employees' && e.view === 'Employee' && e.type === 'entity');
		});

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
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
				$scope.optionsNationality = [];
				$scope.optionsGender = [];
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
				$scope.optionsNationality = data.optionsNationality;
				$scope.optionsGender = data.optionsGender;
				$scope.optionsMartialStatus = data.optionsMartialStatus;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-employees.Employees.Employee.createEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsNationality = data.optionsNationality;
				$scope.optionsGender = data.optionsGender;
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
				$scope.optionsNationality = data.optionsNationality;
				$scope.optionsGender = data.optionsGender;
				$scope.optionsMartialStatus = data.optionsMartialStatus;
				$scope.action = 'update';
			});
		}});

		$scope.serviceNationality = '/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryController.ts';
		$scope.serviceGender = '/services/ts/codbex-employees/gen/codbex-employees/api/Settings/GenderController.ts';
		$scope.serviceMartialStatus = '/services/ts/codbex-employees/gen/codbex-employees/api/Settings/MartialStatusController.ts';

		//-----------------Events-------------------//

		$scope.create = () => {
			EntityService.create($scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-employees.Employees.Employee.entityCreated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-employees.Employees.Employee.clearDetails' , data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-employees:codbex-employees-model.t.EMPLOYEE'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-employees:codbex-employees-model.t.EMPLOYEE'),
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToCreate', { name: '$t(codbex-employees:codbex-employees-model.t.EMPLOYEE)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			EntityService.update($scope.entity.Id, $scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-employees.Employees.Employee.entityUpdated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-employees.Employees.Employee.clearDetails', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-employees:codbex-employees-model.t.EMPLOYEE'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-employees:codbex-employees-model.t.EMPLOYEE'),
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToCreate', { name: '$t(codbex-employees:codbex-employees-model.t.EMPLOYEE)', message: message }),
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
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
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

		$scope.refreshNationality = () => {
			$scope.optionsNationality = [];
			$http.get('/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryController.ts').then((response) => {
				$scope.optionsNationality = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Nationality',
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshGender = () => {
			$scope.optionsGender = [];
			$http.get('/services/ts/codbex-employees/gen/codbex-employees/api/Settings/GenderController.ts').then((response) => {
				$scope.optionsGender = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Gender',
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshMartialStatus = () => {
			$scope.optionsMartialStatus = [];
			$http.get('/services/ts/codbex-employees/gen/codbex-employees/api/Settings/MartialStatusController.ts').then((response) => {
				$scope.optionsMartialStatus = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'MartialStatus',
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};

		//----------------Dropdowns-----------------//	
	});