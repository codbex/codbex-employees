/*
 * Generated by Eclipse Dirigible based on model and template.
 *
 * Do not modify the content as it may be re-generated again.
 */
const navigationData = {
	id: 'codbex-employees-job-positions-time-to-fill',
	label: 'Job Positions Time-to-fill',
	group: 'reports',
	link: '/services/web/codbex-employees/gen/job-positions-time-to-fill/ui/Reports/JobPositionsTimeToFill/index.html',
	order: 999,
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
	exports.getNavigation = function () {
		return navigationData;
	}
}

export { getNavigation }