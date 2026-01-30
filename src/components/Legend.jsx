export function Legend() {
    const items = [
      { label: 'Fixed (Puzzle)', colorClass: 'bg-sudoku-fixed-bg border-sudoku-fixed', textClass: 'text-sudoku-fixed' },
      { label: 'User Input', colorClass: 'bg-sudoku-input-bg border-sudoku-input', textClass: 'text-sudoku-input' },
      { label: 'Trial', colorClass: 'bg-sudoku-trial-bg border-sudoku-trial', textClass: 'text-sudoku-trial' },
      { label: 'Backtrack', colorClass: 'bg-sudoku-backtrack-bg border-sudoku-backtrack', textClass: 'text-sudoku-backtrack' },
      { label: 'Success', colorClass: 'bg-sudoku-success-bg border-sudoku-success', textClass: 'text-sudoku-success' },
    ];
  
    return (
      <div className="flex flex-wrap gap-3 justify-center">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded border-2 ${item.colorClass} flex items-center justify-center`}>
              <span className={`text-xs font-mono font-bold ${item.textClass}`}>5</span>
            </div>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    );
  }