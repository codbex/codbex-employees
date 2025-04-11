const viewData = {
    id: 'codbex-employees-Reports-JobPositionsTimeToFill-print',
    label: 'Print',
    path: '/services/web/codbex-employees/gen/job-positions-time-to-fill/ui/Reports/JobPositionsTimeToFill/dialog-print/index.html',
    perspective: 'Reports',
    view: 'JobPositionsTimeToFill',
    type: 'page',
    order: 10
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}