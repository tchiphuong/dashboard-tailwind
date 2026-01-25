import { MenuItem } from '@/types';

export const menuData: MenuItem[] = [
    {
        title: "Dashboard",
        icon: "fa-tachometer-alt",
        children: [
            { title: "Overview", link: "/dashboard/overview" },
            { title: "Analytics", link: "/dashboard/analytics" }
        ]
    },
    {
        title: "Projects",
        icon: "fa-folder-open",
        children: [
            { title: "List", link: "/projects/list" },
            { title: "Create New", link: "/projects/create" }
        ]
    },
    {
        title: "Users",
        icon: "fa-users",
        children: [
            { title: "List", link: "/users/list" },
            { title: "Roles", link: "/users/roles" }
        ]
    },
    {
        title: "Products",
        icon: "fa-box",
        children: [{ title: "Product List", link: "/products/list" }]
    },
    {
        title: "Posts",
        icon: "fa-file-alt",
        children: [{ title: "Post List", link: "/posts/list" }]
    },
    {
        title: "Assets",
        icon: "fa-box",
        children: [
            { title: "Asset List", link: "/assets/list" },
            { title: "Requests", link: "/assets/requests" }
        ]
    },
    {
        title: "Finance",
        icon: "fa-dollar-sign",
        children: [
            { title: "Budget", link: "/finance/budgets" },
            { title: "Invoices", link: "/finance/invoices" }
        ]
    },
    {
        title: "Settings",
        icon: "fa-cogs",
        link: "/settings"
    }
];
