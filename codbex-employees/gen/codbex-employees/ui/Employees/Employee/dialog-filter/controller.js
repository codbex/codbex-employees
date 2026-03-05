angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
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
		$scope.entity = params.entity ?? {};
		$scope.selectedMainEntityKey = params.selectedMainEntityKey;
		$scope.selectedMainEntityId = params.selectedMainEntityId;
		$scope.optionsNationality = params.optionsNationality;
		$scope.optionsGender = params.optionsGender;
		$scope.optionsMartialStatus = params.optionsMartialStatus;
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
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'Employee-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});