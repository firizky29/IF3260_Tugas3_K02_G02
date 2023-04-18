import MatrixOp from './MatrixOp.js';
import Matrix from './Matrix.js';

const Rotation3D = {
  xRotation(angleInRadians) {
    const cosVal = Math.cos(angleInRadians);
    const sinVal = Math.sin(angleInRadians);

    return new Matrix(3, 3, [
      [1, 0, 0],
      [0, cosVal, sinVal],
      [0, -sinVal, cosVal],
    ]);
  },

  yRotation(angleInRadians) {
    const cosVal = Math.cos(angleInRadians);
    const sinVal = Math.sin(angleInRadians);

    return new Matrix(3, 3, [
      [cosVal, 0, -sinVal],
      [0, 1, 0],
      [sinVal, 0, cosVal],
    ]);
  },

  zRotation(angleInRadians) {
    const cosVal = Math.cos(angleInRadians);
    const sinVal = Math.sin(angleInRadians);

    return new Matrix(3, 3, [
      [cosVal, sinVal, 0],
      [-sinVal, cosVal, 0],
      [0, 0, 1],
    ]);
  },

  transform: {
    xRotate(matrix, angleInRadians) {
      const xRotationMatrix = Rotation3D.xRotation(angleInRadians);
      return MatrixOp.multiply(matrix, xRotationMatrix);
    },

    yRotate(matrix, angleInRadians) {
      const yRotationMatrix = Rotation3D.yRotation(angleInRadians);
      return MatrixOp.multiply(matrix, yRotationMatrix);
    },

    zRotate(matrix, angleInRadians) {
      const zRotationMatrix = Rotation3D.zRotation(angleInRadians);
      return MatrixOp.multiply(matrix, zRotationMatrix);
    },
  },
};

export default Rotation3D;
