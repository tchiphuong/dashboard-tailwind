import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Input,
    Button,
    Chip,
    Pagination,
    Select,
    SelectItem,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Progress,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Tabs,
    Tab,
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    SortDescriptor,
} from '@heroui/react';
import {
    MagnifyingGlassIcon,
    ArrowPathIcon,
    TrashIcon,
    ArrowDownTrayIcon,
    CloudArrowUpIcon,
    FolderIcon,
    DocumentIcon,
    PhotoIcon,
    MusicalNoteIcon,
    FilmIcon,
    DocumentTextIcon,
    ArchiveBoxIcon,
    EllipsisVerticalIcon,
    Squares2X2Icon,
    ListBulletIcon,
    StarIcon,
    ShareIcon,
    PencilIcon,
    FolderPlusIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    HomeIcon,
    ClockIcon,
    TrashIcon as TrashIconOutline,
    FolderOpenIcon,
    TableCellsIcon,
    PresentationChartBarIcon,
} from '@heroicons/react/24/outline';
import {
    StarIcon as StarIconSolid,
    FolderIcon as FolderIconSolid,
} from '@heroicons/react/24/solid';
import { Breadcrumb } from '@/components/layout';

// Folder tree interface
interface FolderNode {
    id: string;
    name: string;
    icon?: React.ReactNode;
    children?: FolderNode[];
    count?: number;
}

// Mock folder tree data
const folderTree: FolderNode[] = [
    { id: 'all', name: 'files.allFiles', icon: <HomeIcon className="h-4 w-4" />, count: 12 },
    {
        id: 'starred',
        name: 'files.starred',
        icon: <StarIcon className="h-4 w-4 text-yellow-500" />,
        count: 4,
    },
    {
        id: 'recent',
        name: 'files.recent',
        icon: <ClockIcon className="h-4 w-4 text-blue-500" />,
        count: 8,
    },
    {
        id: 'shared',
        name: 'files.sharedWithMe',
        icon: <ShareIcon className="h-4 w-4 text-green-500" />,
        count: 3,
    },
    {
        id: 'my-files',
        name: 'files.myFiles',
        icon: <FolderIconSolid className="h-4 w-4 text-yellow-500" />,
        children: [
            {
                id: 'documents',
                name: 'group.documents',
                children: [
                    { id: 'contracts', name: 'Contracts', count: 5 },
                    { id: 'reports', name: 'Reports', count: 12 },
                    { id: 'invoices', name: 'Invoices', count: 8 },
                ],
            },
            {
                id: 'images',
                name: 'Images',
                children: [
                    { id: 'photos', name: 'Photos', count: 45 },
                    { id: 'screenshots', name: 'Screenshots', count: 23 },
                ],
            },
            {
                id: 'projects',
                name: 'Projects',
                children: [
                    { id: 'web-app', name: 'Web App', count: 15 },
                    { id: 'mobile-app', name: 'Mobile App', count: 8 },
                    { id: 'designs', name: 'Designs', count: 12 },
                ],
            },
            { id: 'videos', name: 'Videos', count: 7 },
            { id: 'music', name: 'Music', count: 32 },
        ],
    },
    {
        id: 'trash',
        name: 'files.trash',
        icon: <TrashIconOutline className="h-4 w-4 text-red-500" />,
        count: 2,
    },
];

// Mock file data
interface FileItem {
    id: string;
    name: string;
    type: 'folder' | 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';
    size: number;
    modifiedAt: Date;
    createdAt: Date;
    path: string;
    starred: boolean;
    shared: boolean;
    owner: string;
    thumbnail?: string;
}

