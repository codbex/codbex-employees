angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, $http, ViewParameters) => {
	const Dialogs = new DialogHub();
	$scope.entity = {};
	$scope.forms = {
		details: {},
	};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
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
		const optionsCountryMap = new Map();
		params.optionsCountry.forEach(e => optionsCountryMap.set(e.value, e));
		$scope.optionsCountry = Array.from(optionsCountryMap.values());
		const optionsCityMap = new Map();
		params.optionsCity.forEach(e => optionsCityMap.set(e.value, e));
		$scope.optionsCity = Array.from(optionsCityMap.values());
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
		if (entity.Country !== undefined) {
			const condition = { propertyName: 'Country', operator: 'EQ', value: entity.Country };
			filter.$filter.conditions.push(condition);
		}
		if (entity.City !== undefined) {
			const condition = { propertyName: 'City', operator: 'EQ', value: entity.City };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Address) {
			const condition = { propertyName: 'Address', operator: 'LIKE', value: `%${entity.Address}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.PostalCode) {
			const condition = { propertyName: 'PostalCode', operator: 'LIKE', value: `%${entity.PostalCode}%` };
			filter.$filter.conditions.push(condition);
		}
		if (entity.Employee !== undefined) {
			const condition = { propertyName: 'Employee', operator: 'EQ', value: entity.Employee };
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
		Dialogs.postMessage({ topic: 'codbex-employees.Employees.Address.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
		lastSearchValuesCountry.clear();
		allValuesCountry.length = 0;
		lastSearchValuesCity.clear();
		allValuesCity.length = 0;
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'Address-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};

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

});