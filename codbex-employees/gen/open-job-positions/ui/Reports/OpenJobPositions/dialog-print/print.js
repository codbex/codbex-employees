const viewData = {
    id: 'codbex-employees-Reports-OpenJobPositions-print',
    label: 'Print',
    link: '/services/web/codbex-employees/gen/open-job-positions/ui/Reports/OpenJobPositions/dialog-print/index.html',
    perspective: 'Reports',
    view: 'OpenJobPositions',
    type: 'page',
    order: 10
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}