const mockFiles: FileItem[] = [
    {
        id: '1',
        name: 'Documents',
        type: 'folder',
        size: 0,
        modifiedAt: new Date('2024-01-15'),
        createdAt: new Date('2024-01-01'),
        path: '/',
        starred: true,
        shared: false,
        owner: 'Me',
    },
    {
        id: '2',
        name: 'Images',
        type: 'folder',
        size: 0,
        modifiedAt: new Date('2024-01-20'),
        createdAt: new Date('2024-01-02'),
        path: '/',
        starred: false,
        shared: true,
        owner: 'Me',
    },
    {
        id: '3',
        name: 'Projects',
        type: 'folder',
        size: 0,
        modifiedAt: new Date('2024-01-25'),
        createdAt: new Date('2024-01-03'),
        path: '/',
        starred: false,
        shared: false,
        owner: 'Me',
    },
    {
        id: '4',
        name: 'Annual Report 2024.pdf',
        type: 'document',
        size: 2540000,
        modifiedAt: new Date('2024-01-28'),
        createdAt: new Date('2024-01-10'),
        path: '/',
        starred: true,
        shared: true,
        owner: 'Me',
    },
    {
        id: '5',
        name: 'Meeting Notes.docx',
        type: 'document',
        size: 45000,
        modifiedAt: new Date('2024-01-27'),
        createdAt: new Date('2024-01-15'),
        path: '/',
        starred: false,
        shared: false,
        owner: 'Me',
    },
    {
        id: '6',
        name: 'Product Design.fig',
        type: 'other',
        size: 15600000,
        modifiedAt: new Date('2024-01-26'),
        createdAt: new Date('2024-01-20'),
        path: '/',
        starred: true,
        shared: true,
        owner: 'Me',
    },
    {
        id: '7',
        name: 'Team Photo.jpg',
        type: 'image',
        size: 4500000,
        modifiedAt: new Date('2024-01-24'),
        createdAt: new Date('2024-01-22'),
        path: '/',
        starred: false,
        shared: false,
        owner: 'Me',
    },
    {
        id: '8',
        name: 'Presentation.pptx',
        type: 'document',
        size: 8900000,
        modifiedAt: new Date('2024-01-23'),
        createdAt: new Date('2024-01-18'),
        path: '/',
        starred: false,
        shared: true,
        owner: 'Me',
    },
    {
        id: '9',
        name: 'Demo Video.mp4',
        type: 'video',
        size: 156000000,
        modifiedAt: new Date('2024-01-22'),
        createdAt: new Date('2024-01-19'),
        path: '/',
        starred: false,
        shared: false,
        owner: 'Me',
    },
    {
        id: '10',
        name: 'Podcast Episode.mp3',
        type: 'audio',
        size: 45000000,
        modifiedAt: new Date('2024-01-21'),
        createdAt: new Date('2024-01-21'),
        path: '/',
        starred: false,
        shared: false,
        owner: 'Me',
    },
    {
        id: '11',
        name: 'Backup.zip',
        type: 'archive',
        size: 890000000,
        modifiedAt: new Date('2024-01-20'),
        createdAt: new Date('2024-01-20'),
        path: '/',
        starred: false,
        shared: false,
        owner: 'Me',
    },
    {
        id: '12',
        name: 'Logo.svg',
        type: 'image',
        size: 15000,
        modifiedAt: new Date('2024-01-19'),
        createdAt: new Date('2024-01-19'),
        path: '/',
        starred: true,
        shared: true,
        owner: 'Me',
    },
];

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '-';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
};

