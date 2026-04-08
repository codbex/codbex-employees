angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/ContactController.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'Contact successfully created';
		let propertySuccessfullyUpdated = 'Contact successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'Contact Details',
			create: 'Create Contact',
			update: 'Update Contact'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-employees:codbex-employees-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-employees:codbex-employees-model.defaults.formHeadSelect', { name: '$t(codbex-employees:codbex-employees-model.t.CONTACT)' });
			$scope.formHeaders.create = LocaleService.t('codbex-employees:codbex-employees-model.defaults.formHeadCreate', { name: '$t(codbex-employees:codbex-employees-model.t.CONTACT)' });
			$scope.formHeaders.update = LocaleService.t('codbex-employees:codbex-employees-model.defaults.formHeadUpdate', { name: '$t(codbex-employees:codbex-employees-model.t.CONTACT)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-employees:codbex-employees-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-employees:codbex-employees-model.t.CONTACT)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-employees:codbex-employees-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-employees:codbex-employees-model.t.CONTACT)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;

			if (params.entity.CreatedAt) {
				params.entity.CreatedAt = new Date(params.entity.CreatedAt);
			}
			if (params.entity.UpdatedAt) {
				params.entity.UpdatedAt = new Date(params.entity.UpdatedAt);
			}
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-employees.Employees.Contact.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-employees:codbex-employees-model.t.CONTACT'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-employees:codbex-employees-model.t.CONTACT'),
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToCreate', { name: '$t(codbex-employees:codbex-employees-model.t.CONTACT)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-employees.Employees.Contact.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-employees:codbex-employees-model.t.CONTACT'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-employees:codbex-employees-model.t.CONTACT'),
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToUpdate', { name: '$t(codbex-employees:codbex-employees-model.t.CONTACT)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};


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
			Dialogs.closeWindow({ id: 'Contact-details' });
		};
	});