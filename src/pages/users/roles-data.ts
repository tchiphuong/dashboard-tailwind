export interface Permission {
    id: string;
    name: string;
    module: string;
    description?: string;
}

export interface Role {
    id: number;
    name: string;
    description: string;
    usersCount: number;
    permissions: string[]; // List of permission IDs
    isSystem?: boolean; // Cannot be deleted if true
}

export const MODULES = [
    'Dashboard',
    'Users',
    'Projects',
    'HR',
    'Sales',
    'Inventory',
    'Finance',
    'System',
] as const;

export const AVAILABLE_PERMISSIONS: Permission[] = [
    // Dashboard
    { id: 'dashboard.view', name: 'View Dashboard', module: 'Dashboard' },

    // Users
    { id: 'users.view', name: 'View Users', module: 'Users' },
    { id: 'users.create', name: 'Create Users', module: 'Users' },
    { id: 'users.edit', name: 'Edit Users', module: 'Users' },
    { id: 'users.delete', name: 'Delete Users', module: 'Users' },
    { id: 'users.roles', name: 'Manage Roles', module: 'Users' },

    // Projects
    { id: 'projects.view', name: 'View Projects', module: 'Projects' },
    { id: 'projects.create', name: 'Create Projects', module: 'Projects' },
    { id: 'projects.edit', name: 'Edit Projects', module: 'Projects' },
    { id: 'projects.delete', name: 'Delete Projects', module: 'Projects' },

    // HR
    { id: 'hr.view', name: 'View HR Module', module: 'HR' },
    { id: 'hr.employees', name: 'Manage Employees', module: 'HR' },
    { id: 'hr.payroll', name: 'Manage Payroll', module: 'HR' },

    // Sales
    { id: 'sales.view', name: 'View Sales', module: 'Sales' },
    { id: 'sales.orders', name: 'Manage Orders', module: 'Sales' },

    // Inventory
    { id: 'inventory.view', name: 'View Inventory', module: 'Inventory' },
    { id: 'inventory.manage', name: 'Manage Stock', module: 'Inventory' },

    // Finance
    { id: 'finance.view', name: 'View Finance', module: 'Finance' },
    { id: 'finance.invoices', name: 'Manage Invoices', module: 'Finance' },

    // System
    { id: 'system.settings', name: 'Manage Settings', module: 'System' },
    { id: 'system.logs', name: 'View Logs', module: 'System' },
];

export const INITIAL_ROLES: Role[] = [
    {
        id: 1,
        name: 'Administrator',
        description: 'Full access to all system features',
        usersCount: 3,
        permissions: AVAILABLE_PERMISSIONS.map((p) => p.id),
        isSystem: true,
    },
    {
        id: 2,
        name: 'Manager',
        description: 'Can manage users and projects',
        usersCount: 5,
        permissions: [
            'dashboard.view',
            'users.view',
            'users.create',
            'users.edit',
            'projects.view',
            'projects.create',
            'projects.edit',
            'projects.delete',
            'hr.view',
            'sales.view',
        ],
    },
    {
        id: 3,
        name: 'Employee',
        description: 'Basic access to assigned projects',
        usersCount: 12,
        permissions: ['dashboard.view', 'projects.view'],
    },
    {
        id: 4,
        name: 'HR Staff',
        description: 'Access to HR module only',
        usersCount: 2,
        permissions: ['dashboard.view', 'hr.view', 'hr.employees', 'hr.payroll'],
    },
];
