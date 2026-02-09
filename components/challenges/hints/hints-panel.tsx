'use client';

import { useState, useCallback } from 'react';
import { Lightbulb, Lock, Unlock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getChallengeHints } from '@/features/challenges/actions/hints/get-hints';
import { unlockHint } from '@/features/challenges/actions/hints/unlock-hint';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Hint {
  id: string;
  order_index: number;
  cost_points: number;
  is_unlocked: boolean;
  content: string | null;
  unlocked_at: string | null;
}

interface HintsPanelProps {
  challengeId: string;
  userPoints: number;
  initialHints?: Hint[];
}

export function HintsPanel({ challengeId, userPoints, initialHints = [] }: HintsPanelProps) {
  const [hints, setHints] = useState<Hint[]>(initialHints);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHint, setSelectedHint] = useState<Hint | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const loadHints = useCallback(async () => {
    setIsLoading(true);
    const result = await getChallengeHints(challengeId);
    if (result.success && result.hints) {
      setHints(result.hints);
    }
    setIsLoading(false);
  }, [challengeId]);

  const handleUnlockClick = (hint: Hint) => {
    if (hint.is_unlocked) return;
    setSelectedHint(hint);
    setConfirmDialogOpen(true);
  };

  const confirmUnlock = async () => {
    if (!selectedHint) return;

    setIsUnlocking(true);
    const result = await unlockHint(selectedHint.id, challengeId);
    setIsUnlocking(false);
    setConfirmDialogOpen(false);

    if (result.success) {
      toast.success('Hint unlocked!');
      // Update the hint in the list
      setHints(prev =>
        prev.map(h =>
          h.id === selectedHint.id
            ? { ...h, is_unlocked: true, content: result.content || h.content }
            : h
        )
      );
    } else {
      toast.error(result.message);
    }
  };

  const totalUnlocked = hints.filter(h => h.is_unlocked).length;
  const totalHints = hints.length;
  const totalCostToUnlockAll = hints
    .filter(h => !h.is_unlocked)
    .reduce((sum, h) => sum + h.cost_points, 0);

  if (isLoading && hints.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Hints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-12 bg-muted rounded animate-pulse" />
            <div className="h-12 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (totalHints === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Hints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No hints available for this challenge.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Hints ({totalUnlocked}/{totalHints})
            </span>
            {totalUnlocked < totalHints && (
              <span className="text-sm font-normal text-muted-foreground">
                {userPoints} points available
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {hints.map((hint, index) => (
            <div
              key={hint.id}
              className={cn(
                'border rounded-lg p-4 transition-colors',
                hint.is_unlocked
                  ? 'bg-muted/50 border-muted'
                  : 'bg-card hover:bg-muted/30 cursor-pointer'
              )}
              onClick={() => !hint.is_unlocked && handleUnlockClick(hint)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {hint.is_unlocked ? (
                      <Unlock className="h-4 w-4 text-green-500" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">Hint {index + 1}</span>
                    {!hint.is_unlocked && (
                      <span className="text-sm text-muted-foreground">
                        ({hint.cost_points} points)
                      </span>
                    )}
                  </div>
                  
                  {hint.is_unlocked ? (
                    <p className="text-sm">{hint.content}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Click to unlock for {hint.cost_points} points
                    </p>
                  )}
                </div>
                
                {!hint.is_unlocked && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={userPoints < hint.cost_points}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnlockClick(hint);
                    }}
                  >
                    Unlock
                  </Button>
                )}
              </div>
            </div>
          ))}

          {totalUnlocked < totalHints && totalCostToUnlockAll > userPoints && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You need {totalCostToUnlockAll} points to unlock all hints. 
                You currently have {userPoints} points.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Hint?</DialogTitle>
            <DialogDescription>
              This will deduct {selectedHint?.cost_points} points from your total.
              You currently have {userPoints} points.
            </DialogDescription>
          </DialogHeader>
          
          {selectedHint && userPoints < selectedHint.cost_points && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You don&apos;t have enough points to unlock this hint.
              </AlertDescription>
            </Alert>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmUnlock}
              disabled={isUnlocking || (selectedHint ? userPoints < selectedHint.cost_points : false)}
            >
              {isUnlocking ? 'Unlocking...' : 'Confirm Unlock'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
