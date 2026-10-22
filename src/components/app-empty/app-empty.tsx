import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type AppEmptyProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
};

function AppEmpty({ title, description, icon, className }: AppEmptyProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-4 text-center', className)}>
      <span className='grid size-11 place-items-center rounded-full bg-muted text-muted-foreground'>
        {icon ?? <Inbox className='size-5' aria-hidden='true' />}
      </span>
      <p className='mt-3 text-sm font-semibold text-foreground'>{title}</p>
      {description ? <p className='mt-1 max-w-sm text-sm text-muted-foreground'>{description}</p> : null}
    </div>
  );
}

export { AppEmpty, type AppEmptyProps };
