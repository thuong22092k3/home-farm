'use client';

import { AppSkeleton } from '@/components/app-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';

/**
 * Placeholder sidebar while auth store is rehydrating and user/role is not ready yet.
 */
function AppSidebarSkeleton() {
  return (
    <>
      <SidebarHeader>
        <div
          className='flex h-12 items-center gap-2 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0'
          aria-hidden
        >
          <Skeleton className='size-8 shrink-0 rounded-lg' />
          <div className='grid flex-1 gap-1.5 group-data-[collapsible=icon]:hidden'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-3 w-32' />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className='gap-0 px-2'>
        {[0, 1, 2].map((section) => (
          <div key={section} className='flex flex-col gap-2 py-2'>
            <Skeleton className='h-3 w-16' />
            {[0, 1, 2].map((row) => (
              <Skeleton key={row} className='h-9 w-full rounded-md' />
            ))}
          </div>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <AppSkeleton loading className='w-full' skeletonClassName='min-h-14 rounded-lg'>
          {/* Invisible layout shell so the overlay matches the real user menu height */}
          <div className='flex h-14 w-full items-center gap-2 px-2' aria-hidden>
            <div className='size-8 shrink-0' />
            <div className='grid min-w-0 flex-1 gap-1.5'>
              <div className='h-4 w-32' />
              <div className='h-3 w-24' />
            </div>
          </div>
        </AppSkeleton>
      </SidebarFooter>
    </>
  );
}

export { AppSidebarSkeleton };
