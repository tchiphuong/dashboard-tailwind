angular
    .module("dashboardApp")
    .controller("ProductCtrl", function ($scope, $http, $timeout) {
        $scope.title = "Product Management";

        // Initialize data
        $scope.products = [];
        $scope.categories = [];
        $scope.loading = false;
        $scope.totalProducts = 0;
        $scope.stats = {
            totalProducts: 0,
            totalCategories: 0,
            lowStock: 0,
            avgRating: 0,
            growth: 0,
            categoryGrowth: 0,
            lowStockGrowth: 0,
        };

        // Filters
        $scope.filters = {
            search: "",
            category: "",
            sortBy: "title",
            limit: 10,
            skip: 0,
            createdDate: "", // Thêm filter ngày
        };

        // Modal states
        $scope.showAddModal = false;
        $scope.showEditModal = false;
        $scope.showDetailModal = false;
        $scope.selectedProduct = null;

        // Product form
        $scope.productForm = {
            title: "",
            description: "",
            price: 0,
            stock: 0,
            category: "",
            brand: "",
        };

        // Helper functions
        $scope.getStatusClass = function (stock) {
            if (stock === 0)
                return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300";
            if (stock < 10)
                return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300";
            return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300";
        };

        $scope.getStatusText = function (stock) {
            if (stock === 0) return "Out of Stock";
            if (stock < 10) return "Low Stock";
            return "In Stock";
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
                element.textContent = Math.floor(current).toLocaleString();
            }, 16);
        };

        // Initialize counters
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

        // Load products from DummyJSON API
        $scope.loadProducts = function () {
            $scope.loading = true;

            let url = `https://dummyjson.com/products?limit=${$scope.filters.limit}&skip=${$scope.filters.skip}`;

            // Add search parameter
            if ($scope.filters.search) {
                url += `&q=${encodeURIComponent($scope.filters.search)}`;
            }

            $http
                .get(url)
                .then(function (response) {
                    $scope.products = response.data.products || [];
                    $scope.totalProducts = response.data.total || 0;

                    // Gán ngày tạo giả lập cho mỗi sản phẩm (demo)
                    $scope.products.forEach((product, idx) => {
                        const now = new Date();
                        const daysAgo = Math.floor(Math.random() * 30);
                        const created = new Date(
                            now.getTime() - daysAgo * 24 * 60 * 60 * 1000,
                        );
                        product.createdDate = created
                            .toISOString()
                            .slice(0, 10); // yyyy-mm-dd
                    });

                    // Apply client-side sorting
                    if ($scope.filters.sortBy) {
                        $scope.products.sort((a, b) => {
                            let aVal = a[$scope.filters.sortBy];
                            let bVal = b[$scope.filters.sortBy];

                            if (typeof aVal === "string") {
                                aVal = aVal.toLowerCase();
                                bVal = bVal.toLowerCase();
                            }

                            if (aVal < bVal) return -1;
                            if (aVal > bVal) return 1;
                            return 0;
                        });
                    }

                    // Apply category filter
                    if ($scope.filters.category) {
                        $scope.products = $scope.products.filter(
                            (product) =>
                                product.category === $scope.filters.category,
                        );
                    }

                    // Apply createdDate filter (client-side)
                    if ($scope.filters.createdDate) {
                        $scope.products = $scope.products.filter(
                            (product) =>
                                product.createdDate &&
                                product.createdDate.startsWith(
                                    $scope.filters.createdDate,
                                ),
                        );
                    }

                    $scope.loading = false;

                    // Khởi tạo lại Flatpickr sau khi render xong
                    $timeout(function () {
                        if (window.flatpickr) {
                            // Destroy instance cũ nếu có
                            if (window._flatpickrInstance) {
                                window._flatpickrInstance.destroy();
                            }
                            window._flatpickrInstance = flatpickr(
                                "#flatpickr-date",
                                {
                                    monthSelectorType: "static",
                                    defaultDate:
                                        $scope.filters.createdDate || null,
                                    onChange: function (
                                        selectedDates,
                                        dateStr,
                                    ) {
                                        $scope.filters.createdDate = dateStr;
                                        $scope.applyFilters();
                                        $scope.$applyAsync();
                                    },
                                },
                            );
                        }
                    }, 0);
                })
                .catch(function (error) {
                    console.error("Error loading products:", error);
                    $scope.loading = false;
                });
        };

        // Load categories
        $scope.loadCategories = function () {
            $http
                .get("https://dummyjson.com/products/categories")
                .then(function (response) {
                    $scope.categories = response.data || [];
                    $scope.updateSelect2(); // Update Select2 after categories load
                    // Khởi tạo lại Flatpickr sau khi render xong
                    $timeout(function () {
                        if (window.flatpickr) {
                            flatpickr("#flatpickr-date", {
                                monthSelectorType: "static",
                                defaultDate: $scope.filters.createdDate || null,
                                onChange: function (selectedDates, dateStr) {
                                    $scope.filters.createdDate = dateStr;
                                    $scope.applyFilters();
                                    $scope.$applyAsync();
                                },
                            });
                        }
                    }, 0);
                })
                .catch(function (error) {
                    console.error("Error loading categories:", error);
                    $scope.categories = [];
                });
        };

        // Calculate stats
        $scope.calculateStats = function () {
            $http
                .get("https://dummyjson.com/products?limit=0")
                .then(function (response) {
                    const allProducts = response.data.products || [];

                    $scope.stats.totalProducts = response.data.total || 0;
                    $scope.stats.totalCategories = $scope.categories.length;
                    $scope.stats.lowStock = allProducts.filter(
                        (p) => p.stock < 10,
                    ).length;

                    // Calculate average rating
                    const totalRating = allProducts.reduce(
                        (sum, p) => sum + p.rating,
                        0,
                    );
                    $scope.stats.avgRating = (
                        totalRating / allProducts.length
                    ).toFixed(1);

                    // Generate random growth percentages
                    $scope.stats.growth = Math.floor(Math.random() * 20) + 5;
                    $scope.stats.categoryGrowth =
                        Math.floor(Math.random() * 15) + 3;
                    $scope.stats.lowStockGrowth =
                        Math.floor(Math.random() * 10) + 2;

                    $scope.initCounters();
                })
                .catch(function (error) {
                    console.error("Error calculating stats:", error);
                });
        };

        // Apply filters
        $scope.applyFilters = function () {
            $scope.filters.skip = 0; // Reset to first page
            $scope.loadProducts();
            // Khởi tạo lại Flatpickr sau khi render xong
            $timeout(function () {
                if (window.flatpickr) {
                    flatpickr("#flatpickr-date", {
                        monthSelectorType: "static",
                        defaultDate: $scope.filters.createdDate || null,
                        onChange: function (selectedDates, dateStr) {
                            $scope.filters.createdDate = dateStr;
                            $scope.applyFilters();
                            $scope.$applyAsync();
                        },
                    });
                }
            }, 0);
        };

        // Pagination
        $scope.nextPage = function () {
            if (
                $scope.filters.skip + $scope.filters.limit <
                $scope.totalProducts
            ) {
                $scope.filters.skip += $scope.filters.limit;
                $scope.loadProducts();
            }
        };

        $scope.previousPage = function () {
            if ($scope.filters.skip > 0) {
                $scope.filters.skip = Math.max(
                    0,
                    $scope.filters.skip - $scope.filters.limit,
                );
                $scope.loadProducts();
            }
        };

        // Modal functions
        $scope.closeModal = function () {
            $scope.showAddModal = false;
            $scope.showEditModal = false;
            $scope.resetProductForm();
            // Destroy Select2 in modal
            $("#modalCategory").select2("destroy");
        };

        $scope.closeDetailModal = function () {
            $scope.showDetailModal = false;
            $scope.selectedProduct = null;
        };

        $scope.resetProductForm = function () {
            $scope.productForm = {
                title: "",
                description: "",
                price: 0,
                stock: 0,
                category: "",
                brand: "",
            };
        };

        // CRUD Operations
        $scope.addProduct = function () {
            $scope.resetProductForm();
            $scope.showAddModal = true;
            $timeout(() => {
                $("#modalCategory")
                    .select2("destroy")
                    .select2({
                        placeholder: "Select Category",
                        allowClear: false,
                        width: "100%",
                        theme: "tailwind",
                    })
                    .on("change", function () {
                        $scope.productForm.category = $(this).val();
                        $scope.$apply();
                    });
            }, 100);
        };

        $scope.editProduct = function (product) {
            $scope.productForm = {
                title: product.title,
                description: product.description,
                price: product.price,
                stock: product.stock,
                category: product.category,
                brand: product.brand,
            };
            $scope.selectedProduct = product;
            $scope.showEditModal = true;
            $timeout(() => {
                $("#modalCategory")
                    .select2("destroy")
                    .select2({
                        placeholder: "Select Category",
                        allowClear: false,
                        width: "100%",
                        theme: "tailwind",
                    })
                    .on("change", function () {
                        $scope.productForm.category = $(this).val();
                        $scope.$apply();
                    });
            }, 100);
        };

        $scope.viewProduct = function (product) {
            $scope.selectedProduct = product;
            $scope.showDetailModal = true;
        };

        $scope.deleteProduct = function (product) {
            if (
                confirm(`Are you sure you want to delete "${product.title}"?`)
            ) {
                // Note: DummyJSON doesn't support actual deletion, so we'll just remove from local array
                const index = $scope.products.findIndex(
                    (p) => p.id === product.id,
                );
                if (index > -1) {
                    $scope.products.splice(index, 1);
                    $scope.totalProducts--;
                    $scope.calculateStats();
                }
            }
        };

        $scope.saveProduct = function () {
            if ($scope.showEditModal) {
                // Update existing product
                const index = $scope.products.findIndex(
                    (p) => p.id === $scope.selectedProduct.id,
                );
                if (index > -1) {
                    $scope.products[index] = {
                        ...$scope.products[index],
                        ...$scope.productForm,
                    };
                }
            } else {
                // Add new product
                const newProduct = {
                    id: Date.now(), // Generate temporary ID
                    ...$scope.productForm,
                    thumbnail: "https://via.placeholder.com/150",
                    images: ["https://via.placeholder.com/150"],
                    rating: 0,
                    reviews: [],
                };
                $scope.products.unshift(newProduct);
                $scope.totalProducts++;
            }

            $scope.closeModal();
            $scope.calculateStats();
        };

        // Refresh data
        $scope.refreshData = function () {
            $scope.loadCategories();
            $scope.loadProducts();
            $scope.calculateStats();
        };

        // Initialize Select2
        $scope.initSelect2 = function () {
            $timeout(() => {
                // Category filter
                $("#categoryFilter")
                    .select2({
                        placeholder: "Select Category",
                        allowClear: true,
                        width: "100%",
                        theme: "tailwind",
                    })
                    .on("change", function () {
                        $scope.filters.category = $(this).val();
                        $scope.applyFilters();
                        $scope.$apply();
                    });

                // Sort filter
                $("#sortFilter")
                    .select2({
                        placeholder: "Sort By",
                        allowClear: false,
                        width: "100%",
                        theme: "tailwind",
                    })
                    .on("change", function () {
                        $scope.filters.sortBy = $(this).val();
                        $scope.applyFilters();
                        $scope.$apply();
                    });

                // Limit filter
                $("#limitFilter")
                    .select2({
                        placeholder: "Show",
                        allowClear: false,
                        width: "auto",
                        minimumResultsForSearch: Infinity,
                        theme: "tailwind",
                    })
                    .on("change", function () {
                        $scope.filters.limit = parseInt($(this).val());
                        $scope.applyFilters();
                        $scope.$apply();
                    });

                // Modal category
                $("#modalCategory")
                    .select2({
                        placeholder: "Select Category",
                        allowClear: false,
                        width: "100%",
                        theme: "tailwind",
                    })
                    .on("change", function () {
                        $scope.productForm.category = $(this).val();
                        $scope.$apply();
                    });
            }, 100);
        };

        // Update Select2 when data changes
        $scope.updateSelect2 = function () {
            $timeout(() => {
                $("#categoryFilter")
                    .select2("destroy")
                    .select2({
                        placeholder: "Select Category",
                        allowClear: true,
                        width: "100%",
                        theme: "tailwind",
                    })
                    .on("change", function () {
                        $scope.filters.category = $(this).val();
                        $scope.applyFilters();
                        $scope.$apply();
                    });
            }, 200);
        };

        // Initialize
        $scope.$on("$viewContentLoaded", function () {
            $scope.refreshData();
            $scope.initSelect2();
        });
    });
