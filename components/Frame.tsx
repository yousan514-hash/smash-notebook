import { ReactNode } from 'react';

interface FrameProps {
  children: ReactNode;
}

export function Frame({ children }: FrameProps) {
  return (
    <div className="my-3 rounded-md border border-gray-200 p-3 shadow-sm dark:border-gray-800">
      {children}
    </div>
  );
}
