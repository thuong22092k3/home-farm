'use client';

import Image from 'next/image';
import { useMemo } from 'react';

import { AppSidebarSkeleton } from '@/components/app-sidebar/app-sidebar-skeleton';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { SUPER_ADMIN_NAV_ITEMS, VENDOR_NAV_ITEMS } from '@/data/navigation';
import { useAuthHydrated } from '@/hooks/use-auth-hydrated';
import { MENU_READ_PERMISSIONS, VENDOR_MENU_READ_PERMISSIONS } from '@/lib/constants/permission.constant';
import { UserRoleEnum } from '@/lib/enum/user-role.enum';
import { filterNavGroupsByPermissions } from '@/lib/helpers/permission.helper';
import { isVendorRole, useAuthStore } from '@/stores/auth-store';
import type { NavGroup } from '@/types/navigation.type';
import { AppSidebarNavGroup } from './app-sidebar-nav-group';
import { AppSidebarUserMenu } from './app-sidebar-user-menu';

const NAV_BY_ROLE: Record<UserRoleEnum, NavGroup[]> = {
  [UserRoleEnum.SUPER_ADMIN]: SUPER_ADMIN_NAV_ITEMS,
  //  [UserRoleEnum.ADMIN]: ADMIN_NAV_ITEMS,
  [UserRoleEnum.ADMIN]: SUPER_ADMIN_NAV_ITEMS,
  [UserRoleEnum.VENDOR_ADMIN]: VENDOR_NAV_ITEMS,
  [UserRoleEnum.VENDOR_STAFF]: VENDOR_NAV_ITEMS,
  [UserRoleEnum.CUSTOMER]: [],
};

function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((s) => s.user);
  const isAuthReady = useAuthHydrated();

  // const navGroups = user?.role ? (NAV_BY_ROLE[user.role] ?? []) : [];

  // Role selects the base tree; permissions then hide menus the user can't read.
  // globalAccess users keep the full tree (filter is a no-op).
  const navGroups = useMemo<NavGroup[]>(() => {
    if (!user?.role) return [];
    const baseGroups = NAV_BY_ROLE[user.role] ?? [];
    const menuPermissions = isVendorRole() ? VENDOR_MENU_READ_PERMISSIONS : MENU_READ_PERMISSIONS;
    return filterNavGroupsByPermissions(baseGroups, {
      permissionCodes: user.permissionCodes ?? [],
      menuPermissions,
    });
  }, [user]);

  return (
    <Sidebar collapsible='icon' {...props} aria-busy={!isAuthReady}>
      {!isAuthReady ? (
        <AppSidebarSkeleton />
      ) : (
        <>
          <SidebarHeader>
            <div
              className='flex h-12 items-center px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0'
              role='img'
              aria-label='Unrivaled'
            >
              <div className='relative h-8 w-[120px] shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out group-data-[collapsible=icon]:w-8'>
                <Image
                  src='/logo.svg'
                  alt='Unrivaled'
                  fill
                  priority
                  className='object-contain object-left transition-all duration-300 ease-in-out group-data-[collapsible=icon]:scale-95 group-data-[collapsible=icon]:opacity-0'
                />
                <Image
                  src='/favicon.svg'
                  alt='Unrivaled icon'
                  width={24}
                  height={24}
                  priority
                  className='absolute inset-0 m-auto size-6 object-contain transition-all duration-300 ease-in-out opacity-0 scale-75 group-data-[collapsible=icon]:opacity-100 group-data-[collapsible=icon]:scale-100'
                />
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            {navGroups.map((group) => (
              <AppSidebarNavGroup key={group.label} group={group} />
            ))}
          </SidebarContent>
          <SidebarFooter className='group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0'>
            <AppSidebarUserMenu />
          </SidebarFooter>
        </>
      )}
      <SidebarRail />
    </Sidebar>
  );
}

export { AppSidebar };
