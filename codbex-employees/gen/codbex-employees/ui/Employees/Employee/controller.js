angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/java/codbex-employees/gen/codbex_employees/api/employees/EmployeeController';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions, LocaleService, ButtonStates) => {
		const Dialogs = new DialogHub();
		let translated = {
			yes: 'Yes',
			no: 'No',
			deleteConfirm: 'Are you sure you want to delete Employee? This action cannot be undone.',
			deleteTitle: 'Delete Employee?'
		};

		LocaleService.onInit(() => {
			translated.yes = LocaleService.t('codbex-employees:codbex-employees-model.defaults.yes');
			translated.no = LocaleService.t('codbex-employees:codbex-employees-model.defaults.no');
			translated.deleteTitle = LocaleService.t('codbex-employees:codbex-employees-model.defaults.deleteTitle', { name: '$t(codbex-employees:codbex-employees-model.t.EMPLOYEE)' });
			translated.deleteConfirm = LocaleService.t('codbex-employees:codbex-employees-model.messages.deleteConfirm', { name: '$t(codbex-employees:codbex-employees-model.t.EMPLOYEE)' });
		});
		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataOffset = 0;
		$scope.dataLimit = 10;
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-employees-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'Employees' && e.view === 'Employee' && (e.type === 'page' || e.type === undefined));
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				maxWidth: action.maxWidth,
				maxHeight: action.maxHeight,
				closeButton: true
			});
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
		Dialogs.addMessageListener({ topic: 'codbex-employees.Employees.Employee.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.selectedEntity = null;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-employees.Employees.Employee.entityCreated', handler: () => {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-employees.Employees.Employee.entityUpdated', handler: () => {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-employees.Employees.Employee.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {
					$filter: {}
				};
			}
			$scope.selectedEntity = null;
			EntityService.count(filter).then((resp) => {
				if (resp.data) {
					$scope.dataCount = resp.data.count;
				}
				$scope.dataPages = Math.ceil($scope.dataCount / $scope.dataLimit);
				filter.$filter.offset = ($scope.dataPage - 1) * $scope.dataLimit;
				filter.$filter.limit = $scope.dataLimit;
				if ($scope.dataReset) {
					filter.$filter.offset = 0;
					filter.$filter.limit = $scope.dataPage * $scope.dataLimit;
				}

				EntityService.search(filter).then((response) => {
					if ($scope.data == null || $scope.dataReset) {
						$scope.data = [];
						$scope.dataReset = false;
					}
					if (optionsNationalityHasMore) {
						const optionsNationalitySearchValues = Array.from(new Set(response.data.map(e => e.Nationality)));
						if (optionsNationalitySearchValues.length > 0) {
							$http.post('/services/java/codbex-countries/gen/codbex_countries/api/settings/CountryController/search', {
								conditions: [
									{ propertyName: 'Id', operator: 'IN', value: optionsNationalitySearchValues }
								]
							}).then((response) => {
								$scope.optionsNationality.push(...response.data.map(e => ({
									value: e.Id,
									text: e.Name
								})));
							}, (error) => {
								console.error(error);
								const message = error.data ? error.data.message : '';
								Dialogs.showAlert({
									title: 'Nationality',
									message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
									type: AlertTypes.Error
								});
							});
						}
					}
					if (optionsGenderHasMore) {
						const optionsGenderSearchValues = Array.from(new Set(response.data.map(e => e.Gender)));
						if (optionsGenderSearchValues.length > 0) {
							$http.post('/services/java/codbex-employees/gen/codbex_employees/api/settings/GenderController/search', {
								conditions: [
									{ propertyName: 'Id', operator: 'IN', value: optionsGenderSearchValues }
								]
							}).then((response) => {
								$scope.optionsGender.push(...response.data.map(e => ({
									value: e.Id,
									text: e.Name
								})));
							}, (error) => {
								console.error(error);
								const message = error.data ? error.data.message : '';
								Dialogs.showAlert({
									title: 'Gender',
									message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
									type: AlertTypes.Error
								});
							});
						}
					}
					if (optionsMartialStatusHasMore) {
						const optionsMartialStatusSearchValues = Array.from(new Set(response.data.map(e => e.MartialStatus)));
						if (optionsMartialStatusSearchValues.length > 0) {
							$http.post('/services/java/codbex-employees/gen/codbex_employees/api/settings/MartialStatusController/search', {
								conditions: [
									{ propertyName: 'Id', operator: 'IN', value: optionsMartialStatusSearchValues }
								]
							}).then((response) => {
								$scope.optionsMartialStatus.push(...response.data.map(e => ({
									value: e.Id,
									text: e.Name
								})));
							}, (error) => {
								console.error(error);
								const message = error.data ? error.data.message : '';
								Dialogs.showAlert({
									title: 'MartialStatus',
									message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
									type: AlertTypes.Error
								});
							});
						}
					}
					response.data.forEach(e => {
						if (e.BirthDate) {
							e.BirthDate = new Date(e.BirthDate);
						}
						if (e.CreatedAt) {
							e.CreatedAt = new Date(e.CreatedAt);
						}
						if (e.UpdatedAt) {
							e.UpdatedAt = new Date(e.UpdatedAt);
						}
					});

					$scope.data = $scope.data.concat(response.data);
					$scope.dataPage++;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: LocaleService.t('codbex-employees:codbex-employees-model.t.EMPLOYEE'),
						message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLF', { name: '$t(codbex-employees:codbex-employees-model.t.EMPLOYEE)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-employees:codbex-employees-model.t.EMPLOYEE'),
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToCount', { name: '$t(codbex-employees:codbex-employees-model.t.EMPLOYEE)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};
		$scope.loadPage($scope.dataPage, $scope.filter);

		$scope.selectEntity = (entity) => {
			$scope.selectedEntity = entity;
			Dialogs.postMessage({ topic: 'codbex-employees.Employees.Employee.entitySelected', data: {
				entity: entity,
				selectedMainEntityId: entity.Id,
				optionsNationality: $scope.optionsNationality,
				optionsGender: $scope.optionsGender,
				optionsMartialStatus: $scope.optionsMartialStatus,
			}});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			$scope.action = 'create';

			Dialogs.postMessage({ topic: 'codbex-employees.Employees.Employee.createEntity', data: {
				entity: {},
				optionsNationality: $scope.optionsNationality,
				optionsGender: $scope.optionsGender,
				optionsMartialStatus: $scope.optionsMartialStatus,
			}});
		};

		$scope.updateEntity = () => {
			$scope.action = 'update';
			Dialogs.postMessage({ topic: 'codbex-employees.Employees.Employee.updateEntity', data: {
				entity: $scope.selectedEntity,
				optionsNationality: $scope.optionsNationality,
				optionsGender: $scope.optionsGender,
				optionsMartialStatus: $scope.optionsMartialStatus,
			}});
		};

		$scope.deleteEntity = () => {
			let id = $scope.selectedEntity.Id;
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
						refreshData();
						$scope.loadPage($scope.dataPage, $scope.filter);
						Dialogs.triggerEvent('codbex-employees.Employees.Employee.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: LocaleService.t('codbex-employees:codbex-employees-model.t.EMPLOYEE'),
							message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToDelete', { name: '$t(codbex-employees:codbex-employees-model.t.EMPLOYEE)', message: message }),
							type: AlertTypes.Error
						});
						console.error('EntityService:', error);
					});
				}
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'Employee-filter',
				params: {
					entity: $scope.filterEntity,
					optionsNationality: $scope.optionsNationality,
					optionsGender: $scope.optionsGender,
					optionsMartialStatus: $scope.optionsMartialStatus,
				},
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsNationality = [];
		$scope.optionsGender = [];
		$scope.optionsMartialStatus = [];

		let optionsNationalityHasMore = true;

		$http.get('/services/java/codbex-countries/gen/codbex_countries/api/settings/CountryController/count').then((response) => {
			const optionsNationalityCount = response.data.count;
			$http.get('/services/java/codbex-countries/gen/codbex_countries/api/settings/CountryController').then((response) => {
				$scope.optionsNationality = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				optionsNationalityHasMore = optionsNationalityCount > $scope.optionsNationality.length;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Nationality',
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Nationality',
				message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		let optionsGenderHasMore = true;

		$http.get('/services/java/codbex-employees/gen/codbex_employees/api/settings/GenderController/count').then((response) => {
			const optionsGenderCount = response.data.count;
			$http.get('/services/java/codbex-employees/gen/codbex_employees/api/settings/GenderController').then((response) => {
				$scope.optionsGender = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				optionsGenderHasMore = optionsGenderCount > $scope.optionsGender.length;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Gender',
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Gender',
				message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		let optionsMartialStatusHasMore = true;

		$http.get('/services/java/codbex-employees/gen/codbex_employees/api/settings/MartialStatusController/count').then((response) => {
			const optionsMartialStatusCount = response.data.count;
			$http.get('/services/java/codbex-employees/gen/codbex_employees/api/settings/MartialStatusController').then((response) => {
				$scope.optionsMartialStatus = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
				optionsMartialStatusHasMore = optionsMartialStatusCount > $scope.optionsMartialStatus.length;
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'MartialStatus',
					message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'MartialStatus',
				message: LocaleService.t('codbex-employees:codbex-employees-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$scope.optionsNationalityValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsNationality.length; i++) {
				if ($scope.optionsNationality[i].value === optionKey) {
					return $scope.optionsNationality[i].text;
				}
			}
			return null;
		};
		$scope.optionsGenderValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsGender.length; i++) {
				if ($scope.optionsGender[i].value === optionKey) {
					return $scope.optionsGender[i].text;
				}
			}
			return null;
		};
		$scope.optionsMartialStatusValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsMartialStatus.length; i++) {
				if ($scope.optionsMartialStatus[i].value === optionKey) {
					return $scope.optionsMartialStatus[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//
	});
