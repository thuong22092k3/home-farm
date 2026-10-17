'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types/navigation.type';

type AppSidebarNavItemProps = {
  item: NavItem;
};

function AppSidebarNavItem({ item }: AppSidebarNavItemProps) {
  const pathname = usePathname();
  const { t: tEnum } = useTranslation('enum');
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const hasChildren = !!item.children?.length;

  const isChildActive = item.children?.some((child) => pathname === child.href) ?? false;
  const isParentActive = pathname === item.href;
  const isCurrentItemActive = isParentActive || isChildActive;

  // ── Expanded-mode: collapsible open state ──────────────────────────────
  // Derived-state pattern: sync isOpen whenever isCurrentItemActive flips,
  // without putting setState inside a useEffect body.
  const [isOpen, setIsOpen] = useState(isCurrentItemActive);
  const [prevIsCurrentItemActive, setPrevIsCurrentItemActive] = useState(isCurrentItemActive);
  if (isCurrentItemActive !== prevIsCurrentItemActive) {
    setPrevIsCurrentItemActive(isCurrentItemActive);
    setIsOpen(isCurrentItemActive);
  }

  // ── Collapsed-mode: hover popover open state ───────────────────────────
  // Use Popover (not DropdownMenu) — Popover has no click-toggle or
  // pointer-leave auto-dismiss logic, so it doesn't fight hover handlers.
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openPopover = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsPopoverOpen(true);
  };

  const closePopover = () => {
    closeTimerRef.current = setTimeout(() => setIsPopoverOpen(false), 150);
  };

  // ── Simple leaf item ───────────────────────────────────────────────────
  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton render={<Link href={item.href} />} tooltip={tEnum(`NAVIGATION_ITEMS.${item.label}`)} isActive={isParentActive}>
          {item.icon && <item.icon />}
          <span>{tEnum(`NAVIGATION_ITEMS.${item.label}`)}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // ── Collapsed: hover-triggered popover submenu ─────────────────────────
  if (isCollapsed) {
    return (
      <SidebarMenuItem>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <SidebarMenuButton isActive={isCurrentItemActive} className='cursor-pointer' onMouseEnter={openPopover} onMouseLeave={closePopover}>
              {item.icon && <item.icon />}
              <span>{tEnum(`NAVIGATION_ITEMS.${item.label}`)}</span>
            </SidebarMenuButton>
          </PopoverTrigger>

          <PopoverContent
            side='right'
            align='start'
            sideOffset={8}
            className='w-auto min-w-44 p-1'
            onMouseEnter={openPopover}
            onMouseLeave={closePopover}
            // Prevent Radix from closing when clicking a link inside
            onInteractOutside={(e) => {
              // Only close if the interaction is truly outside (not a link click
              // inside the popover — those close naturally via navigation)
              const target = e.target as HTMLElement;
              if (!target.closest('[data-slot="popover-content"]')) {
                closePopover();
              }
              e.preventDefault();
            }}
            // Don't steal focus from the page when the popover opens
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <p className='px-2 py-1 text-xs font-medium text-muted-foreground'>{tEnum(`NAVIGATION_ITEMS.${item.label}`)}</p>
            <div className='-mx-1 my-1 h-px bg-border' />
            {item.children!.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setIsPopoverOpen(false)}
                className={cn(
                  'flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  pathname === child.href && 'bg-primary/10 font-semibold text-primary',
                )}
              >
                {tEnum(`NAVIGATION_ITEMS.${child.label}`)}
              </Link>
            ))}
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    );
  }

  // ── Expanded: standard collapsible tree ───────────────────────────────
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton tooltip={tEnum(`NAVIGATION_ITEMS.${item.label}`)} isActive={isCurrentItemActive} className='cursor-pointer'>
              {item.icon && <item.icon />}
              <span>{tEnum(`NAVIGATION_ITEMS.${item.label}`)}</span>
              <ChevronRight className='ml-auto transition-transform duration-200 in-data-open:rotate-90' />
            </SidebarMenuButton>
          }
        />
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children!.map((child) => (
              <SidebarMenuSubItem key={child.href}>
                <SidebarMenuSubButton render={<Link href={child.href} />} isActive={pathname === child.href}>
                  <span>{tEnum(`NAVIGATION_ITEMS.${child.label}`)}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export { AppSidebarNavItem, type AppSidebarNavItemProps };
