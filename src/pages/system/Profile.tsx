import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, Avatar, Chip, Switch, Divider } from '@heroui/react';
import {
    UserIcon,
    KeyIcon,
    BellIcon,
    CameraIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    BriefcaseIcon,
} from '@heroicons/react/24/outline';
import { PageHeader, Button, Input, Tabs, Tab, Textarea } from '@/components/common';

// Mock User Data
const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Administrator',
    department: 'Engineering',
    location: 'San Francisco, CA',
    bio: 'Senior Software Engineer with 10+ years of experience in full-stack development. Passionate about building scalable applications and mentoring junior developers.',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    joinDate: 'September 2021',
};

export function ProfilePage() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState('overview');

    // Form States
    const [formData, setFormData] = useState({ ...mockUser });
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // Show success message (toast implementation depends on project)
            console.log('Profile updated:', formData);
        }, 1000);
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            console.log('Password updated');
            setPasswordData({ current: '', new: '', confirm: '' });
        }, 1000);
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, avatar: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title={t('menu.profile')}
                breadcrumbs={[{ label: t('menu.system') }, { label: t('menu.profile') }]}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column: Sidebar / General Info */}
                <div className="space-y-6 lg:col-span-1">
                    <Card className="border-default-200 dark:border-default-100 border">
                        <CardBody className="flex flex-col items-center p-6 text-center">
                            <div className="relative mb-4">
                                <Avatar
                                    src={formData.avatar}
                                    className="text-large h-32 w-32"
                                    isBordered
                                    color="primary"
                                />
                                <button
                                    onClick={handleCameraClick}
                                    className="bg-primary absolute right-0 bottom-0 rounded-full p-2 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                                >
                                    <CameraIcon className="h-4 w-4" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {mockUser.firstName} {mockUser.lastName}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {mockUser.email}
                            </p>
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                <Chip color="primary" variant="flat" size="sm">
                                    {mockUser.role}
                                </Chip>
                                <Chip variant="flat" size="sm">
                                    {mockUser.department}
                                </Chip>
                            </div>

                            <Divider className="my-6" />

                            <div className="w-full space-y-4 text-left">
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                    <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                                    <span>Joined {mockUser.joinDate}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                                    <span>{mockUser.location}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                                    <span>{mockUser.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                    <span>{mockUser.email}</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Navigation for mobile could go here, but Tabs handle it well */}
                </div>

                {/* Right Column: Content */}
                <div className="lg:col-span-2">
                    <Tabs
                        aria-label="Profile options"
                        selectedKey={selectedTab}
                        onSelectionChange={(key) => setSelectedTab(key.toString())}
                    >
                        <Tab
                            key="overview"
                            title={
                                <div className="flex items-center space-x-2">
                                    <UserIcon className="h-4 w-4" />
                                    <span>Overview</span>
                                </div>
                            }
                        >
                            <Card className="border-default-200 dark:border-default-100 border">
                                <CardBody className="p-6">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Biography
                                            </h3>
                                            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                                {mockUser.bio}
                                            </p>
                                        </div>

                                        <Divider />

                                        <div>
                                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                                Personal Information
                                            </h3>
                                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Full Name
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                                        {mockUser.firstName} {mockUser.lastName}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Role
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                                        {mockUser.role}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Email address
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                                        {mockUser.email}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Phone
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                                        {mockUser.phone}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Department
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                                        {mockUser.department}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Location
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                                        {mockUser.location}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Tab>

                        <Tab
                            key="settings"
                            title={
                                <div className="flex items-center space-x-2">
                                    <BriefcaseIcon className="h-4 w-4" />
                                    <span>Settings</span>
                                </div>
                            }
                        >
                            <Card className="border-default-200 dark:border-default-100 border">
                                <CardBody className="p-6">
                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <Input
                                                label="First Name"
                                                value={formData.firstName}
                                                onValueChange={(val) =>
                                                    setFormData({ ...formData, firstName: val })
                                                }
                                            />
                                            <Input
                                                label="Last Name"
                                                value={formData.lastName}
                                                onValueChange={(val) =>
                                                    setFormData({ ...formData, lastName: val })
                                                }
                                            />
                                            <Input
                                                label="Email"
                                                value={formData.email}
                                                onValueChange={(val) =>
                                                    setFormData({ ...formData, email: val })
                                                }
                                            />
                                            <Input
                                                label="Phone"
                                                value={formData.phone}
                                                onValueChange={(val) =>
                                                    setFormData({ ...formData, phone: val })
                                                }
                                            />
                                            <div className="col-span-1 sm:col-span-2">
                                                <Textarea
                                                    label="Bio"
                                                    value={formData.bio}
                                                    onValueChange={(val: any) =>
                                                        setFormData({ ...formData, bio: val })
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <Button
                                                type="button"
                                                variant="light"
                                                onPress={() => setFormData({ ...mockUser })}
                                            >
                                                Reset
                                            </Button>
                                            <Button
                                                color="primary"
                                                type="submit"
                                                isLoading={isLoading}
                                            >
                                                Save Changes
                                            </Button>
                                        </div>
                                    </form>
                                </CardBody>
                            </Card>
                        </Tab>

                        <Tab
                            key="security"
                            title={
                                <div className="flex items-center space-x-2">
                                    <KeyIcon className="h-4 w-4" />
                                    <span>Security</span>
                                </div>
                            }
                        >
                            <Card className="border-default-200 dark:border-default-100 border">
                                <CardBody className="p-6">
                                    <form
                                        onSubmit={handleUpdatePassword}
                                        className="max-w-md space-y-6"
                                    >
                                        <div>
                                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                                Change Password
                                            </h3>
                                            <div className="space-y-4">
                                                <Input
                                                    label="Current Password"
                                                    type="password"
                                                    value={passwordData.current}
                                                    onValueChange={(val) =>
                                                        setPasswordData({
                                                            ...passwordData,
                                                            current: val,
                                                        })
                                                    }
                                                />
                                                <Input
                                                    label="New Password"
                                                    type="password"
                                                    value={passwordData.new}
                                                    onValueChange={(val) =>
                                                        setPasswordData({
                                                            ...passwordData,
                                                            new: val,
                                                        })
                                                    }
                                                />
                                                <Input
                                                    label="Confirm New Password"
                                                    type="password"
                                                    value={passwordData.confirm}
                                                    onValueChange={(val) =>
                                                        setPasswordData({
                                                            ...passwordData,
                                                            confirm: val,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <Button
                                                color="primary"
                                                type="submit"
                                                isLoading={isLoading}
                                                isDisabled={
                                                    !passwordData.current ||
                                                    !passwordData.new ||
                                                    !passwordData.confirm
                                                }
                                            >
                                                Update Password
                                            </Button>
                                        </div>
                                    </form>

                                    <Divider className="my-8" />

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                Two-Factor Authentication
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Add an extra layer of security to your account.
                                            </p>
                                        </div>
                                        <Switch defaultSelected color="primary">
                                            Enabled
                                        </Switch>
                                    </div>
                                </CardBody>
                            </Card>
                        </Tab>

                        <Tab
                            key="notifications"
                            title={
                                <div className="flex items-center space-x-2">
                                    <BellIcon className="h-4 w-4" />
                                    <span>Notifications</span>
                                </div>
                            }
                        >
                            <Card className="border-default-200 dark:border-default-100 border">
                                <CardBody className="p-6">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    Email Notifications
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Receive emails about account activity.
                                                </p>
                                            </div>
                                            <Switch defaultSelected color="primary" />
                                        </div>
                                        <Divider />
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    Push Notifications
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Receive push notifications on your device.
                                                </p>
                                            </div>
                                            <Switch color="primary" />
                                        </div>
                                        <Divider />
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    Marketing Emails
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Receive emails about new features and offers.
                                                </p>
                                            </div>
                                            <Switch defaultSelected color="primary" />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
