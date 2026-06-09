angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/java/codbex-employees/gen/codbex_employees/api/employees/AddressController';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'Address successfully created';
		let propertySuccessfullyUpdated = 'Address successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'Address Details',
			create: 'Create Address',
			update: 'Update Address'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-employees:codbex-employees-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-employees:codbex-employees-model.defaults.formHeadSelect', { name: '$t(codbex-employees:codbex-employees-model.t.ADDRESS)' });
			$scope.formHeaders.create = LocaleService.t('codbex-employees:codbex-employees-model.defaults.formHeadCreate', { name: '$t(codbex-employees:codbex-employees-model.t.ADDRESS)' });
			$scope.formHeaders.update = LocaleService.t('codbex-employees:codbex-employees-model.defaults.formHeadUpdate', { name: '$t(codbex-employees:codbex-employees-model.t.ADDRESS)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-employees:codbex-employees-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-employees:codbex-employees-model.t.ADDRESS)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-employees:codbex-employees-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-employees:codbex-employees-model.t.ADDRESS)' });
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
			const optionsCountryMap = new Map();
			params.optionsCountry?.forEach(e => optionsCountryMap.set(e.value, e));
			$scope.optionsCountry = Array.from(optionsCountryMap.values());
			const optionsCityMap = new Map();
			params.optionsCity?.forEach(e => optionsCityMap.set(e.value, e));
			$scope.optionsCity = Array.from(optionsCityMap.values());
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-employees.Employees.Address.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-employees:codbex-employees-model.t.ADDRESS'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-employees:codbex-employees-model.t.ADDRESS'),
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToCreate', { name: '$t(codbex-employees:codbex-employees-model.t.ADDRESS)', message: message }),
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
				Dialogs.postMessage({ topic: 'codbex-employees.Employees.Address.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-employees:codbex-employees-model.t.ADDRESS'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-employees:codbex-employees-model.t.ADDRESS'),
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToUpdate', { name: '$t(codbex-employees:codbex-employees-model.t.ADDRESS)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceCountry = '/services/java/codbex-countries/gen/codbex_countries/api/settings/CountryController';

		const lastSearchValuesCountry = new Set();
		const allValuesCountry = [];
		let loadMoreOptionsCountryCounter = 0;
		$scope.optionsCountryLoading = false;
		$scope.optionsCountryHasMore = true;

		$scope.loadMoreOptionsCountry = () => {
			const limit = 20;
			$scope.optionsCountryLoading = true;
			$http.get(`/services/java/codbex-countries/gen/codbex_countries/api/settings/CountryController?$limit=${limit}&$offset=${++loadMoreOptionsCountryCounter * limit}`)
			.then((response) => {
				const optionValues = allValuesCountry.map(e => e.value);
				const resultValues = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				const newValues = [];
				resultValues.forEach(e => {
					if (!optionValues.includes(e.value)) {
						allValuesCountry.push(e);
						newValues.push(e);
					}
				});
				newValues.forEach(e => {
					if (!$scope.optionsCountry.find(o => o.value === e.value)) {
						$scope.optionsCountry.push(e);
					}
				})
				$scope.optionsCountryHasMore = resultValues.length > 0;
				$scope.optionsCountryLoading = false;
			}, (error) => {
				$scope.optionsCountryLoading = false;
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Country',
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};

		$scope.onOptionsCountryChange = (event) => {
			if (allValuesCountry.length === 0) {
				allValuesCountry.push(...$scope.optionsCountry);
			}
			if (event.originalEvent.target.value === '') {
				allValuesCountry.sort((a, b) => a.text.localeCompare(b.text));
				$scope.optionsCountry = allValuesCountry;
				$scope.optionsCountryHasMore = true;
			} else if (isText(event.which)) {
				$scope.optionsCountryHasMore = false;
				let cacheHit = false;
				Array.from(lastSearchValuesCountry).forEach(e => {
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
						const optionValues = allValuesCountry.map(e => e.value);
						const searchResult = response.data.map(e => ({
							value: e.Id,
							text: e.Name
						}));
						searchResult.forEach(e => {
							if (!optionValues.includes(e.value)) {
								allValuesCountry.push(e);
							}
						});
						$scope.optionsCountry = allValuesCountry.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
					}, (error) => {
						console.error(error);
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: 'Country',
							message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
							type: AlertTypes.Error
						});
					});
					lastSearchValuesCountry.add(event.originalEvent.target.value);
				}
			}
		};

		$scope.serviceCity = '/services/java/codbex-cities/gen/codbex_cities/api/settings/CityController';

		const lastSearchValuesCity = new Set();
		const allValuesCity = [];
		let loadMoreOptionsCityCounter = 0;
		$scope.optionsCityLoading = false;
		$scope.optionsCityHasMore = true;

		$scope.loadMoreOptionsCity = () => {
			const limit = 20;
			$scope.optionsCityLoading = true;
			$http.get(`/services/java/codbex-cities/gen/codbex_cities/api/settings/CityController?$limit=${limit}&$offset=${++loadMoreOptionsCityCounter * limit}`)
			.then((response) => {
				const optionValues = allValuesCity.map(e => e.value);
				const resultValues = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				const newValues = [];
				resultValues.forEach(e => {
					if (!optionValues.includes(e.value)) {
						allValuesCity.push(e);
						newValues.push(e);
					}
				});
				newValues.forEach(e => {
					if (!$scope.optionsCity.find(o => o.value === e.value)) {
						$scope.optionsCity.push(e);
					}
				})
				$scope.optionsCityHasMore = resultValues.length > 0;
				$scope.optionsCityLoading = false;
			}, (error) => {
				$scope.optionsCityLoading = false;
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'City',
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};

		$scope.onOptionsCityChange = (event) => {
			if (allValuesCity.length === 0) {
				allValuesCity.push(...$scope.optionsCity);
			}
			if (event.originalEvent.target.value === '') {
				allValuesCity.sort((a, b) => a.text.localeCompare(b.text));
				$scope.optionsCity = allValuesCity;
				$scope.optionsCityHasMore = true;
			} else if (isText(event.which)) {
				$scope.optionsCityHasMore = false;
				let cacheHit = false;
				Array.from(lastSearchValuesCity).forEach(e => {
					if (event.originalEvent.target.value.startsWith(e)) {
						cacheHit = true;
					}
				})
				if (!cacheHit) {
					$http.post('/services/java/codbex-cities/gen/codbex_cities/api/settings/CityController/search', {
						conditions: [
							{ propertyName: 'Name', operator: 'LIKE', value: `${event.originalEvent.target.value}%` }
						]
					}).then((response) => {
						const optionValues = allValuesCity.map(e => e.value);
						const searchResult = response.data.map(e => ({
							value: e.Id,
							text: e.Name
						}));
						searchResult.forEach(e => {
							if (!optionValues.includes(e.value)) {
								allValuesCity.push(e);
							}
						});
						$scope.optionsCity = allValuesCity.filter(e => e.text.toLowerCase().startsWith(event.originalEvent.target.value.toLowerCase()));
					}, (error) => {
						console.error(error);
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: 'City',
							message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
							type: AlertTypes.Error
						});
					});
					lastSearchValuesCity.add(event.originalEvent.target.value);
				}
			}
		};


		function isText(keycode) {
			if ((keycode >= 48 && keycode <= 90) || (keycode >= 96 && keycode <= 111) || (keycode >= 186 && keycode <= 222) || [8, 46, 173].includes(keycode)) return true;
			return false;
		}

		$scope.$watch('entity.Country', function (newValue, oldValue) {
			if (newValue !== undefined && newValue !== null) {
				$http.get($scope.serviceCountry + '/' + newValue).then((response) => {
					let valueFrom = response.data.Id;
					$http.post('/services/java/codbex-cities/gen/codbex_cities/api/settings/CityController/search', {
						conditions: [
							{ propertyName: 'Country', operator: 'EQ', value: valueFrom }
						]
					}).then((response) => {
						$scope.optionsCity = response.data.map(e => ({
							value: e.Id,
							text: e.Name
						}));
						if ($scope.action !== 'select' && newValue !== oldValue) {
							if ($scope.optionsCity.length == 1) {
								$scope.entity.City = $scope.optionsCity[0].value;
							} else {
								$scope.entity.City = undefined;
							}
						}
					}, (error) => {
						console.error(error);
					});
				}, (error) => {
					console.error(error);
				});
			}
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
			Dialogs.closeWindow({ id: 'Address-details' });
		};
	});