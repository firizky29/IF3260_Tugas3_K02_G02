import Matrix from '../matrix/Matrix.js';
import MatrixOp from '../matrix/MatrixOp';

const ModelGenerator = {
  block(xLength, yLength, zLength) {
    const originToYSide = yLength / 2;
    const originToXSide = xLength / 2;
    const originToZSide = zLength / 2;

    const topFace = [
      originToXSide,
      originToYSide,
      -originToZSide,
      originToXSide,
      originToYSide,
      originToZSide,
      -originToXSide,
      originToYSide,
      originToZSide,
      -originToXSide,
      originToYSide,
      originToZSide,
      -originToXSide,
      originToYSide,
      -originToZSide,
      originToXSide,
      originToYSide,
      -originToZSide,
    ];

    const frontFace = [
      originToXSide,
      -originToYSide,
      -originToZSide,
      originToXSide,
      originToYSide,
      -originToZSide,
      -originToXSide,
      originToYSide,
      -originToZSide,
      -originToXSide,
      originToYSide,
      -originToZSide,
      -originToXSide,
      -originToYSide,
      -originToZSide,
      originToXSide,
      -originToYSide,
      -originToZSide,
    ];

    const leftFace = [
      -originToXSide,
      -originToYSide,
      originToZSide,
      -originToXSide,
      originToYSide,
      originToZSide,
      -originToXSide,
      originToYSide,
      -originToZSide,
      -originToXSide,
      originToYSide,
      -originToZSide,
      -originToXSide,
      -originToYSide,
      -originToZSide,
      -originToXSide,
      -originToYSide,
      originToZSide,
    ];

    const topFaceMatrix = new Matrix(6, 3, topFace);
    const leftFaceMatrix = new Matrix(6, 3, leftFace);
    const frontFaceMatrix = new Matrix(6, 3, frontFace);
    const backFaceMatrix = this._createOpposingSide(frontFaceMatrix).flatten();
    const rightFaceMatrix = this._createOpposingSide(leftFaceMatrix).flatten();
    const bottomFaceMatrix = this._createOpposingSide(topFaceMatrix).flatten();

    const blockMatrix = [];
    blockMatrix.push(
      ...topFaceMatrix.flatten(),
      ...leftFaceMatrix.flatten(),
      ...frontFaceMatrix.flatten(),
      ...backFaceMatrix,
      ...rightFaceMatrix,
      ...bottomFaceMatrix
    );

    return blockMatrix;
  },

  _createOpposingSide(matrix) {
    const scalingMatrix = new Matrix(3, 3, [-1, 0, 0, 0, -1, 0, 0, 0, -1]);

    return MatrixOp.multiply(scalingMatrix, matrix);
  },
};

export default ModelGenerator;
