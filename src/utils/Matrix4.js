class Matrix4 {
    constructor(data) {
        this._rows = 4;
        this._cols = 4;
        this._data = new Array(this._rows).fill(0).map(() => new Array(this._cols).fill(0));
        if (data) {
            this._data = data;
        }
    }

    get(row, col) {
        // console.log(this._data)
        return this._data[row][col];
    }

    set(row, col, value) {
        this._data[row][col] = value;

        return this;
    }

    getData() {
        return this._data;
    }

    setData(data) {
        // console.log("data", data)
        for (let i = 0; i < this._rows; i++) {
            for (let j = 0; j < this._cols; j++) {
                this.set(i, j, data[i][j]);
            }
        }
    }

    identity() {
        this._data = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ];

        return this;
    }

    setDataFromArray(arrData) {
        this._data = [];
        let tempArr = [];
        for (let i = 0; i < arrData.length; i++) {
            tempArr.push(arrData[i]);
            if ((i - this._cols + 1) % this._cols === 0) {
                this._data.push(tempArr);
                tempArr = [];
            }
        }

        this._rows = this._data.length;

        return this;
    }

    flatten() {
        const flattenMatrix = [];
        for (let i = 0; i < this._rows; i++) {
            for (let j = 0; j < this._cols; j++) {
                flattenMatrix.push(this._data[i][j]);
            }
        }

        return flattenMatrix;
    }

    clone() {
        const cloneMatrix = new Matrix4();
        for(let i = 0; i < this._rows; i++){
            for(let j = 0; j < this._cols; j++){
                cloneMatrix.set(i, j, this.get(i, j));
            }
        }
        return cloneMatrix;
    }

    // matrix * this.matrix
    multiply(matrix) {
        const resMatrix = new Matrix4();
        for (let row = 0; row < this._rows; row++) {
            for (let col = 0; col < this._cols; col++) {
                let sum = 0;
                for (let i = 0; i < this._cols; i++) {
                    sum += matrix.get(row, i) * this.get(i, col);
                }
                resMatrix.set(row, col, sum);
            }
        }
        // console.log(resMatrix.getData())
        this.setData(resMatrix.getData());

        return this;
    }

    transpose() {
        const temp = new Matrix4();
        for (let i = 0; i < this._cols; i++) {
            for (let j = 0; j < this._rows; j++) {
                temp.set(i, j, this.get(j, i));
            }
        }
        // console.log(temp.getData());
        this.setData(temp.getData());

        return this;
    }

    inverse() {
        var a00 = this.get(0, 0),
            a01 = this.get(0, 1),
            a02 = this.get(0, 2),
            a03 = this.get(0, 3);
        var a10 = this.get(1, 0),
            a11 = this.get(1, 1),
            a12 = this.get(1, 2),
            a13 = this.get(1, 3);
        var a20 = this.get(2, 0),
            a21 = this.get(2, 1),
            a22 = this.get(2, 2),
            a23 = this.get(2, 3);
        var a30 = this.get(3, 0),
            a31 = this.get(3, 1),
            a32 = this.get(3, 2),
            a33 = this.get(3, 3);

        var b00 = a00 * a11 - a01 * a10;
        var b01 = a00 * a12 - a02 * a10;
        var b02 = a00 * a13 - a03 * a10;
        var b03 = a01 * a12 - a02 * a11;
        var b04 = a01 * a13 - a03 * a11;
        var b05 = a02 * a13 - a03 * a12;
        var b06 = a20 * a31 - a21 * a30;
        var b07 = a20 * a32 - a22 * a30;
        var b08 = a20 * a33 - a23 * a30;
        var b09 = a21 * a32 - a22 * a31;
        var b10 = a21 * a33 - a23 * a31;
        var b11 = a22 * a33 - a23 * a32;

        var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        det = 1.0 / det;
        this.set(0, 0, (a11 * b11 - a12 * b10 + a13 * b09) * det);
        this.set(0, 1, (a02 * b10 - a01 * b11 - a03 * b09) * det);
        this.set(0, 2, (a31 * b05 - a32 * b04 + a33 * b03) * det);
        this.set(0, 3, (a22 * b04 - a21 * b05 - a23 * b03) * det);
        this.set(1, 0, (a12 * b08 - a10 * b11 - a13 * b07) * det);
        this.set(1, 1, (a00 * b11 - a02 * b08 + a03 * b07) * det);
        this.set(1, 2, (a32 * b02 - a30 * b05 - a33 * b01) * det);
        this.set(1, 3, (a20 * b05 - a22 * b02 + a23 * b01) * det);
        this.set(2, 0, (a10 * b10 - a11 * b08 + a13 * b06) * det);
        this.set(2, 1, (a01 * b08 - a00 * b10 - a03 * b06) * det);
        this.set(2, 2, (a30 * b04 - a31 * b02 + a33 * b00) * det);
        this.set(2, 3, (a21 * b02 - a20 * b04 - a23 * b00) * det);
        this.set(3, 0, (a11 * b07 - a10 * b09 - a12 * b06) * det);
        this.set(3, 1, (a00 * b09 - a01 * b07 + a02 * b06) * det);
        this.set(3, 2, (a31 * b01 - a30 * b03 - a32 * b00) * det);
        this.set(3, 3, (a20 * b03 - a21 * b01 + a22 * b00) * det);
        
        // console.log(this);
        return this;
    }

    inverseTranspose() {
        this.inverse();
        this.transpose();
        return this;
    }

    translate(tx, ty, tz) {
        const transformMatrix = new Matrix4([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [tx, ty, tz, 1],
        ]);

        return this.multiply(transformMatrix);
    }

    rotateX(angleInRadians) {
        const cosVal = Math.cos(angleInRadians);
        const sinVal = Math.sin(angleInRadians);

        const transformMatrix = new Matrix4([
            [1, 0, 0, 0],
            [0, cosVal, sinVal, 0],
            [0, -sinVal, cosVal, 0],
            [0, 0, 0, 1],
        ]);

        return this.multiply(transformMatrix);
    }

    rotateY(angleInRadians) {
        const cosVal = Math.cos(angleInRadians);
        const sinVal = Math.sin(angleInRadians);

        const transformMatrix = new Matrix4([
            [cosVal, 0, -sinVal, 0],
            [0, 1, 0, 0],
            [sinVal, 0, cosVal, 0],
            [0, 0, 0, 1],
        ]);

        return this.multiply(transformMatrix);
    }

    rotateZ(angleInRadians) {
        const cosVal = Math.cos(angleInRadians);
        const sinVal = Math.sin(angleInRadians);

        const transformMatrix = new Matrix4([
            [cosVal, sinVal, 0, 0],
            [-sinVal, cosVal, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]);

        return this.multiply(transformMatrix);
    }

    rotate(xAngleInRadians, yAngleInRadians, zAngleInRadians) {
        return this.rotateX(xAngleInRadians)
            .rotateY(yAngleInRadians)
            .rotateZ(zAngleInRadians);
    }

    scale(sx, sy, sz) {
        const transformMatrix = new Matrix4([
            [sx, 0, 0, 0],
            [0, sy, 0, 0],
            [0, 0, sz, 0],
            [0, 0, 0, 1],
        ]);

        return this.multiply(transformMatrix);
    }

    transform(translation, rotation, scale) {
        return this
            .translate(translation[0], translation[1], translation[2])
            .rotate(rotation[0], rotation[1], rotation[2])
            .scale(scale[0], scale[1], scale[2]);
    }
}