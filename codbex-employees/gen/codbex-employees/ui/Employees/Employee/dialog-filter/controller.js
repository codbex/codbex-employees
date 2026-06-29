angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, $http, ViewParameters) => {
	const Dialogs = new DialogHub();
	$scope.entity = {};
	$scope.forms = {
		details: {},
	};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		if (params?.entity?.BirthDateFrom) {
			params.entity.BirthDateFrom = new Date(params.entity.BirthDateFrom);
		}
		if (params?.entity?.BirthDateTo) {
			params.entity.BirthDateTo = new Date(params.entity.BirthDateTo);
		}
		if (params?.entity?.CreatedAtFrom) {
			params.entity.CreatedAtFrom = new Date(params.entity.CreatedAtFrom);
		}
		if (params?.entity?.CreatedAtTo) {
			params.entity.CreatedAtTo = new Date(params.entity.CreatedAtTo);
		}
		if (params?.entity?.UpdatedAtFrom) {
			params.entity.UpdatedAtFrom = new Date(params.entity.UpdatedAtFrom);
		}
		if (params?.entity?.UpdatedAtTo) {
			params.entity.UpdatedAtTo = new Date(params.entity.UpdatedAtTo);
		}
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
		const optionsNationalityMap = new Map();
		params.optionsNationality.forEach(e => optionsNationalityMap.set(e.value, e));
		$scope.optionsNationality = Array.from(optionsNationalityMap.values());
		const optionsGenderMap = new Map();
		params.optionsGender.forEach(e => optionsGenderMap.set(e.value, e));
		$scope.optionsGender = Array.from(optionsGenderMap.values());
		const optionsMartialStatusMap = new Map();
		params.optionsMartialStatus.forEach(e => optionsMartialStatusMap.set(e.value, e));
		$scope.optionsMartialStatus = Array.from(optionsMartialStatusMap.values());
	}

	$scope.filter = () => {
		let entity = $scope.entity;
		const filter = {
			$filter: {
				conditions: [],
				sorts: [],
				limit: 20,
				offset: 0
			}
		};
		if (entity.Id !== undefined) {
			const condition = { propertyName: 'Id', operator: 'EQ', value: entity.Id };
			filter.$filter.conditions.push(condition);
		}
		if (entity.FirstName) {
			const condition = { propertyName: 'FirstName', operator: 'LIKE', value: `%${entity.FirstName}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.MiddleName) {
			const condition = { propertyName: 'MiddleName', operator: 'LIKE', value: `%${entity.MiddleName}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.LastName) {
			const condition = { propertyName: 'LastName', operator: 'LIKE', value: `%${entity.LastName}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Name) {
			const condition = { propertyName: 'Name', operator: 'LIKE', value: `%${entity.Name}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Email) {
			const condition = { propertyName: 'Email', operator: 'LIKE', value: `%${entity.Email}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.PhoneNumber) {
			const condition = { propertyName: 'PhoneNumber', operator: 'LIKE', value: `%${entity.PhoneNumber}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.BirthDateFrom) {
			const condition = { propertyName: 'BirthDate', operator: 'GE', value: entity.BirthDateFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.BirthDateTo) {
			const condition = { propertyName: 'BirthDate', operator: 'LE', value: entity.BirthDateTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.PersonalNumber) {
			const condition = { propertyName: 'PersonalNumber', operator: 'LIKE', value: `%${entity.PersonalNumber}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Nationality !== undefined) {
			const condition = { propertyName: 'Nationality', operator: 'EQ', value: entity.Nationality };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Gender !== undefined) {
			const condition = { propertyName: 'Gender', operator: 'EQ', value: entity.Gender };
			filter.$filter.conditions.push(condition);
		}
		if (entity.MartialStatus !== undefined) {
			const condition = { propertyName: 'MartialStatus', operator: 'EQ', value: entity.MartialStatus };
			filter.$filter.conditions.push(condition);
		}
		if (entity.IBAN) {
			const condition = { propertyName: 'IBAN', operator: 'LIKE', value: `%${entity.IBAN}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.CreatedAtFrom) {
			const condition = { propertyName: 'CreatedAt', operator: 'GE', value: entity.CreatedAtFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.CreatedAtTo) {
			const condition = { propertyName: 'CreatedAt', operator: 'LE', value: entity.CreatedAtTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.CreatedBy) {
			const condition = { propertyName: 'CreatedBy', operator: 'LIKE', value: `%${entity.CreatedBy}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UpdatedAtFrom) {
			const condition = { propertyName: 'UpdatedAt', operator: 'GE', value: entity.UpdatedAtFrom };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UpdatedAtTo) {
			const condition = { propertyName: 'UpdatedAt', operator: 'LE', value: entity.UpdatedAtTo };
			filter.$filter.conditions.push(condition);
		}
		if (entity.UpdatedBy) {
			const condition = { propertyName: 'UpdatedBy', operator: 'LIKE', value: `%${entity.UpdatedBy}%` };
			filter.$filter.conditions.push(condition);
		}
		Dialogs.postMessage({ topic: 'codbex-employees.Employees.Employee.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		Dialogs.triggerEvent('codbex-employees.Employees.Employee.clearDetails');
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
		lastSearchValuesNationality.clear();
		allValuesNationality.length = 0;
		lastSearchValuesGender.clear();
		allValuesGender.length = 0;
		lastSearchValuesMartialStatus.clear();
		allValuesMartialStatus.length = 0;
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'Employee-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};

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

});