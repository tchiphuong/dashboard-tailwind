angular
    .module("dashboardApp", ["ngRoute"])
    .config(RouteConfig)
    .controller("MenuCtrl", function ($scope, $http) {
        $scope.menu = [];
        $scope.sidebarOpen =
            window.innerWidth >= 768
                ? localStorage.getItem("sidebarOpen") === "true"
                : false;
        $scope.toggleSidebar = function () {
            $scope.sidebarOpen = !$scope.sidebarOpen;
            localStorage.setItem("sidebarOpen", $scope.sidebarOpen);
        };
        window.addEventListener("resize", function () {
            $scope.$applyAsync(function () {
                if (window.innerWidth < 768) $scope.sidebarOpen = false;
            });
        });
        $http.get("../assets/data/menu-data.json").then(function (response) {
            $scope.menu = response.data;
        });
        $scope.toggle = function (item) {
            item.open = !item.open;
        };
    });
