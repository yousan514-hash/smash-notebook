import { ComponentProps } from 'react';

export function Button(props: ComponentProps<'button'>) {
  const { className = '', ...rest } = props;
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 active:translate-y-px dark:border-gray-800 dark:hover:bg-gray-900 ${className}`}
    />
  );
}

export function Input(props: ComponentProps<'input'>) {
  const { className = '', ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full rounded-md border px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950 ${className}`}
    />
  );
}

export function Textarea(props: ComponentProps<'textarea'>) {
  const { className = '', ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full rounded-md border px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950 ${className}`}
    />
  );
}

export function Select(props: ComponentProps<'select'>) {
  const { className = '', ...rest } = props;
  return (
    <select
      {...rest}
      className={`w-full rounded-md border px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950 ${className}`}
    />
  );
}
