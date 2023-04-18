import MathOp from "./MathOp.js"

const Render = {
    rectangle(vertices, colors, normals, corners, rectColor){
        // corners are defined counter clock-wise
        // find normal of the rectangle
        const normal = MathOp.triangleNormal(corners[0], corners[1], corners[2])
        const indices = [0, 1, 2, 0, 2, 3]
        for (let i of indices) {
            for (let j = 0; j < 3; j++) {
                vertices.push(corners[i][j])
                colors.push(rectColor[j])
                normals.push(normal[j])
            }
        }
    }
}

export default Render