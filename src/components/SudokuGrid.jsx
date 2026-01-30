import { SudokuCell } from './SudokuCell';

export function SudokuGrid({ grid, animatingCell, onChange, disabled }) {
  return (
    <div className="w-full max-w-md mx-auto p-1"> 
      <div 
        className="grid grid-cols-9 border-4 border-slate-900 rounded-lg overflow-hidden shadow-2xl bg-slate-900 gap-[1px]" 
        style={{ aspectRatio: '1' }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              row={rowIndex}
              col={colIndex}
              isAnimating={
                animatingCell?.row === rowIndex && animatingCell?.col === colIndex
              }
              animationState={
                animatingCell?.row === rowIndex && animatingCell?.col === colIndex
                  ? animatingCell.state
                  : undefined
              }
              onChange={onChange}
              disabled={disabled}
            />
          ))
        )}
      </div>
    </div>
  );
}