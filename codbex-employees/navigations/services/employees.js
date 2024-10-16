const navigationData = {
    id: 'employees-navigation',
    label: "Employees",
    view: "employees",
    group: "employees",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-employees/gen/codbex-employees/ui/Employees/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }