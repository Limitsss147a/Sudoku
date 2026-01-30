/**
 * Membuat grid kosong 9x9
 */
export function createEmptyGrid() {
  return Array(9).fill(null).map(() =>
    Array(9).fill(null).map(() => ({
      value: null,
      state: 'empty',
      isFixed: false,
    }))
  );
}

export function isValidPlacement(grid, row, col, num) {
  // Cek baris
  for (let x = 0; x < 9; x++) {
    if (x !== col && grid[row][x].value === num) return false;
  }

  // Cek kolom
  for (let y = 0; y < 9; y++) {
    if (y !== row && grid[y][col].value === num) return false;
  }

  // Cek kotak 3x3
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let y = boxRow; y < boxRow + 3; y++) {
    for (let x = boxCol; x < boxCol + 3; x++) {
      if ((y !== row || x !== col) && grid[y][x].value === num) return false;
    }
  }

  return true;
}

/**
 * Mendapatkan nilai yang mungkin untuk sebuah sel
 */
function getPossibleValues(grid, row, col) {
  const possible = [];
  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(grid, row, col, num)) {
      possible.push(num);
    }
  }
  return possible;
}

/**
 * Mencari sel dengan Minimum Remaining Values (MRV) heuristic
 */
function findMRVCell(grid) {
  let minCell = null;
  let minCount = 10;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col].value === null) {
        const possible = getPossibleValues(grid, row, col);
        if (possible.length < minCount) {
          minCount = possible.length;
          minCell = { row, col, possible };
          // Early exit jika menemukan sel dengan 1 kemungkinan
          if (minCount === 1) return minCell;
        }
      }
    }
  }

  return minCell;
}

/**
 * Generator function untuk langkah penyelesaian
 */
export function* generateSolveStepsGenerator(grid) {
  const workingGrid = grid.map(row =>
    row.map(cell => ({ ...cell }))
  );

  function* solve() {
    const mrvCell = findMRVCell(workingGrid);

    // Tidak ada sel kosong - puzzle selesai
    if (!mrvCell) return true;

    const { row, col, possible } = mrvCell;

    // Tidak ada nilai yang mungkin - jalan buntu
    if (possible.length === 0) return false;

    for (const num of possible) {
      // 1. Coba isi angka (Trial)
      workingGrid[row][col].value = num;
      yield { row, col, value: num, state: 'trial' };

      // 2. Rekursi ke langkah selanjutnya
      const result = yield* solve();
      
      // Jika sukses, kembalikan true ke atas
      if (result) {
        return true;
      }
      
      // A. Tampilkan angka yang salah dengan warna merah (state: backtrack)
      yield { row, col, value: num, state: 'backtrack' };

      // B. Hapus nilai (Logika Backtrack)
      workingGrid[row][col].value = null;

      // C. Kembalikan visual ke kosong/bersih sebelum mencoba angka berikutnya
      yield { row, col, value: null, state: 'empty' };
    }

    return false;
  }

  const solved = yield* solve();

  // Tandai sukses untuk semua sel non-fixed
  if (solved) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (!grid[row][col].isFixed && workingGrid[row][col].value !== null) {
          yield { row, col, value: workingGrid[row][col].value, state: 'success' };
        }
      }
    }
  }

  return solved;
}

export function collectSolveSteps(grid) {
  const steps = [];
  const generator = generateSolveStepsGenerator(grid);

  let result = generator.next();
  while (!result.done) {
    if (typeof result.value !== 'boolean') {
      steps.push(result.value);
    }
    result = generator.next();
  }

  return steps;
}

export function generateSolveSteps(grid) {
  return collectSolveSteps(grid);
}

export function isGridValid(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = grid[row][col].value;
      if (value !== null) {
        // Hapus sementara nilai untuk pengecekan
        grid[row][col].value = null;
        const valid = isValidPlacement(grid, row, col, value);
        grid[row][col].value = value;
        if (!valid) return false;
      }
    }
  }
  return true;
}

// Sample puzzles
const samplePuzzles = [
  [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ],
  [
    [0, 0, 0, 2, 6, 0, 7, 0, 1],
    [6, 8, 0, 0, 7, 0, 0, 9, 0],
    [1, 9, 0, 0, 0, 4, 5, 0, 0],
    [8, 2, 0, 1, 0, 0, 0, 4, 0],
    [0, 0, 4, 6, 0, 2, 9, 0, 0],
    [0, 5, 0, 0, 0, 3, 0, 2, 8],
    [0, 0, 9, 3, 0, 0, 0, 7, 4],
    [0, 4, 0, 0, 5, 0, 0, 3, 6],
    [7, 0, 3, 0, 1, 8, 0, 0, 0],
  ],
  [
    [0, 2, 0, 6, 0, 8, 0, 0, 0],
    [5, 8, 0, 0, 0, 9, 7, 0, 0],
    [0, 0, 0, 0, 4, 0, 0, 0, 0],
    [3, 7, 0, 0, 0, 0, 5, 0, 0],
    [6, 0, 0, 0, 0, 0, 0, 0, 4],
    [0, 0, 8, 0, 0, 0, 0, 1, 3],
    [0, 0, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 9, 8, 0, 0, 0, 3, 6],
    [0, 0, 0, 3, 0, 6, 0, 9, 0],
  ],
  [
    [0, 0, 0, 6, 0, 0, 4, 0, 0],
    [7, 0, 0, 0, 0, 3, 6, 0, 0],
    [0, 0, 0, 0, 9, 1, 0, 8, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 5, 0, 1, 8, 0, 0, 0, 3],
    [0, 0, 0, 3, 0, 6, 0, 4, 5],
    [0, 4, 0, 2, 0, 0, 0, 6, 0],
    [9, 0, 3, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 0, 0, 0, 1, 0, 0],
  ],
];

export function generateRandomPuzzle() {
  const puzzle = samplePuzzles[Math.floor(Math.random() * samplePuzzles.length)];
  return puzzle.map(row =>
    row.map(value => ({
      value: value === 0 ? null : value,
      state: value === 0 ? 'empty' : 'fixed',
      isFixed: value !== 0,
    }))
  );
}