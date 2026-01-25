import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Tabs,
    Tab,
    Card,
    CardBody,
    Input,
    Button,
    Switch,
    Select,
    SelectItem,
    Avatar,
    Divider,
} from '@heroui/react';
import {
    UserIcon,
    BellIcon,
    ShieldCheckIcon,
    Cog6ToothIcon,
    PhotoIcon,
    MoonIcon,
    SunIcon
} from '@heroicons/react/24/outline';
import { Breadcrumb } from '@/components/layout';
import { useTheme } from '@/contexts/ThemeContext';

export function Settings() {
    const { t, i18n } = useTranslation();
    const { darkMode, toggleDarkMode } = useTheme();
    const [selectedTab, setSelectedTab] = useState("general");
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        marketing: false
    });

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    const handleLanguageChange = (keys: Set<string> | string) => {
        const lang = Array.from(keys)[0] as string;
        i18n.changeLanguage(lang);
    };

    return (
        <div className="w-full">
            <Breadcrumb items={[{ label: t('menu.settings') }]} />

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                    {t('menu.settings')}
                </h1>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-64 flex-shrink-0">
                    <Tabs
                        aria-label="Settings tabs"
                        selectedKey={selectedTab}
                        onSelectionChange={(key) => setSelectedTab(key as string)}
                        isVertical
                        color="primary"
                        variant="light"
                        classNames={{
                            tabList: "",
                            cursor: "w-full bg-white dark:bg-gray-700 shadow-sm rounded-full",
                            tab: "w-full px-4 h-12 justify-start",
                            tabContent: "group-data-[selected=true]:text-primary font-medium w-full text-left"
                        }}
                    >
                        <Tab
                            key="general"
                            title={
                                <div className="flex items-center space-x-3 w-full">
                                    <Cog6ToothIcon className="w-5 h-5" />
                                    <span>{t('settings.tabs.general')}</span>
                                </div>
                            }
                        />
                        <Tab
                            key="account"
                            title={
                                <div className="flex items-center space-x-3 w-full">
                                    <UserIcon className="w-5 h-5" />
                                    <span>{t('settings.tabs.account')}</span>
                                </div>
                            }
                        />
                        <Tab
                            key="notifications"
                            title={
                                <div className="flex items-center space-x-3 w-full">
                                    <BellIcon className="w-5 h-5" />
                                    <span>{t('settings.tabs.notifications')}</span>
                                </div>
                            }
                        />
                        <Tab
                            key="security"
                            title={
                                <div className="flex items-center space-x-3 w-full">
                                    <ShieldCheckIcon className="w-5 h-5" />
                                    <span>{t('settings.tabs.security')}</span>
                                </div>
                            }
                        />
                    </Tabs>
                </div>

                <div className="flex-1">
                    {selectedTab === "general" && (
                        <Card className="shadow-medium border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800">
                            <CardBody className="p-8 gap-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{t('settings.tabs.general')}</h3>
                                    <p className="text-sm text-gray-500 mb-6">Customize display and regional preferences</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Select
                                            label={t('settings.general.language')}
                                            placeholder="Select language"
                                            selectedKeys={[i18n.language]}
                                            onSelectionChange={(keys) => handleLanguageChange(keys as Set<string>)}
                                            variant="flat"
                                            labelPlacement="outside"
                                            radius="full"
                                            classNames={{
                                                trigger: "bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600",
                                            }}
                                        >
                                            <SelectItem key="en" startContent={<Avatar alt="English" className="w-6 h-6" src="/src/assets/flags/us.png" />}>English</SelectItem>
                                            <SelectItem key="vi" startContent={<Avatar alt="Tiếng Việt" className="w-6 h-6" src="/src/assets/flags/vn.png" />}>Tiếng Việt</SelectItem>
                                            <SelectItem key="ja" startContent={<Avatar alt="日本語" className="w-6 h-6" src="/src/assets/flags/jp.png" />}>日本語</SelectItem>
                                            <SelectItem key="zh" startContent={<Avatar alt="中文" className="w-6 h-6" src="/src/assets/flags/cn.png" />}>中文</SelectItem>
                                        </Select>

                                        <Select
                                            label={t('settings.general.timezone')}
                                            placeholder="Select timezone"
                                            defaultSelectedKeys={["utc-7"]}
                                            variant="flat"
                                            labelPlacement="outside"
                                            radius="full"
                                            classNames={{
                                                trigger: "bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600",
                                            }}
                                        >
                                            <SelectItem key="utc-7">Pacific Time (UTC-7)</SelectItem>
                                            <SelectItem key="utc+7">Indochina Time (UTC+7)</SelectItem>
                                            <SelectItem key="utc">UTC</SelectItem>
                                        </Select>
                                    </div>
                                </div>

                                <Divider className="opacity-50" />

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-base font-semibold">{t('settings.general.darkMode')}</p>
                                        <p className="text-sm text-gray-500">Switch between light and dark themes for better visibility</p>
                                    </div>
                                    <Switch
                                        isSelected={darkMode}
                                        onValueChange={toggleDarkMode}
                                        color="primary"
                                        size="lg"
                                        thumbIcon={({ isSelected, className }) =>
                                            isSelected ? (
                                                <MoonIcon className={className} />
                                            ) : (
                                                <SunIcon className={className} />
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button color="primary" onClick={handleSave} isLoading={isLoading} radius="full" className="px-8 font-semibold">
                                        {t('settings.save')}
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    )}

                    {selectedTab === "account" && (
                        <Card className="shadow-medium border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800">
                            <CardBody className="p-8 gap-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{t('settings.tabs.account')}</h3>
                                    <p className="text-sm text-gray-500 mb-6">Manage your personal information and profile</p>

                                    <div className="flex items-center gap-8 mb-8 p-6 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                                        <div className="relative group">
                                            <Avatar
                                                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                                                className="w-24 h-24 text-large ring-4 ring-white dark:ring-gray-800 shadow-xl"
                                                isBordered
                                            />
                                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <PhotoIcon className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <div>
                                                <h3 className="text-xl font-bold">Tony Reichert</h3>
                                                <p className="text-sm text-gray-500">CEO / Co-Founder</p>
                                            </div>
                                            <Button size="sm" variant="flat" color="primary" radius="full" startContent={<PhotoIcon className="w-4 h-4" />}>
                                                {t('settings.account.uploadAvatar')}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label={t('settings.account.name')}
                                            defaultValue="Tony Reichert"
                                            variant="flat"
                                            labelPlacement="outside"
                                            radius="full"
                                            classNames={{
                                                inputWrapper: "bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600",
                                            }}
                                        />
                                        <Input
                                            label={t('settings.account.email')}
                                            defaultValue="tony.reichert@example.com"
                                            variant="flat"
                                            labelPlacement="outside"
                                            radius="full"
                                            classNames={{
                                                inputWrapper: "bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600",
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button variant="light" color="danger" radius="full" className="font-medium">
                                        {t('settings.cancel')}
                                    </Button>
                                    <Button color="primary" onClick={handleSave} isLoading={isLoading} radius="full" className="px-8 font-semibold">
                                        {t('settings.save')}
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    )}

                    {selectedTab === "notifications" && (
                        <Card className="shadow-medium border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800">
                            <CardBody className="p-8 gap-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{t('settings.tabs.notifications')}</h3>
                                    <p className="text-sm text-gray-500 mb-6">Control how and when we communicate with you</p>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-base font-semibold">{t('settings.notifications.emailNotifications')}</p>
                                                <p className="text-sm text-gray-500">Receive emails about your account activity</p>
                                            </div>
                                            <Switch
                                                isSelected={notifications.email}
                                                onValueChange={(v) => setNotifications({ ...notifications, email: v })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-base font-semibold">{t('settings.notifications.pushNotifications')}</p>
                                                <p className="text-sm text-gray-500">Receive push notifications on your devices</p>
                                            </div>
                                            <Switch
                                                isSelected={notifications.push}
                                                onValueChange={(v) => setNotifications({ ...notifications, push: v })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-base font-semibold">{t('settings.notifications.marketingEmails')}</p>
                                                <p className="text-sm text-gray-500">Receive emails about new products and features</p>
                                            </div>
                                            <Switch
                                                isSelected={notifications.marketing}
                                                onValueChange={(v) => setNotifications({ ...notifications, marketing: v })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button color="primary" onClick={handleSave} isLoading={isLoading} radius="full" className="px-8 font-semibold">
                                        {t('settings.save')}
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    )}

                    {selectedTab === "security" && (
                        <Card className="shadow-medium border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800">
                            <CardBody className="p-8 gap-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{t('settings.tabs.security')}</h3>
                                    <p className="text-sm text-gray-500 mb-6">Ensure your account is secure with a strong password</p>

                                    <form className="flex flex-col gap-6 max-w-lg">
                                        <Input
                                            label={t('settings.security.currentPassword')}
                                            placeholder="Enter current password"
                                            type="password"
                                            variant="flat"
                                            labelPlacement="outside"
                                            radius="full"
                                            classNames={{
                                                inputWrapper: "bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600",
                                            }}
                                        />
                                        <Input
                                            label={t('settings.security.newPassword')}
                                            placeholder="Enter new password"
                                            type="password"
                                            variant="flat"
                                            labelPlacement="outside"
                                            radius="full"
                                            classNames={{
                                                inputWrapper: "bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600",
                                            }}
                                        />
                                        <Input
                                            label={t('settings.security.confirmPassword')}
                                            placeholder="Confirm new password"
                                            type="password"
                                            variant="flat"
                                            labelPlacement="outside"
                                            radius="full"
                                            classNames={{
                                                inputWrapper: "bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600",
                                            }}
                                        />
                                        <div className="flex justify-end pt-4">
                                            <Button color="primary" onClick={handleSave} isLoading={isLoading} radius="full" className="px-8 font-semibold">
                                                {t('settings.security.changePassword')}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </CardBody>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
