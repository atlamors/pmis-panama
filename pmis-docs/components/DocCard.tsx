import React from 'react'
import Link from 'next/link'

type DocCardProps = {
    title: React.ReactNode
    href: string
    icon?: React.ReactNode
    arrow?: boolean
    className?: string
    children?: React.ReactNode
}

export default function DocCard({
    title,
    href,
    icon,
    arrow = true,
    className,
    children,
}: DocCardProps) {

    const baseClasses = [
        'x:group',
        'x:px-8',
        'x:py-4',
        'x:focus-visible:nextra-focus',
        'nextra-card',
        'x:flex',
        'x:flex-col',
        'x:justify-start',
        'x:overflow-hidden',
        'x:rounded-lg',
        'x:border',
        'x:border-blue-200',
        'x:text-current',
        'x:no-underline',
        'x:hover:shadow-md',
        'x:bg-transparent',
        'x:hover:bg-slate-50',
        'x:dark:hover:bg-neutral-900',
        'x:hover:border-gray-300',
        'x:transition-colors',
        'x:duration-200',
        'x:dark:border-neutral-700',
        'x:dark:hover:border-neutral-500',
    ]

    const headerClasses = [
        'x:flex',
        'x:gap-1',
        'x:items-center',
        'x:font-semibold',
    ]

    const arrowClasses = [
        'x:ms-2',
        'x:translate-x-0',
        'x:transition-all',
        'x:duration-150',
    ]

    return (
        <Link href={href} className={[...baseClasses, className].filter(Boolean).join(' ')}>
            <div className={headerClasses.join(' ')}>
                {/* <span className="x:inline-flex x:justify-center x:w-9 x:-ml-4" aria-hidden>
                    {icon}
                </span> */}
                <span className="x:flex-1 x:min-w-0 _truncate">{title}</span>
                {arrow && (
                    <svg
                        className={arrowClasses.join(' ')}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                    >
                        <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </div>
            {children ? (
                <div className="x:text-sm x:text-gray-600 x:dark:text-gray-300 x:ps-9">
                    {children}
                </div>
            ) : null}
        </Link>
    )
}


