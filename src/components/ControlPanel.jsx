import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, RotateCcw, Shuffle, Pause, SkipForward, ChevronLeft, ChevronRight } from 'lucide-react';

export function ControlPanel({
  onSolve,
  onReset,
  onClear,
  onGenerateRandom,
  onSkip,
  isSolving,
  isPaused,
  onTogglePause,
  speed,
  onSpeedChange,
  onPrevStep,
  onNextStep,
  currentStep = 0,
  totalSteps = 0,
  isStepMode = false,
}) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      {/* Main Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        {!isSolving ? (
          <Button
            onClick={onSolve}
            size="lg"
            className="flex-1 min-w-[140px] gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
          >
            <Play className="w-5 h-5" />
            Solve
          </Button>
        ) : (
          <>
            <Button
              onClick={onTogglePause}
              size="lg"
              variant="secondary"
              className="flex-1 min-w-[100px] gap-2 shadow-md"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              onClick={onSkip}
              size="lg"
              variant="outline"
              className="gap-2 shadow-md"
            >
              <SkipForward className="w-5 h-5" />
              Skip
            </Button>
          </>
        )}
      </div>

      {/* Step Navigation */}
      {(isSolving && isPaused) || isStepMode ? (
        <div className="p-4 bg-card rounded-lg border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Step Navigation</span>
            <span className="text-sm font-mono text-foreground">
              {currentStep} / {totalSteps}
            </span>
          </div>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={onPrevStep}
              variant="outline"
              size="lg"
              disabled={currentStep <= 0}
              className="flex-1 gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Prev Step
            </Button>
            <Button
              onClick={onNextStep}
              variant="outline"
              size="lg"
              disabled={currentStep >= totalSteps}
              className="flex-1 gap-2"
            >
              Next Step
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-200"
              style={{ width: totalSteps > 0 ? `${(currentStep / totalSteps) * 100}%` : '0%' }}
            />
          </div>
        </div>
      ) : null}

      {/* Secondary Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          onClick={onGenerateRandom}
          variant="secondary"
          disabled={isSolving}
          className="flex-1 min-w-[100px] gap-2"
        >
          <Shuffle className="w-4 h-4" />
          Random
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          disabled={isSolving}
          className="flex-1 min-w-[100px] gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        <Button
          onClick={onClear}
          variant="ghost"
          disabled={isSolving}
          className="gap-2 text-muted-foreground hover:text-destructive"
        >
          Clear All
        </Button>
      </div>

      {/* Speed Control */}
      <div className="space-y-3 p-4 bg-card rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Animation Speed</span>
          <span className="text-sm font-mono text-foreground">{speed}ms</span>
        </div>
        <Slider
          value={[speed]}
          onValueChange={([value]) => onSpeedChange(value)}
          min={10}
          max={500}
          step={10}
          disabled={isSolving && !isPaused}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Fast</span>
          <span>Slow</span>
        </div>
      </div>
    </div>
  );
}