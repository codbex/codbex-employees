angular.module('page', ['blimpKit', 'platformView', 'EntityService'])
    .config(['EntityServiceProvider', (EntityServiceProvider) => {
        EntityServiceProvider.baseUrl = '/services/ts/codbex-employees/gen/open-job-positions/api/Reports/OpenJobPositionsService.ts';
    }])
    .controller('PageController', ($scope, EntityService, ViewParameters) => {
        const Dialogs = new DialogHub();
		let params = ViewParameters.get();
		if (Object.keys(params).length) {         
            const filterEntity = params.filterEntity ?? {};

			$scope.filter = {};
		}

        $scope.loadPage = (filter) => {
            if (!filter && $scope.filter) {
                filter = $scope.filter;
            }
            let request;
            if (filter) {
                request = EntityService.search(filter);
            } else {
                request = EntityService.list();
            }
            request.then((response) => {
                response.data.forEach(e => {
                    if (e['Date opened']) {
                        e['Date opened'] = new Date(e['Date opened']);
                    }
                });

                $scope.data = response.data;
                setTimeout(() => {
                    window.print();
                }, 250);
            }, (error) => {
                const message = error.data ? error.data.message : '';
                Dialogs.showAlert({
                    title: 'OpenJobPositions',
                    message: `Unable to list/filter OpenJobPositions: '${message}'`,
                    type: AlertTypes.Error
                });
                console.error('EntityService:', error);
            });
        };
        $scope.loadPage($scope.filter);

        window.onafterprint = () => {
            Dialogs.closeWindow({ path: viewData.path });
        }
    });