const getFileIcon = (type: FileItem['type'], filename?: string, size: 'sm' | 'md' = 'md') => {
    const iconClass = size === 'sm' ? 'h-5 w-5' : 'h-10 w-10';

    // Check extension if filename is provided
    if (filename) {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') {
            return <DocumentIcon className={`${iconClass} text-red-600`} />;
        }
        if (['doc', 'docx'].includes(ext || '')) {
            return <DocumentTextIcon className={`${iconClass} text-blue-600`} />;
        }
        if (['xls', 'xlsx'].includes(ext || '')) {
            return <TableCellsIcon className={`${iconClass} text-green-600`} />;
        }
        if (['csv'].includes(ext || '')) {
            return <TableCellsIcon className={`${iconClass} text-green-600`} />;
        }
        if (['ppt', 'pptx'].includes(ext || '')) {
            return <PresentationChartBarIcon className={`${iconClass} text-orange-600`} />;
        }
    }

    switch (type) {
        case 'folder':
            return <FolderIcon className={`${iconClass} text-yellow-500`} />;
        case 'document':
            return <DocumentTextIcon className={`${iconClass} text-blue-500`} />;
        case 'image':
            return <PhotoIcon className={`${iconClass} text-green-500`} />;
        case 'video':
            return <FilmIcon className={`${iconClass} text-purple-500`} />;
        case 'audio':
            return <MusicalNoteIcon className={`${iconClass} text-pink-500`} />;
        case 'archive':
            return <ArchiveBoxIcon className={`${iconClass} text-orange-500`} />;
        default:
            return <DocumentIcon className={`${iconClass} text-gray-400`} />;
    }
};

const getFileColor = (type: FileItem['type'], filename?: string): string => {
    if (filename) {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return 'bg-red-50 dark:bg-red-900/20';
        if (['doc', 'docx'].includes(ext || '')) return 'bg-blue-50 dark:bg-blue-900/20';
        if (['xls', 'xlsx', 'csv'].includes(ext || '')) return 'bg-green-50 dark:bg-green-900/20';
        if (['ppt', 'pptx'].includes(ext || '')) return 'bg-orange-50 dark:bg-orange-900/20';
    }

    switch (type) {
        case 'folder':
            return 'bg-yellow-50 dark:bg-yellow-900/20';
        case 'document':
            return 'bg-blue-50 dark:bg-blue-900/20';
        case 'image':
            return 'bg-green-50 dark:bg-green-900/20';
        case 'video':
            return 'bg-purple-50 dark:bg-purple-900/20';
        case 'audio':
            return 'bg-pink-50 dark:bg-pink-900/20';
        case 'archive':
            return 'bg-orange-50 dark:bg-orange-900/20';
        default:
            return 'bg-gray-50 dark:bg-zinc-700/20';
    }
};

