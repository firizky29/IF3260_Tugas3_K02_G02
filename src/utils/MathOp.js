
const MathOp = {
    add(u, v){
        if(u.length !== v.length) {
            console.log('Unable to add due to invalid vector dimension')
            return
        }
        let res = []
        for(let i = 0; i < u.length; i++){
            res.push(u[i] + v[i])
        }
        return res
    },

    subtract(u, v){
        if(u.length !== v.length) {
            console.log('Unable to subtract due to invalid vector dimension')
            return
        }
        let res = []
        for(let i = 0; i < u.length; i++){
            res.push(u[i] - v[i])
        }
        return res
    },

    cross(u, v){
        if(u.length !== v.length && v.length !== 3) {
            console.log('Unable to cross product due to invalid vector dimension')
            return
        }
        let res = []
        res.push(u[1] * v[2] - u[2] * v[1])
	    res.push(u[2] * v[0] - u[0] * v[2])
	    res.push(u[0] * v[1] - u[1] * v[0])
        
        return res
    },

    normalize(u){
        let res = []
        let sum = 0
        for(let i = 0; i < u.length; i++){
            sum += u[i] * u[i]
        }
        sum = Math.sqrt(sum)
        for(let i = 0; i < u.length; i++){
            res.push(u[i] / sum)
        }
        return res
    },

    multiplyByScalar(u, s){
        let res = []
        for(let i = 0; i < u.length; i++){
            res.push(u[i] * s)
        }
        return res
    },

    pivot(vertices){
        let res = []
        for(let j = 0; j < vertices[0].length; j++){
            let sum = 0;
            for(let i = 0; i < vertices.length; i++){
                sum += vertices[i][j]
            }
            res.push(sum / vertices.length)
        }
        return res
    },

    triangleNormal(u, v, w){
        let a = this.subtract(u, v)
        let b = this.subtract(w, v)

        return this.normalize(this.cross(a, b))
    }
}

export default MathOp