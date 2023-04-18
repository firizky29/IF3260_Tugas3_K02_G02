// import Matrix from './../../model/Matrix.js'
import Matrix from "./Matrix.js";

const MatrixOp = {
  multiply(m1, m2) {
    const m1Obj = m1.getPropsToObj();
    const m2Obj = m2.getPropsToObj();

    if (m1Obj.cols !== m2Obj.rows) {
      console.log('Unable to multiply due to invalid matrix dimension');
      return;
    }

    const resMatrix = [];
    for (let rowM1 = 0; rowM1 < m1Obj.rows; rowM1++) {
      const resMatrixRow = [];
      for (let colM2 = 0; colM2 < m2Obj.cols; colM2++) {
        let colM2MultVal = 0;
        for (let colM1 = 0; colM1 < m1Obj.cols; colM1++) {
          colM2MultVal += m1Obj.data[rowM1][colM1] * m2Obj.data[colM1][colM2];
        }
        resMatrixRow.push(colM2MultVal);
      }
      resMatrix.push(resMatrixRow);
    }

    return new Matrix(m1Obj.rows, m2Obj.cols, resMatrix);
  },

  multiplyByScalar(matrix, scalarNum) {
    const matrixObj = matrix.getPropsToObj();
    for (let row = 0; row < matrixObj.rows; row++) {
      for (let col = 0; col < matrixObj.cols; col++) {
        matrixObj.data[row][col] *= scalarNum;
      }
    }

    return new Matrix(matrixObj.rows, matrixObj.cols, matrixObj.data);
  },

  add(m1, m2) {
    const m1Obj = m1.getPropsToObj();
    const m2Obj = m2.getPropsToObj();

    if (m1Obj.cols !== m2Obj.cols || m1Obj.rows !== m2Obj.rows) {
      console.log('Unable to add due to invalid matrix dimension');
      return;
    }

    const resMatrix = [];
    for (let row = 0; row < m1Obj.rows; row++) {
      const resMatrixRow = [];
      for (let col = 0; col < m1Obj.cols; col++) {
        resMatrixRow.push(m1Obj.data[row][col] + m2Obj.data[row][col]);
      }
      resMatrix.push(resMatrixRow);
    }

    return new Matrix(m1Obj.rows, m1Obj.cols, resMatrix);
  },
  create() {
    return new Matrix(4, 4, [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
  },
  copy(m) {
    const mObj = m.getPropsToObj();
    return new Matrix(mObj.rows, mObj.cols, mObj.data);
  },
  subtract(m1, m2) {
    const m1Obj = m1.getPropsToObj();
    const m2Obj = m2.getPropsToObj();

    if (m1Obj.cols !== m2Obj.cols || m1Obj.rows !== m2Obj.rows) {
      console.log('Unable to subtract due to invalid matrix dimension');
      return;
    }

    const resMatrix = [];
    for (let row = 0; row < m1Obj.rows; row++) {
      const resMatrixRow = [];
      for (let col = 0; col < m1Obj.cols; col++) {
        resMatrixRow.push(m1Obj.data[row][col] - m2Obj.data[row][col]);
      }
      resMatrix.push(resMatrixRow);
    }

    return new Matrix(m1Obj.rows, m1Obj.cols, resMatrix);
  },
};

export default MatrixOp;
