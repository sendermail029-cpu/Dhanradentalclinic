import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'success'

const variantStyles: Record<Variant, string> = {
  primary: 'bg-[#0f2f56] text-white hover:bg-[#123c6d]',
  secondary: 'bg-white text-[#0f2f56] ring-1 ring-[#d7e1eb] hover:bg-[#f7fafc]',
  ghost: 'bg-[#eef4f8] text-[#0f2f56] hover:bg-[#e4edf5]',
  success: 'bg-[#1c7c54] text-white hover:bg-[#176547]',
}

export default function ActionButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: Variant
}) {
  return (
    <button
      className={`inline-flex min-h-[52px] items-center justify-center rounded-2xl px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
