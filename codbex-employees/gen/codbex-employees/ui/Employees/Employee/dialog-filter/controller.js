angular.module('page', ['blimpKit', 'platformView']).controller('PageController', ($scope, ViewParameters) => {
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
		$scope.optionsGender = params.optionsGender;
		$scope.optionsNationality = params.optionsNationality;
		$scope.optionsMartialStatus = params.optionsMartialStatus;
	}

	$scope.filter = () => {
		let entity = $scope.entity;
		const filter = {
			$filter: {
				equals: {
				},
				notEquals: {
				},
				contains: {
				},
				greaterThan: {
				},
				greaterThanOrEqual: {
				},
				lessThan: {
				},
				lessThanOrEqual: {
				}
			},
		};
		if (entity.Id !== undefined) {
			filter.$filter.equals.Id = entity.Id;
		}
		if (entity.FirstName) {
			filter.$filter.contains.FirstName = entity.FirstName;
		}
		if (entity.MiddleName) {
			filter.$filter.contains.MiddleName = entity.MiddleName;
		}
		if (entity.LastName) {
			filter.$filter.contains.LastName = entity.LastName;
		}
		if (entity.Name) {
			filter.$filter.contains.Name = entity.Name;
		}
		if (entity.Email) {
			filter.$filter.contains.Email = entity.Email;
		}
		if (entity.BirthDateFrom) {
			filter.$filter.greaterThanOrEqual.BirthDate = entity.BirthDateFrom;
		}
		if (entity.BirthDateTo) {
			filter.$filter.lessThanOrEqual.BirthDate = entity.BirthDateTo;
		}
		if (entity.PersonalNumber) {
			filter.$filter.contains.PersonalNumber = entity.PersonalNumber;
		}
		if (entity.Gender !== undefined) {
			filter.$filter.equals.Gender = entity.Gender;
		}
		if (entity.Nationality !== undefined) {
			filter.$filter.equals.Nationality = entity.Nationality;
		}
		if (entity.MartialStatus !== undefined) {
			filter.$filter.equals.MartialStatus = entity.MartialStatus;
		}
		if (entity.IBAN) {
			filter.$filter.contains.IBAN = entity.IBAN;
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