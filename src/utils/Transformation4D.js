import Matrix from './matrix/Matrix.js';
import MatrixOp from './matrix/MatrixOp.js';

const TransformationMatrix4D = {
  translation(tx, ty, tz) {
    return new Matrix(4, 4, [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [tx, ty, tz, 1],
    ]);
  },
  xRotation(angleInRadians) {
    const cosVal = Math.cos(angleInRadians);
    const sinVal = Math.sin(angleInRadians);

    return new Matrix(4, 4, [
      [1, 0, 0, 0],
      [0, cosVal, sinVal, 0],
      [0, -sinVal, cosVal, 0],
      [0, 0, 0, 1],
    ]);
  },

  yRotation(angleInRadians) {
    const cosVal = Math.cos(angleInRadians);
    const sinVal = Math.sin(angleInRadians);

    return new Matrix(4, 4, [
      [cosVal, 0, -sinVal, 0],
      [0, 1, 0, 0],
      [sinVal, 0, cosVal, 0],
      [0, 0, 0, 1],
    ]);
  },

  zRotation(angleInRadians) {
    const cosVal = Math.cos(angleInRadians);
    const sinVal = Math.sin(angleInRadians);

    return new Matrix(4, 4, [
      [cosVal, sinVal, 0, 0],
      [-sinVal, cosVal, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
  },

  scaling(sx, sy, sz) {
    return new Matrix(4, 4, [
      [sx, 0, 0, 0],
      [0, sy, 0, 0],
      [0, 0, sz, 0],
      [0, 0, 0, 1],
    ]);
  },

  projection(type, obliqueTetha, obliquePhi) {
    switch (type) {
      case 'orthographic':
        return new Matrix(4, 4, [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ]);
      case 'perspective':
        return new Matrix(4, 4, [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ]);
      case 'oblique':
        return new Matrix(4, 4, [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [-1 / Math.tan(obliqueTetha), -1 / Math.tan(obliquePhi), 1, 0],
          [0, 0, 0, 1],
        ]);
      default:
        return new Matrix(4, 4, [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ]);
    }
  },
};

const Transform = {
  translate(matrix, tx, ty, tz) {
    const translationMatrix = TransformationMatrix4D.translation(tx, ty, tz);
    return MatrixOp.multiply(translationMatrix, matrix);
  },

  xRotate(matrix, angleInRadians) {
    const xRotationMatrix = TransformationMatrix4D.xRotation(angleInRadians);
    return MatrixOp.multiply(xRotationMatrix, matrix);
  },

  yRotate(matrix, angleInRadians) {
    const yRotationMatrix = TransformationMatrix4D.yRotation(angleInRadians);
    return MatrixOp.multiply(yRotationMatrix, matrix);
  },

  zRotate(matrix, angleInRadians) {
    const zRotationMatrix = TransformationMatrix4D.zRotation(angleInRadians);
    return MatrixOp.multiply(zRotationMatrix, matrix);
  },

  scale(matrix, sx, sy, sz) {
    const scalingMatrix = TransformationMatrix4D.scaling(sx, sy, sz);
    return MatrixOp.multiply(scalingMatrix, matrix);
  },
};

export { Transform, TransformationMatrix4D };
