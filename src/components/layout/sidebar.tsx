import React from 'react';
import { cn } from '../../lib/utils';

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-screen w-64 flex-col border-r bg-[#07234f] text-white",
        className
      )}
    >
      {/* ... rest of the sidebar content ... */}
    </div>
  )
} 