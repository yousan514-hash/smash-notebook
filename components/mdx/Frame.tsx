"use client";
import { PropsWithChildren } from 'react';

export function Frame({ children }: PropsWithChildren) {
  return (
    <div className="my-3 rounded border border-gray-200 bg-gray-50 p-3">
      {children}
    </div>
  );
}
