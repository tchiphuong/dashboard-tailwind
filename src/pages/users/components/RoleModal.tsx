import { useState, useEffect } from 'react';
import { Checkbox, Divider } from '@heroui/react';
import { Modal, Button, Input } from '@/components/common';
import { useTranslation } from 'react-i18next';
import { Role, MODULES, AVAILABLE_PERMISSIONS } from '../roles-data';

interface RoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (role: Omit<Role, 'id' | 'usersCount'> & { id?: number }) => void;
    role?: Role;
}

export function RoleModal({ isOpen, onClose, onSave, role }: RoleModalProps) {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (role) {
                setName(role.name);
                setDescription(role.description);
                setSelectedPermissions(role.permissions);
            } else {
                setName('');
                setDescription('');
                setSelectedPermissions([]);
            }
            setError('');
        }
    }, [isOpen, role]);

    const handleSubmit = () => {
        if (!name.trim()) {
            setError(t('users.roles.form.nameRequired'));
            return;
        }

        onSave({
            id: role?.id,
            name,
            description,
            permissions: selectedPermissions,
        });
        onClose();
    };

    const togglePermission = (permissionId: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const toggleModule = (module: string) => {
        const modulePermissions = AVAILABLE_PERMISSIONS.filter((p) => p.module === module).map(
            (p) => p.id
        );
        const allSelected = modulePermissions.every((id) => selectedPermissions.includes(id));

        if (allSelected) {
            setSelectedPermissions((prev) => prev.filter((id) => !modulePermissions.includes(id)));
        } else {
            setSelectedPermissions((prev) => {
                const unique = new Set([...prev, ...modulePermissions]);
                return Array.from(unique);
            });
        }
    };

    const isModuleSelected = (module: string) => {
        const modulePermissions = AVAILABLE_PERMISSIONS.filter((p) => p.module === module).map(
            (p) => p.id
        );
        if (modulePermissions.length === 0) return false;
        return modulePermissions.every((id) => selectedPermissions.includes(id));
    };

    const isModuleIndeterminate = (module: string) => {
        const modulePermissions = AVAILABLE_PERMISSIONS.filter((p) => p.module === module).map(
            (p) => p.id
        );
        const selectedCount = modulePermissions.filter((id) =>
            selectedPermissions.includes(id)
        ).length;
        return selectedCount > 0 && selectedCount < modulePermissions.length;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="3xl"
            title={role ? t('users.roles.edit') : t('users.roles.add')}
            footer={
                <>
                    <Button color="danger" variant="light" onPress={onClose}>
                        {t('common.cancel')}
                    </Button>
                    <Button color="primary" onPress={handleSubmit}>
                        {t('common.save')}
                    </Button>
                </>
            }
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 md:flex-row">
                    <Input
                        label={t('users.roles.form.name')}
                        placeholder={t('users.roles.form.namePlaceholder')}
                        value={name}
                        onValueChange={setName}
                        isRequired
                        errorMessage={error}
                        isInvalid={!!error}
                        variant="bordered"
                        labelPlacement="outside"
                    />
                    <Input
                        label={t('users.roles.form.description')}
                        placeholder={t('users.roles.form.descriptionPlaceholder')}
                        value={description}
                        onValueChange={setDescription}
                        variant="bordered"
                        labelPlacement="outside"
                    />
                </div>

                <Divider className="my-2" />

                <div>
                    <h4 className="text-medium mb-3 font-medium">
                        {t('users.roles.form.permissions')}
                    </h4>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {MODULES.map((module) => {
                            const moduleParams = AVAILABLE_PERMISSIONS.filter(
                                (p) => p.module === module
                            );
                            if (moduleParams.length === 0) return null;

                            return (
                                <div key={module} className="flex flex-col gap-2">
                                    <Checkbox
                                        isSelected={isModuleSelected(module)}
                                        isIndeterminate={isModuleIndeterminate(module)}
                                        onValueChange={() => toggleModule(module)}
                                        classNames={{
                                            label: 'font-semibold text-small',
                                        }}
                                    >
                                        {module}
                                    </Checkbox>
                                    <div className="border-default-200 ml-6 flex flex-col gap-1 border-l-2 pl-2">
                                        {moduleParams.map((perm) => (
                                            <Checkbox
                                                key={perm.id}
                                                size="sm"
                                                isSelected={selectedPermissions.includes(perm.id)}
                                                onValueChange={() => togglePermission(perm.id)}
                                            >
                                                {perm.name}
                                            </Checkbox>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
