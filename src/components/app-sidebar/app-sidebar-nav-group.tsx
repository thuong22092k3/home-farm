'use client';

import { useTranslation } from 'react-i18next';

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar';
import type { NavGroup } from '@/types/navigation.type';
import { AppSidebarNavItem } from './app-sidebar-nav-item';

type AppSidebarNavGroupProps = {
  group: NavGroup;
};

function AppSidebarNavGroup({ group }: AppSidebarNavGroupProps) {
  const { t: tEnum } = useTranslation('enum');

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{tEnum(`NAVIGATION_GROUPS.${group.label}`)}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item) => (
            <AppSidebarNavItem key={item.href} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export { AppSidebarNavGroup, type AppSidebarNavGroupProps };
