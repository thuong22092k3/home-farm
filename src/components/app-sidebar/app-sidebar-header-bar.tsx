'use client';

import { AppLanguageSwitcher } from '@/components/app-language-switcher';
import { AppThemeToggle } from '@/components/app-theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthStore } from '@/stores/auth-store';
import { usePathname } from 'next/navigation';

function AppSidebarHeaderBar() {
  const pathname = usePathname();
  const isVendorArea = pathname.startsWith('/vendor');
  const user = useAuthStore((state) => state.user);

  return (
    <header className='flex h-14 shrink-0 items-center gap-2 border-b px-4'>
      <SidebarTrigger />
      <div className='ml-auto flex items-center gap-1'>
        {/* <AppNotificationAlarm target={user?.actorType as any} /> */}
        <AppLanguageSwitcher />
        <AppThemeToggle size='sm' variant='ghost' />
      </div>
    </header>
  );
}

export { AppSidebarHeaderBar };
