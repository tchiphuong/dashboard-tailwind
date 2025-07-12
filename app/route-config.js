function RouteConfig($routeProvider) {
    $routeProvider
        // Dashboard
        .when("/dashboard/overview", {
            templateUrl: "app/views/dashboard/overview.html",
            controller: "DashboardOverviewCtrl",
        })
        .when("/dashboard/analytics", {
            templateUrl: "app/views/dashboard/analytics.html",
            controller: "DashboardAnalyticsCtrl",
        })

        // Projects
        .when("/projects/list", {
            templateUrl: "app/views/projects/list.html",
            controller: "ProjectListCtrl",
        })
        .when("/projects/create", {
            templateUrl: "app/views/projects/create.html",
            controller: "ProjectCreateCtrl",
        })

        // Users
        .when("/users/list", {
            templateUrl: "app/views/users/list.html",
            controller: "UserListCtrl",
        })
        .when("/users/roles", {
            templateUrl: "app/views/users/roles.html",
            controller: "UserRolesCtrl",
        })

        // Assets
        .when("/assets/list", {
            templateUrl: "app/views/assets/list.html",
            controller: "AssetListCtrl",
        })
        .when("/assets/requests", {
            templateUrl: "app/views/assets/requests.html",
            controller: "AssetRequestsCtrl",
        })

        // Finance
        .when("/finance/budgets", {
            templateUrl: "app/views/finance/budgets.html",
            controller: "BudgetCtrl",
        })
        .when("/finance/invoices", {
            templateUrl: "app/views/finance/invoices.html",
            controller: "InvoiceCtrl",
        })

        // Settings
        .when("/settings", {
            templateUrl: "app/views/settings/index.html",
            controller: "SettingsCtrl",
        })

        // Default
        .otherwise({
            redirectTo: "/dashboard/overview",
        });
}

// Đăng ký dependency injection
RouteConfig.$inject = ["$routeProvider"];
