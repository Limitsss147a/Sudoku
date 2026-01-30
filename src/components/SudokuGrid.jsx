import { SudokuCell } from './SudokuCell';

export function SudokuGrid({ grid, animatingCell, onChange, disabled }) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className="grid grid-cols-9 border-2 border-sudoku-grid-border rounded-lg overflow-hidden shadow-xl"
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