import { cn } from '@/lib/utils';

export function SudokuCell({
  cell,
  row,
  col,
  isAnimating,
  animationState,
  onChange,
  disabled,
}) {
  const currentState = animationState || cell.state;

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === '' || value === '0') {
      onChange(row, col, null);
    } else {
      const num = parseInt(value.slice(-1));
      if (num >= 1 && num <= 9) {
        onChange(row, col, num);
      }
    }
  };

  const getBorderClasses = () => {
    const classes = [];
    
    // Border kanan untuk kotak 3x3
    if ((col + 1) % 3 === 0 && col < 8) {
      classes.push('border-r-2 border-r-sudoku-grid-border');
    }
    
    // Border bawah untuk kotak 3x3
    if ((row + 1) % 3 === 0 && row < 8) {
      classes.push('border-b-2 border-b-sudoku-grid-border');
    }
    
    return classes.join(' ');
  };

  const getStateClasses = () => {
    switch (currentState) {
      case 'fixed':
        return 'bg-sudoku-fixed-bg text-sudoku-fixed font-bold';
      case 'trial':
        return 'bg-sudoku-trial-bg text-sudoku-trial font-semibold animate-cell-pop';
      case 'backtrack':
        return 'bg-sudoku-backtrack-bg text-sudoku-backtrack animate-cell-shake';
      case 'success':
        return 'bg-sudoku-success-bg text-sudoku-success font-semibold animate-success-wave';
      case 'input':
        return 'bg-sudoku-input-bg text-sudoku-input font-medium';
      default:
        return 'bg-card text-sudoku-empty';
    }
  };

  return (
    <div
      className={cn(
        'relative aspect-square border border-sudoku-grid-border-light transition-all duration-150',
        getBorderClasses(),
        isAnimating && currentState === 'trial' && 'animate-cell-glow'
      )}
    >
      <input
        type="text"
        inputMode="numeric"
        pattern="[1-9]"
        maxLength={1}
        value={cell.value ?? ''}
        onChange={handleChange}
        disabled={disabled || cell.isFixed}
        className={cn(
          'absolute inset-0 w-full h-full text-center font-mono text-lg sm:text-xl md:text-2xl',
          'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:z-10',
          'disabled:cursor-not-allowed transition-all duration-150',
          getStateClasses()
        )}
      />
    </div>
  );
}