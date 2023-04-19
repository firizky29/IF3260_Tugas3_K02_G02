import Matrix from './matrix/Matrix.js';
import VectorOp from './VectorOp.js';
import MatrixOp from './matrix/MatrixOp.js';

const CameraOp = {
  lookAt(cameraPos, target, up) {
    const zAxis = VectorOp.normalize(
      MatrixOp.subtract(cameraPos, target).flatten()
    );
    const xAxis = VectorOp.normalize(VectorOp.cross(up.flatten(), zAxis));
    const yAxis = VectorOp.normalize(VectorOp.cross(zAxis, xAxis));
    cameraPos = cameraPos.flatten();

    return new Matrix(4, 4, [
      [xAxis[0], xAxis[1], xAxis[2], 0],
      [yAxis[0], yAxis[1], yAxis[2], 0],
      [zAxis[0], zAxis[1], zAxis[2], 0],
      [cameraPos[0], cameraPos[1], cameraPos[2], 1],
    ]);
  },
  perspective(fovInRad, aspect, near, far) {
    const fov = Math.tan(Math.PI * 0.5 - 0.5 * fovInRad);
    const rangeInv = 1 / (near - far);
    return new Matrix(4, 4, [
      [fov / aspect, 0, 0, 0],
      [0, fov, 0, 0],
      [0, 0, (near + far) * rangeInv, -1],
      [0, 0, near * far * rangeInv * 2, 0],
    ]);
  },
};

export default CameraOp;