// Folder Tree Item Component
function FolderTreeItem({
    node,
    level = 0,
    selectedFolder,
    onSelect,
    expandedFolders,
    onToggleExpand,
}: {
    node: FolderNode;
    level?: number;
    selectedFolder: string;
    onSelect: (id: string) => void;
    expandedFolders: Set<string>;
    onToggleExpand: (id: string) => void;
}) {
    const { t } = useTranslation();
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedFolders.has(node.id);
    const isSelected = selectedFolder === node.id;

    return (
        <div>
            <div
                className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                    isSelected
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                }`}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                onClick={() => onSelect(node.id)}
            >
                {hasChildren ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleExpand(node.id);
                        }}
                        className="flex h-4 w-4 items-center justify-center"
                    >
                        {isExpanded ? (
                            <ChevronDownIcon className="h-3.5 w-3.5 text-gray-500" />
                        ) : (
                            <ChevronRightIcon className="h-3.5 w-3.5 text-gray-500" />
                        )}
                    </button>
                ) : (
                    <span className="w-4" />
                )}
                {node.icon ||
                    (isExpanded ? (
                        <FolderOpenIcon className="h-4 w-4 text-yellow-500" />
                    ) : (
                        <FolderIcon className="h-4 w-4 text-yellow-500" />
                    ))}
                <span className="flex-1 truncate font-medium">{t(node.name)}</span>
                {node.count !== undefined && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">{node.count}</span>
                )}
            </div>
            {hasChildren && isExpanded && (
                <div>
                    {node.children!.map((child) => (
                        <FolderTreeItem
                            key={child.id}
                            node={child}
                            level={level + 1}
                            selectedFolder={selectedFolder}
                            onSelect={onSelect}
                            expandedFolders={expandedFolders}
                            onToggleExpand={onToggleExpand}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function FilesList() {
    const { t } = useTranslation();
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const rowsPerPage = 12;
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

    // Folder tree state
    const [selectedFolder, setSelectedFolder] = useState('all');
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['my-files']));

    // Upload modal
    const {
        isOpen: isUploadOpen,
        onOpen: onUploadOpen,
        onOpenChange: onUploadOpenChange,
    } = useDisclosure();
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    // New folder modal
    const {
        isOpen: isFolderOpen,
        onOpen: onFolderOpen,
        onOpenChange: onFolderOpenChange,
    } = useDisclosure();
    const [newFolderName, setNewFolderName] = useState('');

    // Delete modal
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);

    const loadFiles = useCallback(async () => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setFiles(mockFiles);
        } catch (error) {
            console.error('Error loading files:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    const handleToggleExpand = (folderId: string) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(folderId)) {
            newExpanded.delete(folderId);
        } else {
            newExpanded.add(folderId);
        }
        setExpandedFolders(newExpanded);
    };

    // Filter and sort files
    const filteredFiles = useMemo(() => {
        let result = [...files];

        // Filter by selected folder
        if (selectedFolder === 'starred') {
            result = result.filter((f) => f.starred);
        } else if (selectedFolder === 'shared') {
            result = result.filter((f) => f.shared);
        }

        // Search filter
        if (search) {
            result = result.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
        }

        // Sort
        result.sort((a, b) => {
            if (a.type === 'folder' && b.type !== 'folder') return -1;
            if (a.type !== 'folder' && b.type === 'folder') return 1;
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'date':
                    return b.modifiedAt.getTime() - a.modifiedAt.getTime();
                case 'size':
                    return b.size - a.size;
                default:
                    return 0;
            }
        });

        return result;
    }, [files, search, sortBy, selectedFolder]);

    const totalPages = Math.ceil(filteredFiles.length / rowsPerPage);
    const paginatedFiles = filteredFiles.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleToggleStar = (file: FileItem) => {
        setFiles(files.map((f) => (f.id === file.id ? { ...f, starred: !f.starred } : f)));
    };

    const handleDeleteClick = (file: FileItem) => {
        setFileToDelete(file);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!fileToDelete) return;
        await new Promise((resolve) => setTimeout(resolve, 500));
        setFiles(files.filter((f) => f.id !== fileToDelete.id));
        setIsDeleteOpen(false);
        setFileToDelete(null);
    };

    const handleUpload = async () => {
        setIsUploading(true);
        setUploadProgress(0);
        for (let i = 0; i <= 100; i += 10) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            setUploadProgress(i);
        }
        const newFile: FileItem = {
            id: Date.now().toString(),
            name: 'Uploaded File.pdf',
            type: 'document',
            size: 1500000,
            modifiedAt: new Date(),
            createdAt: new Date(),
            path: '/',
            starred: false,
            shared: false,
            owner: 'Me',
        };
        setFiles([newFile, ...files]);
        setIsUploading(false);
        onUploadOpenChange();
    };

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;
        const newFolder: FileItem = {
            id: Date.now().toString(),
            name: newFolderName,
            type: 'folder',
            size: 0,
            modifiedAt: new Date(),
            createdAt: new Date(),
            path: '/',
            starred: false,
            shared: false,
            owner: 'Me',
        };
        setFiles([newFolder, ...files]);
        setNewFolderName('');
        onFolderOpenChange();
    };

    const handleSelectFile = (fileId: string) => {
        const newSelected = new Set(selectedFiles);
        if (newSelected.has(fileId)) {
            newSelected.delete(fileId);
        } else {
            newSelected.add(fileId);
        }
        setSelectedFiles(newSelected);
    };

    // Table columns
    const columns = [
        { name: t('files.name') || 'Name', uid: 'name', sortable: true },
        { name: t('files.modified') || 'Modified', uid: 'date', sortable: true },
        { name: t('files.size') || 'Size', uid: 'size', sortable: true },
        { name: t('files.actions') || 'Actions', uid: 'actions' },
    ];

    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: 'name',
        direction: 'ascending',
    });

    const renderCell = useCallback(
        (file: FileItem, columnKey: React.Key) => {
            switch (columnKey) {
                case 'name':
                    return (
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-lg ${getFileColor(file.type, file.name)}`}
                            >
                                {getFileIcon(file.type, file.name, 'sm')}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {file.name}
                                </span>
                                {file.starred && (
                                    <StarIconSolid className="h-3.5 w-3.5 text-yellow-500" />
                                )}
                                {file.shared && (
                                    <Chip size="sm" variant="flat" color="secondary">
                                        {t('files.shared') || 'Shared'}
                                    </Chip>
                                )}
                            </div>
                        </div>
                    );
                case 'date':
                    return (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(file.modifiedAt)}
                        </span>
                    );
                case 'size':
                    return (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.size)}
                        </span>
                    );
                case 'actions':
                    return (
                        <div className="flex items-center justify-end gap-1">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ArrowDownTrayIcon className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleStar(file);
                                }}
                            >
                                {file.starred ? (
                                    <StarIconSolid className="h-4 w-4 text-yellow-500" />
                                ) : (
                                    <StarIcon className="h-4 w-4 text-gray-500" />
                                )}
                            </Button>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <EllipsisVerticalIcon className="h-4 w-4" />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="File actions">
                                    <DropdownItem
                                        key="share"
                                        startContent={<ShareIcon className="h-4 w-4" />}
                                    >
                                        {t('files.share') || 'Share'}
                                    </DropdownItem>
                                    <DropdownItem
                                        key="rename"
                                        startContent={<PencilIcon className="h-4 w-4" />}
                                    >
                                        {t('files.rename') || 'Rename'}
                                    </DropdownItem>
                                    <DropdownItem
                                        key="delete"
                                        className="text-danger"
                                        color="danger"
                                        startContent={<TrashIcon className="h-4 w-4" />}
                                        onPress={() => handleDeleteClick(file)}
                                    >
                                        {t('common.delete') || 'Delete'}
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    );
                default:
                    return null;
            }
        },
        [t, handleToggleStar, handleDeleteClick]
    );

    const storageUsed = 4.2;
    const storageTotal = 15;
    const storagePercent = (storageUsed / storageTotal) * 100;

    return (
        <>
            <Breadcrumb
                items={[
                    { label: t('menu.group.documents') || 'Documents' },
                    { label: t('menu.files') || 'Files' },
                ]}
            />

            {/* Header */}
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {t('menu.files') || 'Files'}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {t('pages.filesDescription') || 'Manage your files and folders'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        color="primary"
                        onPress={onUploadOpen}
                        startContent={<CloudArrowUpIcon className="h-4 w-4" />}
                        radius="full"
                        className="font-medium"
                    >
                        {t('files.upload') || 'Upload'}
                    </Button>
                    <Button
                        variant="bordered"
                        onPress={onFolderOpen}
                        startContent={<FolderPlusIcon className="h-4 w-4" />}
                        radius="full"
                        className="font-medium"
                    >
                        {t('files.newFolder') || 'New Folder'}
                    </Button>
                    <Button
                        variant="bordered"
                        isIconOnly
                        startContent={
                            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        }
                        onPress={loadFiles}
                        isLoading={loading}
                        radius="full"
                    />
                </div>
            </div>

            {/* Main Layout: Sidebar + Content */}
            <div className="flex h-[calc(100vh-14rem)] items-start gap-6">
                {/* Folder Tree Sidebar */}
                <div className="hidden h-full w-64 shrink-0 rounded-xl border border-zinc-200 bg-white p-1 lg:block dark:border-zinc-700 dark:bg-zinc-800">
                    <div className="custom-scrollbar h-full overflow-y-auto rounded-lg">
                        <div className="p-3">
                            {/* Storage Info */}
                            <div className="sticky top-0 z-20 -mx-3 -mt-3 bg-white/95 p-3 backdrop-blur-sm dark:bg-zinc-800/95">
                                <div className="mb-4 rounded-lg bg-linear-to-r from-blue-50 to-purple-50 p-3 dark:from-blue-900/20 dark:to-purple-900/20">
                                    <div className="mb-2 flex items-center justify-between text-xs">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {t('files.storage') || 'Storage'}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            {storageUsed} / {storageTotal} GB
                                        </span>
                                    </div>
                                    <Progress
                                        value={storagePercent}
                                        color="primary"
                                        size="sm"
                                        aria-label="Storage usage"
                                    />
                                </div>
                            </div>

                            {/* Folder Tree */}
                            <div className="space-y-0.5">
                                {folderTree.map((node) => (
                                    <FolderTreeItem
                                        key={node.id}
                                        node={node}
                                        selectedFolder={selectedFolder}
                                        onSelect={setSelectedFolder}
                                        expandedFolders={expandedFolders}
                                        onToggleExpand={handleToggleExpand}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Files Content */}
                <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
                    {/* Filters & View Toggle */}
                    <div className="mb-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Input
                                    isClearable
                                    className="w-full sm:max-w-xs"
                                    placeholder={t('common.search') + '...'}
                                    startContent={
                                        <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                                    }
                                    value={search}
                                    onClear={() => handleSearchChange('')}
                                    onValueChange={handleSearchChange}
                                    variant="flat"
                                    radius="full"
                                    size="sm"
                                />
                                <Select
                                    className="w-full sm:w-32"
                                    selectedKeys={[sortBy]}
                                    onSelectionChange={(keys) =>
                                        setSortBy(Array.from(keys)[0] as 'name' | 'date' | 'size')
                                    }
                                    variant="flat"
                                    radius="full"
                                    size="sm"
                                >
                                    <SelectItem key="name">
                                        {t('files.sortName') || 'Name'}
                                    </SelectItem>
                                    <SelectItem key="date">
                                        {t('files.sortDate') || 'Date'}
                                    </SelectItem>
                                    <SelectItem key="size">
                                        {t('files.sortSize') || 'Size'}
                                    </SelectItem>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {filteredFiles.length} {t('files.items') || 'items'}
                                </span>
                                <Tabs
                                    aria-label="View mode"
                                    selectedKey={viewMode}
                                    onSelectionChange={(key) => setViewMode(key as 'grid' | 'list')}
                                    size="sm"
                                    radius="full"
                                    color="primary"
                                    classNames={{
                                        tabList:
                                            'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 p-1',
                                        cursor: 'bg-primary shadow-sm',
                                        tab: 'px-3',
                                        tabContent: 'group-data-[selected=true]:text-white',
                                    }}
                                >
                                    <Tab
                                        key="grid"
                                        title={
                                            <div className="flex items-center gap-1.5">
                                                <Squares2X2Icon className="h-4 w-4" />
                                                <span className="hidden sm:inline">
                                                    {t('files.grid') || 'Grid'}
                                                </span>
                                            </div>
                                        }
                                    />
                                    <Tab
                                        key="list"
                                        title={
                                            <div className="flex items-center gap-1.5">
                                                <ListBulletIcon className="h-4 w-4" />
                                                <span className="hidden sm:inline">
                                                    {t('files.list') || 'List'}
                                                </span>
                                            </div>
                                        }
                                    />
                                </Tabs>
                            </div>
                        </div>
                    </div>

                    {/* Files Grid/List */}
                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-600" />
                        </div>
                    ) : paginatedFiles.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700">
                            <FolderIcon className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                            <p className="mt-4 text-gray-500 dark:text-gray-400">
                                {t('files.noFiles') || 'No files found'}
                            </p>
                            <Button
                                color="primary"
                                variant="flat"
                                onPress={onUploadOpen}
                                className="mt-4"
                                radius="full"
                            >
                                {t('files.uploadFirst') || 'Upload your first file'}
                            </Button>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="custom-scrollbar flex-1 overflow-y-auto p-1">
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                                {paginatedFiles.map((file) => (
                                    <div
                                        key={file.id}
                                        className={`group relative cursor-pointer rounded-xl border bg-white p-4 transition-all hover:border-blue-300 hover:shadow-lg dark:bg-zinc-800 ${
                                            selectedFiles.has(file.id)
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                                                : 'border-zinc-200 dark:border-zinc-700 dark:hover:border-blue-600'
                                        }`}
                                        onClick={() => handleSelectFile(file.id)}
                                    >
                                        {file.starred && (
                                            <StarIconSolid className="absolute top-2 left-2 h-4 w-4 text-yellow-500" />
                                        )}
                                        <Dropdown>
                                            <DropdownTrigger>
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <EllipsisVerticalIcon className="h-4 w-4" />
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu aria-label="File actions">
                                                <DropdownItem
                                                    key="download"
                                                    startContent={
                                                        <ArrowDownTrayIcon className="h-4 w-4" />
                                                    }
                                                >
                                                    {t('files.download') || 'Download'}
                                                </DropdownItem>
                                                <DropdownItem
                                                    key="share"
                                                    startContent={<ShareIcon className="h-4 w-4" />}
                                                >
                                                    {t('files.share') || 'Share'}
                                                </DropdownItem>
                                                <DropdownItem
                                                    key="rename"
                                                    startContent={
                                                        <PencilIcon className="h-4 w-4" />
                                                    }
                                                >
                                                    {t('files.rename') || 'Rename'}
                                                </DropdownItem>
                                                <DropdownItem
                                                    key="star"
                                                    startContent={<StarIcon className="h-4 w-4" />}
                                                    onPress={() => handleToggleStar(file)}
                                                >
                                                    {file.starred
                                                        ? t('files.unstar') || 'Remove star'
                                                        : t('files.star') || 'Add star'}
                                                </DropdownItem>
                                                <DropdownItem
                                                    key="delete"
                                                    className="text-danger"
                                                    color="danger"
                                                    startContent={<TrashIcon className="h-4 w-4" />}
                                                    onPress={() => handleDeleteClick(file)}
                                                >
                                                    {t('common.delete') || 'Delete'}
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                        <div
                                            className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl ${getFileColor(file.type, file.name)}`}
                                        >
                                            {getFileIcon(file.type, file.name)}
                                        </div>
                                        <p className="truncate text-center text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {file.name}
                                        </p>
                                        <p className="mt-1 text-center text-xs text-gray-500 dark:text-gray-400">
                                            {file.type === 'folder'
                                                ? t('files.folder') || 'Folder'
                                                : formatFileSize(file.size)}
                                        </p>
                                        {file.shared && (
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                color="secondary"
                                                className="absolute bottom-2 left-2 text-xs"
                                            >
                                                {t('files.shared') || 'Shared'}
                                            </Chip>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-hidden p-1">
                            <Table
                                aria-label="Files list"
                                isHeaderSticky
                                selectionMode="multiple"
                                selectedKeys={selectedFiles}
                                onSelectionChange={(keys) => {
                                    if (keys === 'all') {
                                        setSelectedFiles(new Set(paginatedFiles.map((f) => f.id)));
                                    } else {
                                        setSelectedFiles(keys as Set<string>);
                                    }
                                }}
                                sortDescriptor={sortDescriptor}
                                onSortChange={setSortDescriptor}
                                classNames={{
                                    base: 'h-full overflow-hidden',
                                    table: 'min-h-[400px]',
                                    wrapper:
                                        'h-full overflow-y-auto custom-scrollbar shadow-none border border-zinc-200 dark:border-zinc-700 rounded-xl',
                                }}
                            >
                                <TableHeader columns={columns}>
                                    {(column) => (
                                        <TableColumn
                                            key={column.uid}
                                            align={column.uid === 'actions' ? 'end' : 'start'}
                                            allowsSorting={column.sortable}
                                        >
                                            {column.name}
                                        </TableColumn>
                                    )}
                                </TableHeader>
                                <TableBody
                                    items={paginatedFiles}
                                    emptyContent={t('files.noFiles') || 'No files found'}
                                >
                                    {(item) => (
                                        <TableRow key={item.id}>
                                            {(columnKey) => (
                                                <TableCell>{renderCell(item, columnKey)}</TableCell>
                                            )}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {(page - 1) * rowsPerPage + 1} -{' '}
                                {Math.min(page * rowsPerPage, filteredFiles.length)} of{' '}
                                {filteredFiles.length}
                            </span>
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={page}
                                total={totalPages}
                                onChange={setPage}
                                radius="full"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            <Modal
                isOpen={isUploadOpen}
                onOpenChange={onUploadOpenChange}
                classNames={{ base: 'rounded-2xl' }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{t('files.uploadFiles') || 'Upload Files'}</ModalHeader>
                            <ModalBody>
                                <div className="rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center transition-colors hover:border-blue-400 dark:border-zinc-600">
                                    <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                                        {t('files.dragDrop') ||
                                            'Drag and drop files here, or click to select'}
                                    </p>
                                    <Button
                                        color="primary"
                                        variant="flat"
                                        className="mt-4"
                                        radius="full"
                                    >
                                        {t('files.selectFiles') || 'Select Files'}
                                    </Button>
                                </div>
                                {isUploading && (
                                    <div className="mt-4">
                                        <Progress
                                            value={uploadProgress}
                                            color="primary"
                                            className="mb-2"
                                        />
                                        <p className="text-center text-sm text-gray-500">
                                            {t('files.uploading') || 'Uploading...'}{' '}
                                            {uploadProgress}%
                                        </p>
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose} radius="full">
                                    {t('common.cancel') || 'Cancel'}
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={handleUpload}
                                    isLoading={isUploading}
                                    radius="full"
                                >
                                    {t('files.upload') || 'Upload'}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* New Folder Modal */}
            <Modal
                isOpen={isFolderOpen}
                onOpenChange={onFolderOpenChange}
                classNames={{ base: 'rounded-2xl' }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{t('files.newFolder') || 'New Folder'}</ModalHeader>
                            <ModalBody>
                                <Input
                                    label={t('files.folderName') || 'Folder Name'}
                                    placeholder={t('files.enterFolderName') || 'Enter folder name'}
                                    value={newFolderName}
                                    onValueChange={setNewFolderName}
                                    variant="flat"
                                    radius="full"
                                    labelPlacement="outside"
                                    autoFocus
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose} radius="full">
                                    {t('common.cancel') || 'Cancel'}
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={handleCreateFolder}
                                    isDisabled={!newFolderName.trim()}
                                    radius="full"
                                >
                                    {t('common.create') || 'Create'}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                classNames={{ base: 'rounded-2xl' }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                {t('files.deleteConfirmTitle') || 'Delete File'}
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    {t('files.deleteConfirm') ||
                                        'Are you sure you want to delete this file?'}
                                </p>
                                {fileToDelete && (
                                    <div className="mt-3 flex items-center gap-3 rounded-xl bg-gray-100 p-3 dark:bg-zinc-800">
                                        {getFileIcon(fileToDelete.type)}
                                        <div>
                                            <p className="font-medium">{fileToDelete.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {formatFileSize(fileToDelete.size)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose} radius="full">
                                    {t('common.cancel') || 'Cancel'}
                                </Button>
                                <Button color="danger" onPress={handleConfirmDelete} radius="full">
                                    {t('common.delete') || 'Delete'}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export function MyFilesList() {
    return <FilesList />;
}
