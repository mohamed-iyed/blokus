export default function extractMatrix(matrix: number[][]) {
  const newMatrix = [];
  // get the rows that have at least a 1 / get the minimum start y / get maximum end y
  const params: { rows: number[]; startJ: number; endJ: number } = {
    rows: [],
    startJ: Infinity,
    endJ: -Infinity,
  };

  // get start positions
  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    const firstOne = row.indexOf(1);
    const lastOne = row.lastIndexOf(1);
    if (firstOne !== -1) {
      params.rows.push(i);
    }
    if (params.startJ > firstOne && firstOne !== -1) {
      params.startJ = firstOne;
    }

    if (params.endJ < lastOne && lastOne !== -1) {
      params.endJ = lastOne;
    }
  }

  // extract the subMatrix
  for (let i = 0; i < matrix.length; i++) {
    if (params.rows.includes(i)) {
      newMatrix.push(matrix[i].slice(params.startJ, params.endJ + 1));
    }
  }
  return newMatrix;
}
