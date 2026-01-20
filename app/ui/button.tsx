import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...rest 
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        {
          // Variants
          'bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-500': variant === 'primary',
          'bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 focus:ring-zinc-500': variant === 'secondary',
          'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 focus:ring-red-500': variant === 'danger',
          'bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus:ring-zinc-500': variant === 'ghost',
          // Sizes
          'px-3 py-1.5 text-xs': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-5 py-2.5 text-sm': size === 'lg',
          // Full width
          'w-full': fullWidth,
        },
        className
      )}
    >
      {children}
    </button>
  );
}