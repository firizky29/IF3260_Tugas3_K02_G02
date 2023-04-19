
function add(u, v) {
    if(u.length !== v.length) {
        console.log('Unable to add due to invalid vector dimension')
        return
    }
    return [u[0] + v[0], u[1] + v[1], u[2] + v[2]];
}

function subtract(u, v) {
    if(u.length !== v.length) {
        console.log('Unable to subtract due to invalid vector dimension')
        return
    }
    return [u[0] - v[0], u[1] - v[1], u[2] - v[2]];
}

function cross(u, v) {
    if(u.length !== v.length && v.length !== 3) {
        console.log('Unable to cross product due to invalid vector dimension')
        return
    }
    let res = []
    res.push(u[1] * v[2] - u[2] * v[1])
    res.push(u[2] * v[0] - u[0] * v[2])
    res.push(u[0] * v[1] - u[1] * v[0])
    
    return res
}

function normalize(u) {
    const n = Math.sqrt(u[0] * u[0] + u[1] * u[1] + u[2] * u[2]);
    return n === 0? [0, 0, 0] : [u[0] / n, u[1] / n, u[2] / n];
}

function multiplyByScalar(u, s) {
    let res = []
    for(let i = 0; i < u.length; i++){
        res.push(u[i] * s)
    }
    return res
}

function pivot(vertices) {
    let res = []
    for(let j = 0; j < vertices[0].length; j++){
        let sum = 0;
        for(let i = 0; i < vertices.length; i++){
            sum += vertices[i][j]
        }
        res.push(sum / vertices.length)
    }
    return res
}

function triangleNormal(u, v, w) {
    let a = this.subtract(u, v)
    let b = this.subtract(w, v)

    return this.normalize(this.cross(a, b))
}

function getVectorInfo(vertices) {
    let normals = [];
    let tangents = [];
    let bitangents = [];

    for(let i = 0; i < vertices.length; i += 18){
        const u = vertices.slice(i, i + 3);
        const v = vertices.slice(i + 3, i + 6);
        const w = vertices.slice(i + 6, i + 9);

        const uv = subtract(v, u);
        const uw = subtract(w, u);

        const n = normalize(cross(uv, uw));
        const t = normalize(uv);
        const b = normalize(uw);

        for(let j = 0; j < 6; j++){
            normals = normals.concat(n);
            tangents = tangents.concat(t);
            bitangents = bitangents.concat(b);
        }
    }

    return {
        normals: normals,
        tangents: tangents,
        bitangents: bitangents
    }
}