const viewData = {
    id: 'codbex-employees-Reports-OpenJobPositions-print',
    label: 'Print',
    path: '/services/web/codbex-employees/gen/open-job-positions/ui/${perspectiveName}/OpenJobPositions/dialog-print/index.html',
    perspective: '${perspectiveName}',
    view: 'OpenJobPositions',
    type: 'page',
    order: 10
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}