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
    // Border kanan untuk pembatas vertikal 3x3
    if ((col + 1) % 3 === 0 && col < 8) {
      classes.push('border-r-4 border-r-slate-900'); 
    } else if (col < 8) {
      // Border tipis untuk sel biasa
      classes.push('border-r border-r-slate-300');
    }
    
    // Border bawah untuk pembatas horizontal 3x3
    if ((row + 1) % 3 === 0 && row < 8) {
      classes.push('border-b-4 border-b-slate-900');
    } else if (row < 8) {
      // Border tipis untuk sel biasa
      classes.push('border-b border-b-slate-300');
    }
    
    return classes.join(' ');
  };

  const getStateClasses = () => {
    switch (currentState) {
      case 'fixed':
        return 'bg-slate-200 text-slate-900 font-bold'; 
      case 'trial':
        return 'bg-blue-50 text-blue-600 font-semibold animate-cell-pop';
      case 'backtrack':
        return 'bg-red-100 text-red-600 animate-cell-shake';
      case 'success':
        return 'bg-green-100 text-green-700 font-semibold animate-success-wave';
      case 'input':
        return 'bg-white text-blue-600 font-medium';
      default:
        return 'bg-white text-slate-900';
    }
  };

  return (
    <div
      className={cn(
        'relative aspect-square transition-all duration-150',
        getBorderClasses(),
        isAnimating && currentState === 'trial' && 'animate-cell-glow z-10'
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
          'absolute inset-0 w-full h-full text-center font-mono text-xl sm:text-2xl md:text-3xl',
          'focus:outline-none focus:bg-blue-50 focus:z-20',
          'disabled:cursor-not-allowed transition-all duration-150',
          getStateClasses()
        )}
      />
    </div>
  );
}