'use client';

import { AppIconButton } from '@/components/app-icon-button';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getNotificationsSystemAPI, markAsReadAllAPI, markAsReadAPI } from '@/data/api/notification/notification.api';
import { type NotificationSystemRES } from '@/data/api/notification/notification.res';
import { QUERY_KEYS } from '@/lib/constants/query-keys.constant';
import { NOTIFICATION_TYPE_ENUM } from '@/lib/enum/notification.enum';
import { cn } from '@/lib/utils';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ArrowUpRight, Bell, BellRing, CheckCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type UIEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

const NOTIFICATION_PAGE_SIZE = 10;

type AppNotificationAlarmProps = {
  target?: NOTIFICATION_TYPE_ENUM;
};

function AppNotificationAlarm({ target = NOTIFICATION_TYPE_ENUM.ADMIN }: AppNotificationAlarmProps) {
  const { t: tCommon } = useTranslation('common');
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.NOTIFICATION.LIST, target],
    queryFn: ({ pageParam }) =>
      getNotificationsSystemAPI({
        page: pageParam,
        size: NOTIFICATION_PAGE_SIZE,
        target,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: (id: number) => markAsReadAPI(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATION.LIST, target] });
    },
  });

  const { mutate: markAsReadAll, isPending: isMarkingAll } = useMutation({
    mutationFn: () => markAsReadAllAPI(target),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATION.LIST, target] });
    },
  });

  const notifications = data?.pages.flatMap((page) => page.data) ?? [];
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 80;

    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const handleOpenNotification = (notification: NotificationSystemRES) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    setOpen(false);

    if (notification.redirectUrl) {
      const targetUrl = notification.redirectUrl.trim();
      if (/^https?:\/\//i.test(targetUrl)) {
        window.location.assign(targetUrl);
        return;
      }
      router.push(targetUrl.startsWith('/') ? targetUrl : `/${targetUrl}`);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span className='relative inline-flex'>
          <AppIconButton
            icon={<Bell />}
            tooltip={tCommon('notification.alarm.tooltip')}
            size='sm'
            variant='ghost'
            aria-label={tCommon('notification.alarm.tooltip')}
          />
          {unreadCount > 0 && (
            <span className='pointer-events-none absolute -right-1 -top-1 flex min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-4.5 text-white'>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </span>
      </PopoverTrigger>

      <PopoverContent align='end' sideOffset={10} className='w-[min(25rem,calc(100vw-2rem))] gap-0 overflow-hidden rounded-xl p-0 shadow-xl'>
        <div className='flex items-center justify-between border-b bg-muted/25 px-4 py-3.5'>
          <div className='flex items-center gap-3'>
            <span className='flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <BellRing className='size-4.5' />
            </span>
            <div>
              <p className='font-semibold leading-5'>{tCommon('notification.alarm.title')}</p>
              <p className='text-xs text-muted-foreground'>{tCommon('notification.alarm.description')}</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <div className='flex items-center gap-2'>
              <span className='flex min-w-7 items-center justify-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive'>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>

              <Button
                variant='ghost'
                size='sm'
                onClick={() => markAsReadAll()}
                disabled={isMarkingAll}
                className='h-auto p-1 text-xs text-muted-foreground hover:text-primary'
                title={tCommon('notification.alarm.mark_all_read')}
              >
                <CheckCheck className='mr-1 size-3.5' />
                {tCommon('notification.alarm.read_all')}
              </Button>
            </div>
          )}
        </div>

        <div
          className='max-h-[28rem] overflow-y-auto overscroll-contain 
            scrollbar-thin scrollbar-color-primary
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-primary/50
            hover:[&::-webkit-scrollbar-thumb]:bg-primary/70'
          onScroll={handleScroll}
        >
          {isLoading ? (
            <div className='space-y-3 p-4'>
              {[1, 2, 3].map((item) => (
                <div key={item} className='h-14 animate-pulse rounded-md bg-muted' />
              ))}
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <button
                key={notification.id}
                type='button'
                onClick={() => handleOpenNotification(notification)}
                className={cn(
                  'group flex w-full gap-3 border-b px-4 py-3.5 text-left transition-colors last:border-b-0 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
                  !notification.isRead && 'bg-primary/[0.035]',
                )}
              >
                <span
                  className={cn(
                    'mt-2 size-2 shrink-0 rounded-full bg-muted-foreground/25',
                    !notification.isRead && 'bg-primary ring-4 ring-primary/10',
                  )}
                />

                {notification.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={notification.imageUrl} alt={notification.title} className='mt-0.5 size-9 shrink-0 rounded-md object-cover' />
                )}

                <span className='min-w-0 flex-1'>
                  <span className='flex items-start justify-between gap-3'>
                    <span className='truncate text-sm font-semibold'>{notification.title}</span>
                    {notification.redirectUrl && (
                      <ArrowUpRight className='mt-0.5 size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100' />
                    )}
                  </span>
                  <span className='mt-1 block line-clamp-2 text-sm text-foreground/80'>{notification.body}</span>

                  <span className='mt-1.5 flex items-center justify-between gap-3 text-xs text-muted-foreground'>
                    <span className='truncate'> {tCommon('notification.alarm.system_label') || 'System'}</span>
                    <time className='shrink-0'>{dayjs(notification.sentAt).format('YYYY.MM.DD - HH:mm')}</time>
                  </span>
                </span>
              </button>
            ))
          ) : (
            <p className='px-4 py-10 text-center text-sm text-muted-foreground'>{tCommon('notification.alarm.empty')}</p>
          )}

          {isFetchingNextPage && (
            <div className='flex items-center justify-center gap-1.5 py-4 text-xs text-muted-foreground'>
              <div className='flex items-center gap-1'>
                <span className='size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]' />
                <span className='size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]' />
                <span className='size-1.5 animate-bounce rounded-full bg-primary' />
              </div>
              <span className='ml-1 text-[11px] font-medium tracking-wide text-muted-foreground/80'>{tCommon('label.loading')}</span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { AppNotificationAlarm };
