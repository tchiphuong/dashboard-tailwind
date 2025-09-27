angular
    .module("dashboardApp")
    .controller("PostCtrl", function ($scope, $http, $timeout) {
        $scope.title = "Post Management";

        // Initialize data
        $scope.posts = [];
        $scope.tags = [];
        $scope.loading = false;
        $scope.totalPosts = 0;
        $scope.stats = {
            totalPosts: 0,
            totalViews: 0,
            totalLikes: 0,
            totalTags: 0,
            growth: 0,
            viewsGrowth: 0,
            likesGrowth: 0,
        };

        // Filters
        $scope.filters = {
            search: "",
            tag: "",
            sortBy: "title",
            limit: 10,
            skip: 0,
        };

        // Modal states
        $scope.showAddModal = false;
        $scope.showEditModal = false;
        $scope.showDetailModal = false;
        $scope.selectedPost = null;
        $scope.selectedPostComments = [];

        // Post form
        $scope.postForm = {
            title: "",
            body: "",
            userId: 1,
            tags: [],
        };

        // Helper functions
        $scope.getReactionClass = function (type, count) {
            if (type === "likes") {
                return count > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-400";
            } else {
                return count > 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-400";
            }
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

        // Load posts from DummyJSON API
        $scope.loadPosts = function () {
            $scope.loading = true;

            let url = `https://dummyjson.com/posts?limit=${$scope.filters.limit}&skip=${$scope.filters.skip}`;

            // Add search parameter
            if ($scope.filters.search) {
                url += `&q=${encodeURIComponent($scope.filters.search)}`;
            }

            $http
                .get(url)
                .then(function (response) {
                    $scope.posts = response.data.posts || [];
                    $scope.totalPosts = response.data.total || 0;

                    // Apply client-side sorting
                    if ($scope.filters.sortBy) {
                        $scope.posts.sort((a, b) => {
                            let aVal, bVal;

                            if ($scope.filters.sortBy === "reactions.likes") {
                                aVal = a.reactions.likes;
                                bVal = b.reactions.likes;
                            } else if ($scope.filters.sortBy === "views") {
                                aVal = a.views || 0;
                                bVal = b.views || 0;
                            } else {
                                aVal = a[$scope.filters.sortBy];
                                bVal = b[$scope.filters.sortBy];
                            }

                            if (typeof aVal === "string") {
                                aVal = aVal.toLowerCase();
                                bVal = bVal.toLowerCase();
                            }

                            if (aVal < bVal) return -1;
                            if (aVal > bVal) return 1;
                            return 0;
                        });
                    }

                    // Apply tag filter
                    if ($scope.filters.tag) {
                        $scope.posts = $scope.posts.filter(
                            (post) =>
                                post.tags &&
                                post.tags.includes($scope.filters.tag),
                        );
                    }

                    $scope.loading = false;
                })
                .catch(function (error) {
                    console.error("Error loading posts:", error);
                    $scope.loading = false;
                });
        };

        // Load tags
        $scope.loadTags = function () {
            $http
                .get("https://dummyjson.com/posts?limit=0")
                .then(function (response) {
                    const allPosts = response.data.posts || [];
                    const allTags = [];

                    allPosts.forEach((post) => {
                        if (post.tags) {
                            post.tags.forEach((tag) => {
                                if (!allTags.includes(tag)) {
                                    allTags.push(tag);
                                }
                            });
                        }
                    });

                    $scope.tags = allTags.sort();
                    $scope.updateSelect2(); // Update Select2 after tags load
                })
                .catch(function (error) {
                    console.error("Error loading tags:", error);
                    $scope.tags = [];
                });
        };

        // Calculate stats
        $scope.calculateStats = function () {
            $http
                .get("https://dummyjson.com/posts?limit=0")
                .then(function (response) {
                    const allPosts = response.data.posts || [];

                    $scope.stats.totalPosts = response.data.total || 0;
                    $scope.stats.totalTags = $scope.tags.length;

                    // Calculate total views and likes
                    let totalViews = 0;
                    let totalLikes = 0;

                    allPosts.forEach((post) => {
                        totalViews += post.views || 0;
                        totalLikes += post.reactions.likes || 0;
                    });

                    $scope.stats.totalViews = totalViews;
                    $scope.stats.totalLikes = totalLikes;

                    // Generate random growth percentages
                    $scope.stats.growth = Math.floor(Math.random() * 20) + 5;
                    $scope.stats.viewsGrowth =
                        Math.floor(Math.random() * 15) + 3;
                    $scope.stats.likesGrowth =
                        Math.floor(Math.random() * 25) + 8;

                    $scope.initCounters();
                })
                .catch(function (error) {
                    console.error("Error calculating stats:", error);
                });
        };

        // Apply filters
        $scope.applyFilters = function () {
            $scope.filters.skip = 0; // Reset to first page
            $scope.loadPosts();
        };

        // Pagination
        $scope.nextPage = function () {
            if (
                $scope.filters.skip + $scope.filters.limit <
                $scope.totalPosts
            ) {
                $scope.filters.skip += $scope.filters.limit;
                $scope.loadPosts();
            }
        };

        $scope.previousPage = function () {
            if ($scope.filters.skip > 0) {
                $scope.filters.skip = Math.max(
                    0,
                    $scope.filters.skip - $scope.filters.limit,
                );
                $scope.loadPosts();
            }
        };

        // Initialize Select2
        $scope.initSelect2 = function () {
            $timeout(() => {
                // Tag filter
                $("#tagFilter")
                    .select2({
                        placeholder: "Select Tag",
                        allowClear: true,
                        width: "100%",
                        theme: "classic",
                    })
                    .on("change", function () {
                        $scope.filters.tag = $(this).val();
                        $scope.applyFilters();
                        $scope.$apply();
                    });

                // Sort filter
                $("#sortFilter")
                    .select2({
                        placeholder: "Sort By",
                        allowClear: false,
                        width: "100%",
                        theme: "classic",
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
                        theme: "classic",
                    })
                    .on("change", function () {
                        $scope.filters.limit = parseInt($(this).val());
                        $scope.applyFilters();
                        $scope.$apply();
                    });

                // Modal tags (multiple select)
                $("#modalTags")
                    .select2({
                        placeholder: "Select Tags",
                        allowClear: true,
                        width: "100%",
                        theme: "classic",
                        multiple: true,
                    })
                    .on("change", function () {
                        $scope.postForm.tags = $(this).val();
                        $scope.$apply();
                    });
            }, 100);
        };

        // Update Select2 when data changes
        $scope.updateSelect2 = function () {
            $timeout(() => {
                $("#tagFilter")
                    .select2("destroy")
                    .select2({
                        placeholder: "Select Tag",
                        allowClear: true,
                        width: "100%",
                        theme: "classic",
                    })
                    .on("change", function () {
                        $scope.filters.tag = $(this).val();
                        $scope.applyFilters();
                        $scope.$apply();
                    });
            }, 200);
        };

        // Modal functions
        $scope.closeModal = function () {
            $scope.showAddModal = false;
            $scope.showEditModal = false;
            $scope.resetPostForm();
            // Destroy Select2 in modal
            $("#modalTags").select2("destroy");
        };

        $scope.closeDetailModal = function () {
            $scope.showDetailModal = false;
            $scope.selectedPost = null;
            $scope.selectedPostComments = [];
        };

        $scope.resetPostForm = function () {
            $scope.postForm = {
                title: "",
                body: "",
                userId: 1,
                tags: [],
            };
        };

        // CRUD Operations
        $scope.addPost = function () {
            $scope.resetPostForm();
            $scope.showAddModal = true;
            $timeout(() => {
                $("#modalTags")
                    .select2("destroy")
                    .select2({
                        placeholder: "Select Tags",
                        allowClear: true,
                        width: "100%",
                        theme: "classic",
                        multiple: true,
                    })
                    .on("change", function () {
                        $scope.postForm.tags = $(this).val();
                        $scope.$apply();
                    });
            }, 100);
        };

        $scope.editPost = function (post) {
            $scope.postForm = {
                title: post.title,
                body: post.body,
                userId: post.userId,
                tags: post.tags || [],
            };
            $scope.selectedPost = post;
            $scope.showEditModal = true;
            $timeout(() => {
                $("#modalTags")
                    .select2("destroy")
                    .select2({
                        placeholder: "Select Tags",
                        allowClear: true,
                        width: "100%",
                        theme: "classic",
                        multiple: true,
                    })
                    .on("change", function () {
                        $scope.postForm.tags = $(this).val();
                        $scope.$apply();
                    });
            }, 100);
        };

        $scope.viewPost = function (post) {
            $scope.selectedPost = post;
            $scope.showDetailModal = true;

            // Load comments for this post
            $http
                .get(`https://dummyjson.com/posts/${post.id}/comments`)
                .then(function (response) {
                    $scope.selectedPostComments = response.data.comments || [];
                })
                .catch(function (error) {
                    console.error("Error loading comments:", error);
                    $scope.selectedPostComments = [];
                });
        };

        $scope.deletePost = function (post) {
            if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
                // Note: DummyJSON doesn't support actual deletion, so we'll just remove from local array
                const index = $scope.posts.findIndex((p) => p.id === post.id);
                if (index > -1) {
                    $scope.posts.splice(index, 1);
                    $scope.totalPosts--;
                    $scope.calculateStats();
                }
            }
        };

        $scope.savePost = function () {
            if ($scope.showEditModal) {
                // Update existing post
                const index = $scope.posts.findIndex(
                    (p) => p.id === $scope.selectedPost.id,
                );
                if (index > -1) {
                    $scope.posts[index] = {
                        ...$scope.posts[index],
                        ...$scope.postForm,
                    };
                }
            } else {
                // Add new post
                const newPost = {
                    id: Date.now(), // Generate temporary ID
                    ...$scope.postForm,
                    reactions: {
                        likes: 0,
                        dislikes: 0,
                    },
                    views: 0,
                };
                $scope.posts.unshift(newPost);
                $scope.totalPosts++;
            }

            $scope.closeModal();
            $scope.calculateStats();
        };

        // Refresh data
        $scope.refreshData = function () {
            $scope.loadTags();
            $scope.loadPosts();
            $scope.calculateStats();
        };

        // Initialize
        $scope.$on("$viewContentLoaded", function () {
            $scope.refreshData();
            $scope.initSelect2();
        });
    });
