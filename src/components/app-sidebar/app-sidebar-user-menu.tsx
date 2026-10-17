'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useLogoutMutation } from '@/data/api/auth/auth.hooks';
import { isAdminRole, isVendorRole, useAuthStore } from '@/stores/auth-store';
import { Facehash } from 'facehash';
import { ChevronsUpDown, LogOut, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

function AppSidebarUserMenu() {
  const { isMobile, state } = useSidebar();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { mutate: logoutMutation, isPending: loggingOut } = useLogoutMutation();
  const { t: tCommon } = useTranslation('common');
  const { t: tEnum } = useTranslation('enum');

  const displayName = user?.username || user?.vendorName || user?.actorType || 'Guest';
  const roleLabel = user?.role ?? '';
  const canViewVendorAccount = isVendorRole();
  const canViewAdminProfile = isAdminRole();
  const avatarSize = state === 'collapsed' ? 28 : 32;

  const handleLogout = () => {
    const refreshToken = user?.refreshToken;
    if (refreshToken) {
      logoutMutation(refreshToken, {
        onSettled: () => {
          router.replace('/login');
        },
      });
    } else {
      logout();
      router.replace('/login');
    }
  };

  return (
    <SidebarMenu className='group-data-[collapsible=icon]:items-center'>
      <SidebarMenuItem className='group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center'
              disabled={loggingOut}
            >
              <Facehash
                name={displayName}
                size={avatarSize}
                colors={['var(--primary)', 'var(--primary)', 'var(--primary)']}
                className='rounded-full text-primary-foreground'
              />
              <div className='grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden'>
                <span className='truncate font-semibold'>{displayName}</span>
                <span className='truncate text-xs text-muted-foreground'>{tEnum(`USER_ROLE_ENUM.${roleLabel}` as any)}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4 group-data-[collapsible=icon]:hidden' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? 'bottom' : 'right'} align='end' className='w-56'>
            {(canViewVendorAccount || canViewAdminProfile) && (
              <DropdownMenuItem onClick={() => router.push(canViewVendorAccount ? '/vendor/account' : '/profile')}>
                <UserCircle />
                <span>{tCommon('sidebar_user_menu.profile')}</span>
              </DropdownMenuItem>
            )}
            {/* <DropdownMenuItem>
              <Settings />
              <span>{tCommon('sidebar_user_menu.settings')}</span>
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={loggingOut}>
              <LogOut />
              <span>{tCommon('sidebar_user_menu.log_out')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export { AppSidebarUserMenu };
