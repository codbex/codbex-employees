angular.module('page', ['blimpKit', 'platformView']).controller('PageController', ($scope, ViewParameters) => {
	$scope.entity = {};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		$scope.action = 'select';

		if (params.entity['Date opened']) {
			params.entity['Date opened'] = new Date(params.entity['Date opened']);
		}
		$scope.entity = params.entity;
	}
});