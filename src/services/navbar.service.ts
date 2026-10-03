'use client';

import { useEffect, useState } from 'react';
import type { NavbarItem } from '@/types';
import { MenuService } from './menu.service';

export { MenuService };

export function useNavbar(group?: string) {
    const [menuData, setMenuData] = useState<NavbarItem[]>(() => MenuService.getDummyMenu());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchMenu() {
            try {
                setIsLoading(true);
                const res = await MenuService.getMenu(group);
                if (isMounted && res?.data) {
                    setMenuData(res.data);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err : new Error('Failed to fetch menu'));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchMenu();

        return () => {
            isMounted = false;
        };
    }, [group]);

    return {
        menuData,
        isLoading,
        error,
        refetch: () => MenuService.getMenu(group),
    };
}
