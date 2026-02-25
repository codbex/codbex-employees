angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeController.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
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

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			if (params.entity.BirthDate) {
				params.entity.BirthDate = new Date(params.entity.BirthDate);
			}
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsNationality = params.optionsNationality;
			$scope.optionsGender = params.optionsGender;
			$scope.optionsMartialStatus = params.optionsMartialStatus;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-employees.Employees.Employee.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-employees:codbex-employees-model.t.EMPLOYEE'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToCreate', { name: '$t(codbex-employees:codbex-employees-model.t.EMPLOYEE)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-employees.Employees.Employee.entityUpdated', data: response.data });
				$scope.cancel();
				Notifications.show({
					title: LocaleService.t('codbex-employees:codbex-employees-model.t.EMPLOYEE'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToUpdate', { name: '$t(codbex-employees:codbex-employees-model.t.EMPLOYEE)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceNationality = '/services/ts/codbex-countries/gen/codbex-countries/api/Settings/CountryController.ts';
		
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
		$scope.serviceGender = '/services/ts/codbex-employees/gen/codbex-employees/api/Settings/GenderController.ts';
		
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
		$scope.serviceMartialStatus = '/services/ts/codbex-employees/gen/codbex-employees/api/Settings/MartialStatusController.ts';
		
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

		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};

		$scope.cancel = () => {
			$scope.entity = {};
			$scope.action = 'select';
			Dialogs.closeWindow({ id: 'Employee-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});