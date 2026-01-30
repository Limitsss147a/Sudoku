import { useState, useCallback, useRef, useEffect } from 'react';
import { createEmptyGrid, generateRandomPuzzle, collectSolveSteps, isGridValid } from '@/utils/sudokuSolver';
import { SudokuGrid } from './SudokuGrid';
import { ControlPanel } from './ControlPanel';
import { Legend } from './Legend';
import { useToast } from '@/hooks/use-toast';

export function SudokuSolver() {
  const [grid, setGrid] = useState(() => generateRandomPuzzle());
  const [originalGrid, setOriginalGrid] = useState(() => 
    grid.map(row => row.map(cell => ({ ...cell })))
  );
  const [isSolving, setIsSolving] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [animatingCell, setAnimatingCell] = useState(null);
  const [speed, setSpeed] = useState(100);
  const [currentStep, setCurrentStep] = useState(0);
  const [isStepMode, setIsStepMode] = useState(false);
  
  const solveStepsRef = useRef([]);
  const currentStepRef = useRef(0);
  const isPausedRef = useRef(false);
  const shouldSkipRef = useRef(false);
  const solveGridRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Apply grid state up to a specific step
  const applyGridToStep = useCallback((targetStep) => {
    if (!solveGridRef.current) return;
    
    const steps = solveStepsRef.current;
    const newGrid = solveGridRef.current.map(row => row.map(cell => ({ ...cell })));
    
    // Apply all steps up to targetStep
    for (let i = 0; i < targetStep && i < steps.length; i++) {
      const step = steps[i];
      newGrid[step.row][step.col] = {
        ...newGrid[step.row][step.col],
        value: step.value,
        state: step.state,
      };
    }
    
    setGrid(newGrid);
    setCurrentStep(targetStep);
    currentStepRef.current = targetStep;
    
    // Set animating cell for current step
    if (targetStep > 0 && targetStep <= steps.length) {
      const step = steps[targetStep - 1];
      setAnimatingCell({ row: step.row, col: step.col, state: step.state });
    } else {
      setAnimatingCell(null);
    }
  }, []);

  const handlePrevStep = useCallback(() => {
    if (currentStepRef.current > 0) {
      applyGridToStep(currentStepRef.current - 1);
    }
  }, [applyGridToStep]);

  const handleNextStep = useCallback(() => {
    const steps = solveStepsRef.current;
    if (currentStepRef.current < steps.length) {
      applyGridToStep(currentStepRef.current + 1);
      
      // Check if we've reached the end
      if (currentStepRef.current >= steps.length) {
        setIsSolving(false);
        setIsStepMode(false);
        toast({
          title: "Solved! 🎉",
          description: "The puzzle has been solved successfully.",
        });
      }
    }
  }, [applyGridToStep, toast]);

  const handleCellChange = useCallback((row, col, value) => {
    setGrid(prev => {
      const newGrid = prev.map(r => r.map(c => ({ ...c })));
      newGrid[row][col] = {
        value,
        state: value !== null ? 'input' : 'empty',
        isFixed: false,
      };
      return newGrid;
    });
  }, []);

  const handleSolve = useCallback(async () => {
    // Validate grid first
    if (!isGridValid(grid)) {
      toast({
        title: "Invalid Puzzle",
        description: "Konfigurasi puzzle saat ini salah. Tolong input kembali.",
        variant: "destructive",
      });
      return;
    }

    // Mark all user inputs as fixed for solving
    const solveGrid = grid.map(row =>
      row.map(cell => ({
        ...cell,
        isFixed: cell.value !== null,
        state: cell.value !== null ? 'fixed' : 'empty',
      }))
    );

    setGrid(solveGrid);
    setOriginalGrid(solveGrid.map(row => row.map(cell => ({ ...cell }))));
    solveGridRef.current = solveGrid.map(row => row.map(cell => ({ ...cell })));
    setIsSolving(true);
    setIsPaused(false);
    setIsStepMode(false);
    shouldSkipRef.current = false;

    // Use the optimized solver with MRV heuristic
    const steps = collectSolveSteps(solveGrid);
    solveStepsRef.current = steps;
    currentStepRef.current = 0;
    setCurrentStep(0);

    if (steps.length === 0) {
      toast({
        title: "Already Solved",
        description: "The puzzle is already complete!",
      });
      setIsSolving(false);
      return;
    }

    // Animate steps
    const animateStep = async (index) => {
      if (index >= steps.length) {
        setIsSolving(false);
        setAnimatingCell(null);
        toast({
          title: "Solved! 🎉",
          description: `Completed in ${steps.length} steps using MRV heuristic.`,
        });
        return;
      }

      // Check for skip
      if (shouldSkipRef.current) {
        // Apply all remaining steps instantly
        setGrid(prev => {
          const newGrid = prev.map(r => r.map(c => ({ ...c })));
          for (let i = index; i < steps.length; i++) {
            const step = steps[i];
            newGrid[step.row][step.col] = {
              ...newGrid[step.row][step.col],
              value: step.value,
              state: step.state === 'success' ? 'success' : newGrid[step.row][step.col].state,
            };
          }
          // Mark all filled cells as success
          for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
              if (newGrid[r][c].value !== null && !newGrid[r][c].isFixed) {
                newGrid[r][c].state = 'success';
              }
            }
          }
          return newGrid;
        });
        setCurrentStep(steps.length);
        setIsSolving(false);
        setAnimatingCell(null);
        toast({
          title: "Solved! 🎉",
          description: `Completed in ${steps.length} steps using MRV heuristic.`,
        });
        return;
      }

      // Wait while paused - enable step mode
      while (isPausedRef.current) {
        setIsStepMode(true);
        await new Promise(resolve => setTimeout(resolve, 100));
        if (shouldSkipRef.current) {
          return animateStep(index);
        }
        // Check if step changed externally (via manual navigation)
        if (currentStepRef.current !== index) {
          return animateStep(currentStepRef.current);
        }
      }
      setIsStepMode(false);

      const step = steps[index];
      currentStepRef.current = index;
      setCurrentStep(index);

      setAnimatingCell({ row: step.row, col: step.col, state: step.state });
      setGrid(prev => {
        const newGrid = prev.map(r => r.map(c => ({ ...c })));
        newGrid[step.row][step.col] = {
          ...newGrid[step.row][step.col],
          value: step.value,
          state: step.state,
        };
        return newGrid;
      });

      await new Promise(resolve => setTimeout(resolve, speed));
      animateStep(index + 1);
    };

    animateStep(0);
  }, [grid, speed, toast]);

  const handleReset = useCallback(() => {
    setGrid(originalGrid.map(row => row.map(cell => ({ ...cell }))));
    setAnimatingCell(null);
    setCurrentStep(0);
    setIsStepMode(false);
  }, [originalGrid]);

  const handleClear = useCallback(() => {
    const emptyGrid = createEmptyGrid();
    setGrid(emptyGrid);
    setOriginalGrid(emptyGrid);
    setAnimatingCell(null);
    setCurrentStep(0);
    setIsStepMode(false);
    solveStepsRef.current = [];
  }, []);

  const handleGenerateRandom = useCallback(() => {
    const newPuzzle = generateRandomPuzzle();
    setGrid(newPuzzle);
    setOriginalGrid(newPuzzle.map(row => row.map(cell => ({ ...cell }))));
    setAnimatingCell(null);
    setCurrentStep(0);
    setIsStepMode(false);
    solveStepsRef.current = [];
  }, []);

  const handleTogglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const handleSkip = useCallback(() => {
    shouldSkipRef.current = true;
  }, []);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            Sudoku Master
          </h1>
        </div>

        {/* Grid */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <SudokuGrid
            grid={grid}
            animatingCell={animatingCell}
            onChange={handleCellChange}
            disabled={isSolving}
          />
        </div>

        {/* Legend */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Legend />
        </div>

        {/* Controls */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <ControlPanel
            onSolve={handleSolve}
            onReset={handleReset}
            onClear={handleClear}
            onGenerateRandom={handleGenerateRandom}
            onSkip={handleSkip}
            isSolving={isSolving}
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            speed={speed}
            onSpeedChange={setSpeed}
            onPrevStep={handlePrevStep}
            onNextStep={handleNextStep}
            currentStep={currentStep}
            totalSteps={solveStepsRef.current.length}
            isStepMode={isStepMode}
          />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p>
            Masukkan angka 1-9 atau generate puzzle secara random
          </p>
        </div>
      </div>
    </div>
  );
}