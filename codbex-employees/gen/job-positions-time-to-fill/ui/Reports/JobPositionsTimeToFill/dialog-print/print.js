const viewData = {
    id: 'codbex-employees-Reports-JobPositionsTimeToFill-print',
    label: 'Print',
    path: '/services/web/codbex-employees/gen/job-positions-time-to-fill/ui/${perspectiveName}/JobPositionsTimeToFill/dialog-print/index.html',
    perspective: '${perspectiveName}',
    view: 'JobPositionsTimeToFill',
    type: 'page',
    order: 10
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}