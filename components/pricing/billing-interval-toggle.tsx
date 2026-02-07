'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BillingIntervalToggleProps {
    value: 'month' | 'year'
    onChange: (value: 'month' | 'year') => void
}

export function BillingIntervalToggle({ value, onChange }: BillingIntervalToggleProps) {
    return (
        <div className="inline-flex items-center gap-2 p-1  bg-muted">
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    'rounded-md px-4',
                    value === 'month' && 'bg-background shadow-sm'
                )}
                onClick={() => onChange('month')}
            >
                Monthly
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    'rounded-md px-4',
                    value === 'year' && 'bg-background shadow-sm'
                )}
                onClick={() => onChange('year')}
            >
                Yearly
                <span className="ml-1 text-xs text-green-500">Save 20%</span>
            </Button>
        </div>
    )
}
