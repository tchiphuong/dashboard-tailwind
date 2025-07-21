angular
    .module("dashboardApp")
    .controller("DashboardOverviewCtrl", function ($scope, $http, $timeout) {
        $scope.title = "Dashboard Overview";

        // Khởi tạo dữ liệu rỗng
        $scope.stats = [];
        $scope.recentOrders = [];
        $scope.topProducts = [];
        $scope.recentActivities = [];
        $scope.showRegularTable = false;
        $scope.showTables = false;

        // New data for dynamic components
        $scope.notifications = [];
        $scope.performanceMetrics = [];
        $scope.recentOrdersSummary = [];
        $scope.topProductsCards = [];
        $scope.categoriesDistribution = [];
        $scope.recentActivitiesTimeline = [];

        // Mapping status colors
        $scope.getStatusColor = function (status) {
            const statusMap = {
                completed: "text-green-600 bg-green-100",
                pending: "text-yellow-600 bg-yellow-100",
                processing: "text-blue-600 bg-blue-100",
                cancelled: "text-red-600 bg-red-100",
            };
            return statusMap[status] || "text-gray-600 bg-gray-100";
        };

        // Get activity badge classes
        $scope.getActivityBadgeClasses = function (color) {
            const colorMap = {
                blue: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300",
                green: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
                purple: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300",
                yellow: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300",
                red: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300",
                orange: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300",
            };
            return (
                colorMap[color] ||
                "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
            );
        };

        // Get activity icon classes
        $scope.getActivityIconClasses = function (color) {
            const colorMap = {
                blue: "text-blue-500 dark:text-blue-400",
                green: "text-green-500 dark:text-green-400",
                purple: "text-purple-500 dark:text-purple-400",
                yellow: "text-yellow-500 dark:text-yellow-400",
                red: "text-red-500 dark:text-red-400",
                orange: "text-orange-500 dark:text-orange-400",
            };
            return colorMap[color] || "text-gray-500 dark:text-gray-400";
        };

        // Mapping status text
        $scope.getStatusText = function (status) {
            const statusMap = {
                completed: "Completed",
                pending: "Pending",
                processing: "Processing",
                cancelled: "Cancelled",
            };
            return statusMap[status] || status;
        };

        // Format currency
        $scope.formatCurrency = function (amount) {
            return "$" + parseFloat(amount).toFixed(2);
        };

        // Format date
        $scope.formatDate = function (dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        };

        // Counter animation
        $scope.animateCounter = function (element, target, duration = 2000) {
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }

                // Format number based on type
                let displayValue;
                if (target >= 1000) {
                    displayValue = Math.floor(current).toLocaleString();
                } else if (target < 10) {
                    displayValue = current.toFixed(1);
                } else {
                    displayValue = Math.floor(current);
                }

                element.textContent = displayValue;
            }, 16);
        };

        // Initialize counter animations
        $scope.initCounters = function () {
            $timeout(() => {
                const counters = document.querySelectorAll(".counter");
                counters.forEach((counter) => {
                    const target = parseFloat(
                        counter.getAttribute("data-target"),
                    );
                    $scope.animateCounter(counter, target);
                });
            }, 500);
        };

        // Load data from DummyJSON APIs
        $scope.loadDashboardData = function () {
            // Load stats from multiple APIs
            Promise.all([
                // Get users count
                $http
                    .get("https://dummyjson.com/users?limit=0")
                    .then((res) => res.data.total),
                // Get products count
                $http
                    .get("https://dummyjson.com/products?limit=0")
                    .then((res) => res.data.total),
                // Get carts count
                $http
                    .get("https://dummyjson.com/carts?limit=0")
                    .then((res) => res.data.total),
                // Get recent carts for revenue calculation
                $http.get("https://dummyjson.com/carts?limit=10"),
                // Get top products
                $http.get(
                    "https://dummyjson.com/products?limit=5&select=title,price,rating,stock",
                ),
                // Get recent posts for activities
                $http.get(
                    "https://dummyjson.com/posts?limit=5&select=title,body,userId,reactions",
                ),
            ])
                .then(function (results) {
                    const [
                        usersCount,
                        productsCount,
                        cartsCount,
                        recentCarts,
                        topProducts,
                        recentPosts,
                    ] = results;

                    // Calculate total revenue from recent carts
                    const totalRevenue = recentCarts.data.carts.reduce(
                        (sum, cart) => sum + cart.total,
                        0,
                    );

                    // Generate stats
                    $scope.stats = [
                        {
                            title: "Total Users",
                            value: usersCount,
                            change: Math.floor(Math.random() * 20) + 5,
                            changeType: "up",
                            color: "blue",
                            icon: "fa-users",
                        },
                        {
                            title: "Revenue",
                            value: Math.round(totalRevenue),
                            change: Math.floor(Math.random() * 15) + 3,
                            changeType: "up",
                            color: "green",
                            icon: "fa-dollar-sign",
                            prefix: "$",
                        },
                        {
                            title: "Orders",
                            value: cartsCount,
                            change: Math.floor(Math.random() * 10) + 2,
                            changeType: "up",
                            color: "purple",
                            icon: "fa-shopping-cart",
                        },
                        {
                            title: "Products",
                            value: productsCount,
                            change: Math.floor(Math.random() * 8) + 1,
                            changeType: "up",
                            color: "yellow",
                            icon: "fa-box",
                        },
                    ];

                    // Process top products
                    $scope.topProducts = topProducts.data.products.map(
                        (product) => ({
                            name: product.title,
                            sales: Math.floor(Math.random() * 1000) + 100,
                            revenue:
                                product.price *
                                (Math.floor(Math.random() * 1000) + 100),
                            growth: Math.floor(Math.random() * 30) - 10,
                        }),
                    );

                    // Process recent activities from posts
                    $scope.recentActivities = recentPosts.data.posts.map(
                        (post) => ({
                            message: post.title,
                            time: new Date().toLocaleDateString(),
                            icon: "fa-file-text",
                            color: ["blue", "green", "purple", "yellow", "red"][
                                Math.floor(Math.random() * 5)
                            ],
                        }),
                    );

                    // Generate chart data
                    $scope.charts = {
                        revenueChart: {
                            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                            data: Array.from(
                                { length: 6 },
                                () => Math.floor(Math.random() * 50000) + 20000,
                            ),
                            target: Array.from(
                                { length: 6 },
                                () => Math.floor(Math.random() * 50000) + 25000,
                            ),
                        },
                        ordersChart: {
                            labels: [
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "May",
                                "Jun",
                                // "Jul",
                                // "Aug",
                                // "Sep",
                                // "Oct",
                                // "Nov",
                                // "Dec",
                            ],
                            online: Array.from(
                                { length: 12 },
                                () => Math.floor(Math.random() * 300) + 100,
                            ),
                            offline: Array.from(
                                { length: 12 },
                                () => Math.floor(Math.random() * 200) + 50,
                            ),
                            unknown: Array.from(
                                { length: 12 },
                                () => Math.floor(Math.random() * 200) + 50,
                            ),
                        },
                    };

                    // Initialize grids after data is loaded
                    $timeout(() => {
                        $scope.initAllGrids();
                    }, 500);
                })
                .catch(function (error) {
                    console.error("Error loading dashboard data:", error);
                    // Fallback to local data if APIs fail
                    $scope.loadFallbackData();
                });
        };

        // Initialize Chart.js charts
        $scope.initCharts = function () {
            // Check if Chart.js is available
            if (typeof Chart === "undefined") {
                console.error("Chart.js is not loaded!");
                return;
            }

            // Revenue Chart
            const revenueCtx = document.getElementById("revenueChart");
            if (revenueCtx && $scope.charts && $scope.charts.revenueChart) {
                new Chart(revenueCtx, {
                    type: "pie",
                    data: {
                        labels: $scope.charts.revenueChart.labels,
                        datasets: [
                            {
                                label: "Actual Revenue",
                                data: $scope.charts.revenueChart.data,
                                borderWidth: 2,
                                fill: true,
                                tension: 0.4,
                            },
                            /*{
                                label: "Target Revenue",
                                data: $scope.charts.revenueChart.target,
                                borderWidth: 2,
                                fill: false,
                                borderDash: [5, 5],
                                tension: 0.4,
                            },*/
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                position: "bottom",
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (ctx) {
                                        let value = ctx.raw.toLocaleString();
                                        return (
                                            ctx.dataset.label + ": $" + value
                                        );
                                    },
                                },
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function (value) {
                                        return "$" + value.toLocaleString();
                                    },
                                },
                            },
                        },
                        animation: {
                            duration: 1000,
                            easing: "easeOutQuart",
                        },
                    },
                });
            }

            // Orders Chart
            const ordersCtx = document.getElementById("ordersChart");
            if (ordersCtx && $scope.charts && $scope.charts.ordersChart) {
                new Chart(ordersCtx, {
                    type: "bar",
                    data: {
                        labels: $scope.charts.ordersChart.labels,
                        datasets: [
                            {
                                label: "Online Orders",
                                data: $scope.charts.ordersChart.online,
                                borderWidth: 1,
                            },
                            {
                                label: "Offline Orders",
                                data: $scope.charts.ordersChart.offline,
                                borderWidth: 1,
                            },
                            {
                                label: "Unknown Orders",
                                data: $scope.charts.ordersChart.unknown,
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                position: "bottom",
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (ctx) {
                                        return (
                                            ctx.dataset.label +
                                            ": " +
                                            ctx.raw.toLocaleString()
                                        );
                                    },
                                },
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 50,
                                },
                            },
                        },
                        animation: {
                            duration: 1000,
                            easing: "easeOutQuart",
                        },
                    },
                });
            }
        };

        // Server-side data fetching function
        $scope.fetchOrdersData = function (params = {}) {
            const {
                page = 1,
                limit = 10,
                sortBy = "id",
                order = "asc",
                search = "",
            } = params;
            const skip = (page - 1) * limit;

            let url = `https://dummyjson.com/carts?limit=${limit}&skip=${skip}`;

            // Add search parameter if provided
            if (search) {
                url += `&q=${encodeURIComponent(search)}`;
            }

            return $http.get(url).then(function (res) {
                let data = res.data.carts || [];

                // Client-side sorting since DummyJSON doesn't support server-side sorting
                if (sortBy && order) {
                    data.sort((a, b) => {
                        let aVal = a[sortBy];
                        let bVal = b[sortBy];

                        if (sortBy === "total") {
                            aVal = parseFloat(aVal);
                            bVal = parseFloat(bVal);
                        }

                        if (order === "desc") {
                            return bVal > aVal ? 1 : -1;
                        } else {
                            return aVal > bVal ? 1 : -1;
                        }
                    });
                }

                return {
                    data: data,
                    total: res.data.total || data.length,
                };
            });
        };

        // Initialize Orders Grid.js with server-side sorting
        $scope.initOrdersGrid = function () {
            // Load data with server-side pagination and sorting
            $scope
                .fetchOrdersData({ page: 1, limit: 10 })
                .then(function (result) {
                    $scope.recentOrders = result.data;
                    const gridElement =
                        document.getElementById("recentOrdersGrid");
                    if (!gridElement) return;

                    try {
                        new window.gridjs.Grid({
                            columns: [
                                {
                                    name: "Order ID",
                                    sort: true,
                                    formatter: (cell) =>
                                        gridjs.html(
                                            `<span class='text-left'>${cell}</span>`,
                                        ),
                                },
                                {
                                    name: "Customer ID",
                                    sort: true,
                                    formatter: (cell) =>
                                        gridjs.html(
                                            `<span class='text-left'>${cell}</span>`,
                                        ),
                                },
                                {
                                    name: "Total",
                                    sort: true,
                                    formatter: (cell) =>
                                        gridjs.html(
                                            `<span class='text-right font-mono'>${cell}</span>`,
                                        ),
                                },
                                {
                                    name: "Products",
                                    sort: true,
                                    formatter: (cell) =>
                                        gridjs.html(
                                            `<span class='text-right'>${cell}</span>`,
                                        ),
                                },
                                {
                                    name: "Date",
                                    sort: true,
                                    formatter: (cell) =>
                                        gridjs.html(
                                            `<span class='text-center'>${cell}</span>`,
                                        ),
                                },
                                {
                                    name: "Status",
                                    sort: true,
                                    formatter: (cell) => gridjs.html(cell),
                                },
                            ],
                            data: $scope.recentOrders.map((order) => {
                                const statusClass = order.discountedTotal
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800";
                                const statusText = order.discountedTotal
                                    ? "Discounted"
                                    : "Regular";
                                return [
                                    order.id,
                                    order.userId,
                                    $scope.formatCurrency(order.total),
                                    order.totalProducts,
                                    $scope.formatDate(new Date().toISOString()),
                                    `<span class='text-center'><span class='px-2 py-1 text-xs font-medium rounded-full ${statusClass}'>${statusText}</span></span>`,
                                ];
                            }),
                            pagination: { limit: 10 },
                            search: true,
                            sort: true,
                            style: {
                                table: { width: "100%" },
                                th: {
                                    backgroundColor: "#f9fafb",
                                    color: "#374151",
                                    fontWeight: "600",
                                    fontSize: "0.75rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                },
                                td: {
                                    padding: "0.75rem 1rem",
                                    borderBottom: "1px solid #e5e7eb",
                                },
                                tr: {
                                    "&:nth-child(even)": {
                                        backgroundColor: "#f9fafb",
                                    },
                                    "&:hover": {
                                        backgroundColor: "#f3f4f6",
                                    },
                                },
                            },
                        }).render(gridElement);
                    } catch (error) {
                        console.error("Error rendering Grid.js:", error);
                    }
                })
                .catch(function (error) {
                    console.error("Error loading orders data:", error);
                });
        };

        // Initialize all Grid.js tables
        $scope.initAllGrids = function () {
            // Wait for Grid.js to be available before initializing
            $scope.initOrdersGrid();
            $scope.initProductsGrid();
            $scope.initUsersGrid();
            $scope.initCategoriesGrid();
            $scope.initActivitiesGrid();
        };

        // Server-side data fetching for products
        $scope.fetchProductsData = function (params = {}) {
            const {
                page = 1,
                limit = 5,
                sortBy = "title",
                order = "asc",
                search = "",
            } = params;
            const skip = (page - 1) * limit;

            let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

            if (search) {
                url += `&q=${encodeURIComponent(search)}`;
            }

            return $http.get(url).then(function (res) {
                let data = res.data.products || [];

                // Client-side sorting
                if (sortBy && order) {
                    data.sort((a, b) => {
                        let aVal = a[sortBy];
                        let bVal = b[sortBy];

                        if (
                            sortBy === "price" ||
                            sortBy === "rating" ||
                            sortBy === "stock"
                        ) {
                            aVal = parseFloat(aVal);
                            bVal = parseFloat(bVal);
                        }

                        if (order === "desc") {
                            return bVal > aVal ? 1 : -1;
                        } else {
                            return aVal > bVal ? 1 : -1;
                        }
                    });
                }

                // Transform to top products format
                const topProducts = data.map((product) => ({
                    name: product.title,
                    sales: Math.floor(Math.random() * 1000) + 100,
                    revenue:
                        product.price *
                        (Math.floor(Math.random() * 1000) + 100),
                    growth: Math.floor(Math.random() * 30) - 10,
                }));

                return {
                    data: topProducts,
                    total: res.data.total || data.length,
                };
            });
        };

        // Initialize Top Products Grid with server-side sorting
        $scope.initProductsGrid = function () {
            $scope.fetchProductsData({ page: 1, limit: 5 }).then(function (
                result,
            ) {
                $scope.topProducts = result.data;
                const gridElement = document.getElementById("topProductsGrid");
                if (!gridElement) return;

                try {
                    new window.gridjs.Grid({
                        columns: [
                            {
                                name: "Product",
                                sort: true,
                                formatter: (cell) =>
                                    gridjs.html(
                                        `<span class='text-left font-medium'>${cell}</span>`,
                                    ),
                            },
                            {
                                name: "Sales",
                                sort: true,
                                formatter: (cell) =>
                                    gridjs.html(
                                        `<span class='text-right font-mono'>${cell}</span>`,
                                    ),
                            },
                            {
                                name: "Revenue",
                                sort: true,
                                formatter: (cell) =>
                                    gridjs.html(
                                        `<span class='text-right font-mono'>${cell}</span>`,
                                    ),
                            },
                            {
                                name: "Growth",
                                sort: true,
                                formatter: (cell) => gridjs.html(cell),
                            },
                        ],
                        data: $scope.topProducts.map((product) => {
                            const growthClass =
                                product.growth > 0
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800";
                            const growthText =
                                product.growth > 0
                                    ? `+${product.growth}%`
                                    : `${product.growth}%`;
                            return [
                                product.name,
                                product.sales.toLocaleString(),
                                $scope.formatCurrency(product.revenue),
                                `<span class='text-right'><span class='px-2 py-1 text-xs font-medium rounded-full ${growthClass}'>${growthText}</span></span>`,
                            ];
                        }),
                        pagination: { limit: 5 },
                        search: true,
                        sort: true,
                        style: {
                            table: { width: "100%" },
                            th: {
                                backgroundColor: "#f9fafb",
                                color: "#374151",
                                fontWeight: "600",
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                            },
                            td: {
                                padding: "0.75rem 1rem",
                                borderBottom: "1px solid #e5e7eb",
                            },
                            tr: {
                                "&:nth-child(even)": {
                                    backgroundColor: "#f9fafb",
                                },
                                "&:hover": {
                                    backgroundColor: "#f3f4f6",
                                },
                            },
                        },
                    }).render(gridElement);
                } catch (error) {
                    console.error("Error rendering Products Grid:", error);
                }
            }, 1000);
        };

        // Server-side data fetching for users
        $scope.fetchUsersData = function (params = {}) {
            const {
                page = 1,
                limit = 5,
                sortBy = "firstName",
                order = "asc",
                search = "",
            } = params;
            const skip = (page - 1) * limit;

            let url = `https://dummyjson.com/users?limit=${limit}&skip=${skip}&select=firstName,lastName,email,company`;

            if (search) {
                url += `&q=${encodeURIComponent(search)}`;
            }

            return $http.get(url).then(function (res) {
                let data = res.data.users || [];

                // Client-side sorting
                if (sortBy && order) {
                    data.sort((a, b) => {
                        let aVal = a[sortBy];
                        let bVal = b[sortBy];

                        if (order === "desc") {
                            return bVal > aVal ? 1 : -1;
                        } else {
                            return aVal > bVal ? 1 : -1;
                        }
                    });
                }

                return {
                    data: data,
                    total: res.data.total || data.length,
                };
            });
        };

        // Initialize Recent Users Grid with server-side sorting
        $scope.initUsersGrid = function () {
            $scope.fetchUsersData({ page: 1, limit: 5 }).then(function (
                result,
            ) {
                $scope.recentUsers = result.data;
                const gridElement = document.getElementById("recentUsersGrid");
                if (!gridElement) return;

                try {
                    new window.gridjs.Grid({
                        columns: [
                            {
                                name: "Name",
                                sort: true,
                                formatter: (cell) =>
                                    gridjs.html(
                                        `<span class='text-left font-medium'>${cell}</span>`,
                                    ),
                            },
                            {
                                name: "Email",
                                sort: true,
                                formatter: (cell) =>
                                    gridjs.html(
                                        `<span class='text-left'>${cell}</span>`,
                                    ),
                            },
                            {
                                name: "Company",
                                sort: true,
                                formatter: (cell) =>
                                    gridjs.html(
                                        `<span class='text-left'>${cell}</span>`,
                                    ),
                            },
                        ],
                        data: $scope.recentUsers.map((user) => [
                            `${user.firstName} ${user.lastName}`,
                            user.email,
                            user.company?.name || "N/A",
                        ]),
                        pagination: { limit: 5 },
                        search: true,
                        sort: true,
                        style: {
                            table: { width: "100%" },
                            th: {
                                backgroundColor: "#f9fafb",
                                color: "#374151",
                                fontWeight: "600",
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                            },
                            td: {
                                padding: "0.75rem 1rem",
                                borderBottom: "1px solid #e5e7eb",
                            },
                            tr: {
                                "&:nth-child(even)": {
                                    backgroundColor: "#f9fafb",
                                },
                                "&:hover": {
                                    backgroundColor: "#f3f4f6",
                                },
                            },
                        },
                    }).render(gridElement);
                } catch (error) {
                    console.error("Error rendering Users Grid:", error);
                }
            }, 1200);
        };

        // Server-side data fetching for categories
        $scope.fetchCategoriesData = function (params = {}) {
            const {
                page = 1,
                limit = 10,
                sortBy = "",
                order = "asc",
                search = "",
            } = params;

            return $http
                .get("https://dummyjson.com/products/categories")
                .then(function (res) {
                    let data = res.data || [];

                    // Client-side sorting
                    if (sortBy && order) {
                        data.sort((a, b) => {
                            if (order === "desc") {
                                return b > a ? 1 : -1;
                            } else {
                                return a > b ? 1 : -1;
                            }
                        });
                    }

                    // Client-side search
                    if (search) {
                        data = data.filter((category) =>
                            category
                                .toLowerCase()
                                .includes(search.toLowerCase()),
                        );
                    }

                    // Client-side pagination
                    const start = (page - 1) * limit;
                    const end = start + limit;
                    const paginatedData = data.slice(start, end);

                    return {
                        data: paginatedData,
                        total: data.length,
                    };
                });
        };

        // Initialize Categories Grid with server-side sorting
        $scope.initCategoriesGrid = function () {
            $scope.fetchCategoriesData({ page: 1, limit: 10 }).then(function (
                result,
            ) {
                $scope.categories = result.data;
                const gridElement = document.getElementById("categoriesGrid");
                if (!gridElement) return;

                try {
                    new window.gridjs.Grid({
                        columns: [
                            {
                                name: "Category Name",
                                sort: true,
                                formatter: (cell) =>
                                    gridjs.html(
                                        `<span class='text-left font-medium'>${cell}</span>`,
                                    ),
                            },
                            {
                                name: "Status",
                                sort: true,
                                formatter: (cell) => gridjs.html(cell),
                            },
                        ],
                        data: $scope.categories.map((category) => [
                            category,
                            `<span class='text-center'><span class='px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800'>Active</span></span>`,
                        ]),
                        pagination: { limit: 10 },
                        search: true,
                        sort: true,
                        style: {
                            table: { width: "100%" },
                            th: {
                                backgroundColor: "#f9fafb",
                                color: "#374151",
                                fontWeight: "600",
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                            },
                            td: {
                                padding: "0.75rem 1rem",
                                borderBottom: "1px solid #e5e7eb",
                            },
                            tr: {
                                "&:nth-child(even)": {
                                    backgroundColor: "#f9fafb",
                                },
                                "&:hover": {
                                    backgroundColor: "#f3f4f6",
                                },
                            },
                        },
                    }).render(gridElement);
                } catch (error) {
                    console.error("Error rendering Categories Grid:", error);
                }
            }, 1400);
        };

        // Server-side data fetching for activities
        $scope.fetchActivitiesData = function (params = {}) {
            const {
                page = 1,
                limit = 5,
                sortBy = "",
                order = "asc",
                search = "",
            } = params;

            return Promise.all([
                $http.get(
                    "https://dummyjson.com/comments?limit=300&select=body,user,postId",
                ),
                $http.get(
                    "https://dummyjson.com/posts?limit=2&select=title,body,userId,reactions",
                ),
            ]).then(function (results) {
                const [commentsRes, postsRes] = results;
                const comments = commentsRes.data.comments || [];
                const posts = postsRes.data.posts || [];

                // Combine comments and posts for activities
                const activities = [];

                // Add comments as activities
                comments.forEach((comment) => {
                    activities.push({
                        message:
                            comment.body.substring(0, 50) +
                            (comment.body.length > 50 ? "..." : ""),
                        time: new Date().toLocaleDateString(),
                        icon: "fa-comment",
                        color: ["blue", "green", "purple"][
                            Math.floor(Math.random() * 3)
                        ],
                        type: "Comment",
                    });
                });

                // Add posts as activities
                posts.forEach((post) => {
                    activities.push({
                        message: post.title,
                        time: new Date().toLocaleDateString(),
                        icon: "fa-file-text",
                        color: ["yellow", "red", "orange"][
                            Math.floor(Math.random() * 3)
                        ],
                        type: "Post",
                    });
                });

                // Client-side sorting
                if (sortBy && order) {
                    activities.sort((a, b) => {
                        let aVal = a[sortBy];
                        let bVal = b[sortBy];

                        if (order === "desc") {
                            return bVal > aVal ? 1 : -1;
                        } else {
                            return aVal > bVal ? 1 : -1;
                        }
                    });
                }

                // Client-side search
                if (search) {
                    activities = activities.filter(
                        (activity) =>
                            activity.message
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            activity.type
                                .toLowerCase()
                                .includes(search.toLowerCase()),
                    );
                }

                // Client-side pagination
                const start = (page - 1) * limit;
                const end = start + limit;
                const paginatedData = activities.slice(start, end);

                return {
                    data: paginatedData,
                    total: activities.length,
                };
            });
        };

        // Initialize Activities Grid with server-side sorting
        $scope.initActivitiesGrid = function () {
            $scope
                .fetchActivitiesData({ page: 1, limit: 5 })
                .then(function (result) {
                    $scope.recentActivities = result.data;
                    const gridElement = document.getElementById(
                        "recentActivitiesGrid",
                    );
                    if (!gridElement) return;

                    try {
                        new window.gridjs.Grid({
                            columns: [
                                {
                                    name: "Activity",
                                    sort: true,
                                    formatter: (cell) => gridjs.html(cell),
                                },
                                {
                                    name: "Time",
                                    sort: true,
                                    formatter: (cell) =>
                                        gridjs.html(
                                            `<span class='text-center'>${cell}</span>`,
                                        ),
                                },
                                {
                                    name: "Type",
                                    sort: true,
                                    formatter: (cell) => gridjs.html(cell),
                                },
                            ],
                            data: $scope.recentActivities.map((activity) => {
                                const iconClass = $scope.getActivityIconClasses(
                                    activity.color,
                                );
                                const badgeClass =
                                    $scope.getActivityBadgeClasses(
                                        activity.color,
                                    );
                                return [
                                    `<div class='flex items-center text-left'><i class='fa ${activity.icon} mr-2 ${iconClass}'></i><span>${activity.message}</span></div>`,
                                    activity.time,
                                    `<span class='text-center'><span class='px-2 py-1 text-xs font-medium rounded-full ${badgeClass}'>${activity.type || ""}</span></span>`,
                                ];
                            }),
                            pagination: { limit: 5 },
                            search: true,
                            sort: true,
                            style: {
                                table: { width: "100%" },
                                th: {
                                    backgroundColor: "#f9fafb",
                                    color: "#374151",
                                    fontWeight: "600",
                                    fontSize: "0.75rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                },
                                td: {
                                    padding: "0.75rem 1rem",
                                    borderBottom: "1px solid #e5e7eb",
                                },
                                tr: {
                                    "&:nth-child(even)": {
                                        backgroundColor: "#f9fafb",
                                    },
                                    "&:hover": {
                                        backgroundColor: "#f3f4f6",
                                    },
                                },
                            },
                        }).render(gridElement);
                    } catch (error) {
                        console.error(
                            "Error rendering Activities Grid:",
                            error,
                        );
                    }
                });
        };

        // Initialize
        $scope.$on("$viewContentLoaded", function () {
            $scope.loadDashboardData();
            $scope.loadAdditionalData();
            $scope.initCounters();
            $scope.generateNotifications();
            $scope.generatePerformanceMetrics();
            $scope.generateRecentOrdersSummary();
            $scope.generateTopProductsCards();
            $scope.generateCategoriesDistribution();
            $scope.generateActivitiesTimeline();

            // Initialize charts after data is loaded
            $timeout(() => {
                $scope.initCharts();
            }, 1500);

            // Ensure grids are initialized after data is loaded
            $timeout(() => {
                $scope.initAllGrids();
            }, 2000);
        });

        // Format currency cho top products
        $scope.formatProductRevenue = function (revenue) {
            return (
                "$" +
                parseFloat(revenue).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            );
        };

        // Load additional data from DummyJSON
        $scope.loadAdditionalData = function () {
            // Load user details for better insights
            $http
                .get(
                    "https://dummyjson.com/users?limit=5&select=firstName,lastName,email,company",
                )
                .then(function (res) {
                    $scope.recentUsers = res.data.users;
                })
                .catch(function (err) {
                    console.error("Error loading users:", err);
                    $scope.recentUsers = [];
                });

            // Load product categories
            $http
                .get("https://dummyjson.com/products/categories")
                .then(function (res) {
                    $scope.categories = res.data;
                })
                .catch(function (err) {
                    console.error("Error loading categories:", err);
                    $scope.categories = [];
                });
        };

        // Toggle tables visibility
        $scope.toggleTables = function () {
            $scope.showTables = !$scope.showTables;
        };

        // Generate notifications
        $scope.generateNotifications = function () {
            $scope.notifications = [
                {
                    title: "New order received",
                    time: "2 minutes ago",
                    type: "success",
                },
                {
                    title: "Low stock alert",
                    time: "15 minutes ago",
                    type: "warning",
                },
                {
                    title: "System update completed",
                    time: "1 hour ago",
                    type: "info",
                },
                {
                    title: "Payment processed",
                    time: "2 hours ago",
                    type: "success",
                },
            ];
        };

        // Generate performance metrics
        $scope.generatePerformanceMetrics = function () {
            $scope.performanceMetrics = [
                {
                    name: "Customer Satisfaction",
                    value: 94,
                    color: "green",
                },
                {
                    name: "Order Completion Rate",
                    value: 87,
                    color: "blue",
                },
                {
                    name: "Revenue Growth",
                    value: 76,
                    color: "purple",
                },
                {
                    name: "Inventory Turnover",
                    value: 82,
                    color: "orange",
                },
            ];
        };

        // Generate recent orders summary
        $scope.generateRecentOrdersSummary = function () {
            $scope.recentOrdersSummary = [
                {
                    id: "ORD-001",
                    customer: "John Doe",
                    amount: "$1,250.00",
                    status: "Completed",
                    statusColor: "green",
                },
                {
                    id: "ORD-002",
                    customer: "Jane Smith",
                    amount: "$890.00",
                    status: "Processing",
                    statusColor: "blue",
                },
                {
                    id: "ORD-003",
                    customer: "Mike Johnson",
                    amount: "$2,100.00",
                    status: "Pending",
                    statusColor: "yellow",
                },
                {
                    id: "ORD-004",
                    customer: "Sarah Wilson",
                    amount: "$750.00",
                    status: "Completed",
                    statusColor: "green",
                },
            ];
        };

        // Generate top products cards
        $scope.generateTopProductsCards = function () {
            $scope.topProductsCards = [
                {
                    name: "Wireless Headphones",
                    sales: 1250,
                    revenue: "$12,500",
                    growth: 15,
                },
                {
                    name: "Smart Watch",
                    sales: 890,
                    revenue: "$8,900",
                    growth: 8,
                },
                {
                    name: "Laptop Stand",
                    sales: 650,
                    revenue: "$6,500",
                    growth: -3,
                },
                {
                    name: "Phone Case",
                    sales: 1200,
                    revenue: "$2,400",
                    growth: 22,
                },
            ];
        };

        // Generate categories distribution
        $scope.generateCategoriesDistribution = function () {
            $scope.categoriesDistribution = [
                {
                    name: "Electronics",
                    percentage: 35,
                    color: "blue",
                },
                {
                    name: "Clothing",
                    percentage: 25,
                    color: "green",
                },
                {
                    name: "Home & Garden",
                    percentage: 20,
                    color: "purple",
                },
                {
                    name: "Sports",
                    percentage: 15,
                    color: "orange",
                },
                {
                    name: "Books",
                    percentage: 5,
                    color: "red",
                },
            ];
        };

        // Generate activities timeline
        $scope.generateActivitiesTimeline = function () {
            $scope.recentActivitiesTimeline = [
                {
                    title: "New order placed",
                    description: "Order #ORD-001 was placed by John Doe",
                    time: "2 minutes ago",
                    type: "Order",
                    color: "green",
                },
                {
                    title: "Product updated",
                    description: "Wireless Headphones price updated to $99.99",
                    time: "15 minutes ago",
                    type: "Product",
                    color: "blue",
                },
                {
                    title: "User registered",
                    description: "New user Sarah Wilson joined the platform",
                    time: "1 hour ago",
                    type: "User",
                    color: "purple",
                },
                {
                    title: "Payment received",
                    description:
                        "Payment of $1,250.00 received for order #ORD-001",
                    time: "2 hours ago",
                    type: "Payment",
                    color: "green",
                },
                {
                    title: "Inventory alert",
                    description:
                        "Low stock alert for Smart Watch (5 items left)",
                    time: "3 hours ago",
                    type: "Alert",
                    color: "orange",
                },
            ];
        };

        // Refresh data
        $scope.refreshData = function () {
            setTimeout(() => {
                $scope.loadDashboardData();
                $scope.loadAdditionalData();
                $scope.initCounters();
                $scope.generateNotifications();
                $scope.generatePerformanceMetrics();
                $scope.generateRecentOrdersSummary();
                $scope.generateTopProductsCards();
                $scope.generateCategoriesDistribution();
                $scope.generateActivitiesTimeline();

                // Retry charts initialization
                $timeout(() => {
                    $scope.initCharts();
                }, 1500);

                $scope.initAllGrids();
            }, 1000);
        };
    });
