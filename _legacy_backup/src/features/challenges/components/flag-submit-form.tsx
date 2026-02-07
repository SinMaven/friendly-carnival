'use client';

import { useState } from 'react';
import { IoCheckmarkCircle, IoCloseCircle, IoFlame, IoSend } from 'react-icons/io5';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

import { submitFlag, SubmitFlagResult } from '../actions/submit-flag';

interface FlagSubmitFormProps {
    challengeId: string;
    alreadySolved?: boolean;
    onSolve?: (result: SubmitFlagResult) => void;
}

export function FlagSubmitForm({ challengeId, alreadySolved, onSolve }: FlagSubmitFormProps) {
    const [flag, setFlag] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<SubmitFlagResult | null>(null);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!flag.trim() || isSubmitting || alreadySolved) return;

        setIsSubmitting(true);
        setResult(null);

        try {
            const submitResult = await submitFlag(challengeId, flag);
            setResult(submitResult);

            if (submitResult.success) {
                toast({
                    title: submitResult.is_first_blood ? '🩸 First Blood!' : '🎉 Correct!',
                    description: submitResult.message,
                });
                setFlag('');
                onSolve?.(submitResult);
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Incorrect',
                    description: submitResult.message,
                });
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Something went wrong. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (alreadySolved || result?.success) {
        return (
            <div className="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                <IoCheckmarkCircle className="h-6 w-6 text-green-500" />
                <span className="font-medium text-green-400">
                    {result?.is_first_blood ? '🩸 First Blood! Challenge Solved!' : 'Challenge Solved!'}
                </span>
                {result?.points_awarded && (
                    <span className="ml-auto flex items-center gap-1 text-green-400">
                        <IoFlame className="h-4 w-4" />
                        +{result.points_awarded} pts
                    </span>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
                <Input
                    type="text"
                    placeholder="DUCK{your_flag_here}"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    className="flex-1 border-zinc-700 bg-zinc-800/50 font-mono placeholder:text-zinc-600"
                    disabled={isSubmitting}
                />
                <Button
                    type="submit"
                    disabled={!flag.trim() || isSubmitting}
                    className="gap-2"
                >
                    <IoSend className="h-4 w-4" />
                    {isSubmitting ? 'Checking...' : 'Submit'}
                </Button>
            </div>

            {result && !result.success && (
                <div className="flex items-center gap-2 text-sm text-red-400">
                    <IoCloseCircle className="h-4 w-4" />
                    {result.message}
                </div>
            )}
        </form>
    );
}
