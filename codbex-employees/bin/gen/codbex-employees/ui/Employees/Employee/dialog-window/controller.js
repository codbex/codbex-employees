angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/java/codbex-employees/gen/codbex_employees/api/employees/EmployeeController';
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
			if (params.entity.CreatedAt) {
				params.entity.CreatedAt = new Date(params.entity.CreatedAt);
			}
			if (params.entity.UpdatedAt) {
				params.entity.UpdatedAt = new Date(params.entity.UpdatedAt);
			}
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			const optionsNationalityMap = new Map();
			params.optionsNationality?.forEach(e => optionsNationalityMap.set(e.value, e));
			$scope.optionsNationality = Array.from(optionsNationalityMap.values());
			const optionsGenderMap = new Map();
			params.optionsGender?.forEach(e => optionsGenderMap.set(e.value, e));
			$scope.optionsGender = Array.from(optionsGenderMap.values());
			const optionsMartialStatusMap = new Map();
			params.optionsMartialStatus?.forEach(e => optionsMartialStatusMap.set(e.value, e));
			$scope.optionsMartialStatus = Array.from(optionsMartialStatusMap.values());
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

		$scope.serviceNationality = '/services/java/codbex-countries/gen/codbex_countries/api/settings/CountryController';
		
		$scope.optionsNationality = [];
		
		$http.get('/services/java/codbex-countries/gen/codbex_countries/api/settings/CountryController').then((response) => {
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

		const lastSearchValuesNationality = new Set();
		const allValuesNationality = [];
		let loadMoreOptionsNationalityCounter = 0;
		$scope.optionsNationalityLoading = false;
		$scope.optionsNationalityHasMore = true;

		$scope.loadMoreOptionsNationality = () => {
			const limit = 20;
			$scope.optionsNationalityLoading = true;
			$http.get(`/services/java/codbex-countries/gen/codbex_countries/api/settings/CountryController?$limit=${limit}&$offset=${++loadMoreOptionsNationalityCounter * limit}`)
			.then((response) => {
				const optionValues = allValuesNationality.map(e => e.value);
				const resultValues = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				const newValues = [];
				resultValues.forEach(e => {
					if (!optionValues.includes(e.value)) {
						allValuesNationality.push(e);
						newValues.push(e);
					}
				});
				newValues.forEach(e => {
					if (!$scope.optionsNationality.find(o => o.value === e.value)) {
						$scope.optionsNationality.push(e);
					}
				})
				$scope.optionsNationalityHasMore = resultValues.length > 0;
				$scope.optionsNationalityLoading = false;
			}, (error) => {
				$scope.optionsNationalityLoading = false;
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Nationality',
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};

		$scope.onOptionsNationalityChange = (event) => {
			if (allValuesNationality.length === 0) {
				allValuesNationality.push(...$scope.optionsNationality);
			}
			if (event.originalEvent.target.value === '') {
				allValuesNationality.sort((a, b) => a.text.localeCompare(b.text));
				$scope.optionsNationality = allValuesNationality;
				$scope.optionsNationalityHasMore = true;
			} else if (isText(event.which)) {
				$scope.optionsNationalityHasMore = false;
				let cacheHit = false;
				Array.from(lastSearchValuesNationality).forEach(e => {
					if (event.originalEvent.target.value.startsWith(e)) {
						cacheHit = true;
					}
				})
				if (!cacheHit) {
					$http.post('/services/java/codbex-countries/gen/codbex_countries/api/settings/CountryController/search', {
						conditions: [
							{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
						]
					}).then((response) => {
						const optionValues = allValuesNationality.map(e => e.value);
						const searchResult = response.data.map(e => ({
							value: e.Id,
							text: e.Name
						}));
						searchResult.forEach(e => {
							if (!optionValues.includes(e.value)) {
								allValuesNationality.push(e);
							}
						});
						$scope.optionsNationality = allValuesNationality.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
					}, (error) => {
						console.error(error);
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: 'Nationality',
							message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
							type: AlertTypes.Error
						});
					});
					lastSearchValuesNationality.add(event.originalEvent.target.value);
				}
			}
		};
		$scope.serviceGender = '/services/java/codbex-employees/gen/codbex_employees/api/settings/GenderController';
		
		$scope.optionsGender = [];
		
		$http.get('/services/java/codbex-employees/gen/codbex_employees/api/settings/GenderController').then((response) => {
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

		const lastSearchValuesGender = new Set();
		const allValuesGender = [];
		let loadMoreOptionsGenderCounter = 0;
		$scope.optionsGenderLoading = false;
		$scope.optionsGenderHasMore = true;

		$scope.loadMoreOptionsGender = () => {
			const limit = 20;
			$scope.optionsGenderLoading = true;
			$http.get(`/services/java/codbex-employees/gen/codbex_employees/api/settings/GenderController?$limit=${limit}&$offset=${++loadMoreOptionsGenderCounter * limit}`)
			.then((response) => {
				const optionValues = allValuesGender.map(e => e.value);
				const resultValues = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				const newValues = [];
				resultValues.forEach(e => {
					if (!optionValues.includes(e.value)) {
						allValuesGender.push(e);
						newValues.push(e);
					}
				});
				newValues.forEach(e => {
					if (!$scope.optionsGender.find(o => o.value === e.value)) {
						$scope.optionsGender.push(e);
					}
				})
				$scope.optionsGenderHasMore = resultValues.length > 0;
				$scope.optionsGenderLoading = false;
			}, (error) => {
				$scope.optionsGenderLoading = false;
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Gender',
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};

		$scope.onOptionsGenderChange = (event) => {
			if (allValuesGender.length === 0) {
				allValuesGender.push(...$scope.optionsGender);
			}
			if (event.originalEvent.target.value === '') {
				allValuesGender.sort((a, b) => a.text.localeCompare(b.text));
				$scope.optionsGender = allValuesGender;
				$scope.optionsGenderHasMore = true;
			} else if (isText(event.which)) {
				$scope.optionsGenderHasMore = false;
				let cacheHit = false;
				Array.from(lastSearchValuesGender).forEach(e => {
					if (event.originalEvent.target.value.startsWith(e)) {
						cacheHit = true;
					}
				})
				if (!cacheHit) {
					$http.post('/services/java/codbex-employees/gen/codbex_employees/api/settings/GenderController/search', {
						conditions: [
							{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
						]
					}).then((response) => {
						const optionValues = allValuesGender.map(e => e.value);
						const searchResult = response.data.map(e => ({
							value: e.Id,
							text: e.Name
						}));
						searchResult.forEach(e => {
							if (!optionValues.includes(e.value)) {
								allValuesGender.push(e);
							}
						});
						$scope.optionsGender = allValuesGender.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
					}, (error) => {
						console.error(error);
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: 'Gender',
							message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
							type: AlertTypes.Error
						});
					});
					lastSearchValuesGender.add(event.originalEvent.target.value);
				}
			}
		};
		$scope.serviceMartialStatus = '/services/java/codbex-employees/gen/codbex_employees/api/settings/MartialStatusController';
		
		$scope.optionsMartialStatus = [];
		
		$http.get('/services/java/codbex-employees/gen/codbex_employees/api/settings/MartialStatusController').then((response) => {
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

		const lastSearchValuesMartialStatus = new Set();
		const allValuesMartialStatus = [];
		let loadMoreOptionsMartialStatusCounter = 0;
		$scope.optionsMartialStatusLoading = false;
		$scope.optionsMartialStatusHasMore = true;

		$scope.loadMoreOptionsMartialStatus = () => {
			const limit = 20;
			$scope.optionsMartialStatusLoading = true;
			$http.get(`/services/java/codbex-employees/gen/codbex_employees/api/settings/MartialStatusController?$limit=${limit}&$offset=${++loadMoreOptionsMartialStatusCounter * limit}`)
			.then((response) => {
				const optionValues = allValuesMartialStatus.map(e => e.value);
				const resultValues = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				const newValues = [];
				resultValues.forEach(e => {
					if (!optionValues.includes(e.value)) {
						allValuesMartialStatus.push(e);
						newValues.push(e);
					}
				});
				newValues.forEach(e => {
					if (!$scope.optionsMartialStatus.find(o => o.value === e.value)) {
						$scope.optionsMartialStatus.push(e);
					}
				})
				$scope.optionsMartialStatusHasMore = resultValues.length > 0;
				$scope.optionsMartialStatusLoading = false;
			}, (error) => {
				$scope.optionsMartialStatusLoading = false;
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'MartialStatus',
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};

		$scope.onOptionsMartialStatusChange = (event) => {
			if (allValuesMartialStatus.length === 0) {
				allValuesMartialStatus.push(...$scope.optionsMartialStatus);
			}
			if (event.originalEvent.target.value === '') {
				allValuesMartialStatus.sort((a, b) => a.text.localeCompare(b.text));
				$scope.optionsMartialStatus = allValuesMartialStatus;
				$scope.optionsMartialStatusHasMore = true;
			} else if (isText(event.which)) {
				$scope.optionsMartialStatusHasMore = false;
				let cacheHit = false;
				Array.from(lastSearchValuesMartialStatus).forEach(e => {
					if (event.originalEvent.target.value.startsWith(e)) {
						cacheHit = true;
					}
				})
				if (!cacheHit) {
					$http.post('/services/java/codbex-employees/gen/codbex_employees/api/settings/MartialStatusController/search', {
						conditions: [
							{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
						]
					}).then((response) => {
						const optionValues = allValuesMartialStatus.map(e => e.value);
						const searchResult = response.data.map(e => ({
							value: e.Id,
							text: e.Name
						}));
						searchResult.forEach(e => {
							if (!optionValues.includes(e.value)) {
								allValuesMartialStatus.push(e);
							}
						});
						$scope.optionsMartialStatus = allValuesMartialStatus.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
					}, (error) => {
						console.error(error);
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: 'MartialStatus',
							message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
							type: AlertTypes.Error
						});
					});
					lastSearchValuesMartialStatus.add(event.originalEvent.target.value);
				}
			}
		};
	function isText(keycode) {
		if ((keycode >= 48 && keycode <= 90) || (keycode >= 96 && keycode <= 111) || (keycode >= 186 && keycode <= 222) || [8, 46, 173].includes(keycode)) return true;
		return false;
	}


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