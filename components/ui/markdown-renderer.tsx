'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import { cn } from '@/lib/utils'
import 'highlight.js/styles/github-dark.css'

interface MarkdownRendererProps {
    content: string
    className?: string
}

/**
 * Safe markdown renderer with syntax highlighting and sanitization.
 * Uses rehype-sanitize to prevent XSS attacks from malicious content.
 */
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    return (
        <div className={cn('prose prose-neutral dark:prose-invert max-w-none', className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize, rehypeHighlight]}
                components={{
                    // Custom code block styling
                    pre: ({ children, ...props }) => (
                        <pre
                            className="overflow-x-auto p-4 rounded-lg bg-muted/50 border"
                            {...props}
                        >
                            {children}
                        </pre>
                    ),
                    code: ({ className, children, ...props }) => {
                        const isInline = !className
                        return (
                            <code
                                className={cn(
                                    isInline && 'bg-muted/50 px-1.5 py-0.5 rounded text-sm font-mono',
                                    className
                                )}
                                {...props}
                            >
                                {children}
                            </code>
                        )
                    },
                    // Custom link styling - open external links in new tab
                    a: ({ href, children, ...props }) => (
                        <a
                            href={href}
                            target={href?.startsWith('http') ? '_blank' : undefined}
                            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="text-primary hover:underline"
                            {...props}
                        >
                            {children}
                        </a>
                    ),
                    // Custom table styling
                    table: ({ children, ...props }) => (
                        <div className="overflow-x-auto my-4">
                            <table className="min-w-full border-collapse border border-border" {...props}>
                                {children}
                            </table>
                        </div>
                    ),
                    th: ({ children, ...props }) => (
                        <th className="border border-border bg-muted/50 px-4 py-2 text-left font-semibold" {...props}>
                            {children}
                        </th>
                    ),
                    td: ({ children, ...props }) => (
                        <td className="border border-border px-4 py-2" {...props}>
                            {children}
                        </td>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
