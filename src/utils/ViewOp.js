import Matrix4 from './Matrix4.js';
import MathOp from './MathOp.js';
import MatrixOp from './MatrixOp.js';
import Converter from './Converter.js';
import GeometryOp from './GeometryOp.js';

const ViewOp = {
    lookAt(cameraPos, target, up) {
        console.log(cameraPos, target, up);
        // console.log(GeometryOp.subtract(cameraPos, target))
        const zAxis = GeometryOp.normalize(
            GeometryOp.subtract(cameraPos, target)
        );
        const xAxis = GeometryOp.normalize(GeometryOp.cross(up, zAxis));
        const yAxis = GeometryOp.normalize(GeometryOp.cross(zAxis, xAxis));
        // console.log("Hello", yAxis, xAxis)



        return new Matrix4([
            [xAxis[0], xAxis[1], xAxis[2], 0],
            [yAxis[0], yAxis[1], yAxis[2], 0],
            [zAxis[0], zAxis[1], zAxis[2], 0],
            [cameraPos[0], cameraPos[1], cameraPos[2], 1],
        ]);
    },

    perspective(fovInRad, aspect, near, far) {
        const fov = Math.tan(Math.PI * 0.5 - 0.5 * fovInRad);
        const rangeInv = 1 / (near - far);
        return new Matrix4([
            [fov / aspect, 0, 0, 0],
            [0, fov, 0, 0],
            [0, 0, (near + far) * rangeInv, -1],
            [0, 0, near * far * rangeInv * 2, 0],
        ]);
    },

    orthographic(left, right, bottom, top, near, far) {
        const width = right - left;
        const height = top - bottom;
        const depth = far - near;
        return new Matrix4([
            [2 / width, 0, 0, 0],
            [0, 2 / height, 0, 0],
            [0, 0, 2 / depth, 0],
            [-(left + right) / width, -(top + bottom) / height, -(near + far) / depth, 1],
        ]);
    },

    oblique(left, right, bottom, top, near, far, theta, phi) {
        const obliqueTetha = Converter.degToRad(theta);
        const obliquePhi = Converter.degToRad(phi);

        const orthographicMatrix = ViewOp.orthographic(left, right, bottom, top, near, far);

        const obliqueMatrix = new Matrix4([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [-1 / Math.tan(obliqueTetha), -1 / Math.tan(obliquePhi), 1, 0],
            [0, 0, 0, 1],
        ]);

        return MatrixOp.multiply(orthographicMatrix, obliqueMatrix);
    },

};

export default ViewOp;
