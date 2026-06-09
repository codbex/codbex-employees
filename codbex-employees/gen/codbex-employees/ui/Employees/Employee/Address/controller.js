angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/java/codbex-employees/gen/codbex_employees/api/employees/AddressController';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions, LocaleService, ButtonStates) => {
		const Dialogs = new DialogHub();
		let translated = {
			yes: 'Yes',
			no: 'No',
			deleteConfirm: 'Are you sure you want to delete Address? This action cannot be undone.',
			deleteTitle: 'Delete Address?'
		};

		LocaleService.onInit(() => {
			translated.yes = LocaleService.t('codbex-employees:codbex-employees-model.defaults.yes');
			translated.no = LocaleService.t('codbex-employees:codbex-employees-model.defaults.no');
			translated.deleteTitle = LocaleService.t('codbex-employees:codbex-employees-model.defaults.deleteTitle', { name: '$t(codbex-employees:codbex-employees-model.t.ADDRESS)' });
			translated.deleteConfirm = LocaleService.t('codbex-employees:codbex-employees-model.messages.deleteConfirm', { name: '$t(codbex-employees:codbex-employees-model.t.ADDRESS)' });
		});
		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-employees-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'Employees' && e.view === 'Address' && (e.type === 'page' || e.type === undefined));
			$scope.entityActions = response.data.filter(e => e.perspective === 'Employees' && e.view === 'Address' && e.type === 'entity');
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					selectedMainEntityKey: 'Employee',
					selectedMainEntityId: $scope.selectedMainEntityId,
				},
				maxWidth: action.maxWidth,
				maxHeight: action.maxHeight,
				closeButton: true
			});
		};

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					id: $scope.entity.Id,
					selectedMainEntityKey: 'Employee',
					selectedMainEntityId: $scope.selectedMainEntityId,
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}
		resetPagination();

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-employees.Employees.Employee.entitySelected', handler: (data) => {
			resetPagination();
			$scope.selectedMainEntityId = data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-employees.Employees.Employee.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				resetPagination();
				$scope.selectedMainEntityId = null;
				$scope.data = null;
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-employees.Employees.Address.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-employees.Employees.Address.entityCreated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-employees.Employees.Address.entityUpdated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-employees.Employees.Address.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			let Employee = $scope.selectedMainEntityId;
			$scope.dataPage = pageNumber;
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {
					$filter: {
						conditions: []
					}
				};
			}
			filter.$filter.conditions.push({ propertyName: 'Employee', operator: 'EQ', value: Employee });
			EntityService.count(filter).then((resp) => {
				if (resp.data) {
					$scope.dataCount = resp.data.count;
				}
				filter.$filter.offset = (pageNumber - 1) * $scope.dataLimit;
				filter.$filter.limit = $scope.dataLimit;
				EntityService.search(filter).then((response) => {
					if (optionsCountryHasMore) {
						const optionsCountrySearchValues = Array.from(new Set(response.data.map(e => e.Country)));
						if (optionsCountrySearchValues.length > 0) {
							$http.post('/services/java/codbex-countries/gen/codbex_countries/api/settings/CountryController/search', {
								conditions: [
									{ propertyName: 'Id', operator: 'IN', value: optionsCountrySearchValues }
								]
							}).then((response) => {
								$scope.optionsCountry.push(...response.data.map(e => ({
									value: e.Id,
									text: e.Name
								})));
							}, (error) => {
								console.error(error);
								const message = error.data ? error.data.message : '';
								Dialogs.showAlert({
									title: 'Country',
									message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
									type: AlertTypes.Error
								});
							});
						}
					}
					if (optionsCityHasMore) {
						const optionsCitySearchValues = Array.from(new Set(response.data.map(e => e.City)));
						if (optionsCitySearchValues.length > 0) {
							$http.post('/services/java/codbex-cities/gen/codbex_cities/api/settings/CityController/search', {
								conditions: [
									{ propertyName: 'Id', operator: 'IN', value: optionsCitySearchValues }
								]
							}).then((response) => {
								$scope.optionsCity.push(...response.data.map(e => ({
									value: e.Id,
									text: e.Name
								})));
							}, (error) => {
								console.error(error);
								const message = error.data ? error.data.message : '';
								Dialogs.showAlert({
									title: 'City',
									message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
									type: AlertTypes.Error
								});
							});
						}
					}
					response.data.forEach(e => {
						if (e.CreatedAt) {
							e.CreatedAt = new Date(e.CreatedAt);
						}
						if (e.UpdatedAt) {
							e.UpdatedAt = new Date(e.UpdatedAt);
						}
					});

					$scope.data = response.data;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: LocaleService.t('codbex-employees:codbex-employees-model.t.ADDRESS'),
						message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLF', { name: '$t(codbex-employees:codbex-employees-model.t.ADDRESS)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-employees:codbex-employees-model.t.ADDRESS'),
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToCount', { name: '$t(codbex-employees:codbex-employees-model.t.ADDRESS)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.selectEntity = (entity) => {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = (entity) => {
			$scope.selectedEntity = entity;
			Dialogs.showWindow({
				id: 'Address-details',
				params: {
					action: 'select',
					entity: entity,
					optionsCountry: $scope.optionsCountry,
					optionsCity: $scope.optionsCity,
				},
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'Address-filter',
				params: {
					entity: $scope.filterEntity,
					optionsCountry: $scope.optionsCountry,
					optionsCity: $scope.optionsCity,
				},
			});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			Dialogs.showWindow({
				id: 'Address-details',
				params: {
					action: 'create',
					entity: {
						'Employee': $scope.selectedMainEntityId
					},
					selectedMainEntityKey: 'Employee',
					selectedMainEntityId: $scope.selectedMainEntityId,
					optionsCountry: $scope.optionsCountry,
					optionsCity: $scope.optionsCity,
				},
				closeButton: false
			});
		};

		$scope.updateEntity = (entity) => {
			Dialogs.showWindow({
				id: 'Address-details',
				params: {
					action: 'update',
					entity: entity,
					selectedMainEntityKey: 'Employee',
					selectedMainEntityId: $scope.selectedMainEntityId,
					optionsCountry: $scope.optionsCountry,
					optionsCity: $scope.optionsCity,
			},
				closeButton: false
			});
		};

		$scope.deleteEntity = (entity) => {
			let id = entity.Id;
			Dialogs.showDialog({
				title: translated.deleteTitle,
				message: translated.deleteConfirm,
				buttons: [{
					id: 'delete-btn-yes',
					state: ButtonStates.Emphasized,
					label: translated.yes,
				}, {
					id: 'delete-btn-no',
					label: translated.no,
				}],
				closeButton: false
			}).then((buttonId) => {
				if (buttonId === 'delete-btn-yes') {
					EntityService.delete(id).then(() => {
						$scope.loadPage($scope.dataPage, $scope.filter);
						Dialogs.triggerEvent('codbex-employees.Employees.Address.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: LocaleService.t('codbex-employees:codbex-employees-model.t.ADDRESS'),
							message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToDelete', { name: '$t(codbex-employees:codbex-employees-model.t.ADDRESS)', message: message }),
							type: AlertTypes.Error,
						});
						console.error('EntityService:', error);
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsCountry = [];
		$scope.optionsCity = [];

		let optionsCountryHasMore = true;

		$http.get('/services/java/codbex-countries/gen/codbex_countries/api/settings/CountryController/count').then((response) => {
			const optionsCountryCount = response.data.count;
			$http.get('/services/java/codbex-countries/gen/codbex_countries/api/settings/CountryController').then((response) => {
				$scope.optionsCountry = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				optionsCountryHasMore = optionsCountryCount > $scope.optionsCountry.length;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Country',
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Country',
				message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		let optionsCityHasMore = true;

		$http.get('/services/java/codbex-cities/gen/codbex_cities/api/settings/CityController/count').then((response) => {
			const optionsCityCount = response.data.count;
			$http.get('/services/java/codbex-cities/gen/codbex_cities/api/settings/CityController').then((response) => {
				$scope.optionsCity = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				optionsCityHasMore = optionsCityCount > $scope.optionsCity.length;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'City',
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'City',
				message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$scope.optionsCountryValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsCountry.length; i++) {
				if ($scope.optionsCountry[i].value === optionKey) {
					return $scope.optionsCountry[i].text;
				}
			}
			return null;
		};
		$scope.optionsCityValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsCity.length; i++) {
				if ($scope.optionsCity[i].value === optionKey) {
					return $scope.optionsCity[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//
	});
