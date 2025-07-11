angular
    .module("dashboardApp")
    .controller("HomeCtrl", function ($scope, $http, $timeout) {
        var vm = this;
        // Counter animation
        vm.counterValue = 0;
        vm.counterTarget = 10245;
        function animateCounter() {
            if (vm.counterValue < vm.counterTarget) {
                vm.counterValue += Math.ceil(vm.counterTarget / 100);
                $timeout(animateCounter, 10);
            } else {
                vm.counterValue = vm.counterTarget;
            }
        }
        animateCounter();

        // User info
        vm.user = {
            name: { first: "Loading...", last: "" },
            email: "",
            picture: { medium: "" },
        };
        vm.loadingUser = true;
        $http.get("https://randomuser.me/api/").then(function (res) {
            vm.user = res.data.results[0];
            vm.loadingUser = false;
        });

        // Notifications
        vm.notifications = [];
        vm.loadingNotifications = true;
        $http
            .get("https://jsonplaceholder.typicode.com/comments?_limit=10")
            .then(function (res) {
                vm.notifications = res.data;
                vm.loadingNotifications = false;
            });
        vm.markAllAsRead = function () {
            vm.notifications = [];
            vm.notificationOpen = false;
        };

        // Chart.js
        vm.loadingCharts = true;
        $timeout(function () {
            var ctx = document.getElementById("salesChart");
            if (ctx) {
                new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: [
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                        ],
                        datasets: [
                            {
                                label: "Sales",
                                data: [
                                    12000, 15000, 14000, 17000, 16000, 18000,
                                    20000,
                                ],
                                borderColor: "#3b82f6",
                                backgroundColor: "rgba(59, 130, 246, 0.1)",
                                fill: true,
                                tension: 0.4,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                    },
                });
            }
            vm.loadingCharts = false;
        }, 500);

        // Grid.js
        vm.loadingGrid = true;
        $http
            .get("https://randomuser.me/api/?results=100")
            .then(function (res) {
                var users = res.data.results.map(function (user) {
                    return [
                        `<img src="${user.picture.thumbnail}" class="rounded-full w-8 h-8" alt="Avatar">`,
                        user.name.first + " " + user.name.last,
                        user.email,
                        user.location.country,
                        user.dob.age,
                    ];
                });
                $timeout(function () {
                    var grid = new gridjs.Grid({
                        columns: [
                            {
                                name: "Avatar",
                                formatter: (cell) => gridjs.html(cell),
                            },
                            "Name",
                            "Email",
                            "Country",
                            "Age",
                        ],
                        data: users,
                        pagination: { enabled: true, limit: 10 },
                        sort: false,
                        search: false,
                        className: {
                            table: "min-w-full divide-y divide-gray-200",
                        },
                    });
                    // grid.render(document.getElementById("recentOrdersGrid"));
                    vm.loadingGrid = false;
                }, 500);
            });
    });
