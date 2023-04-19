export default class Matrix {
    constructor(rows, cols, data) {
        this._rows = rows;
        this._cols = cols;
        this._data = data;
    }

    getRows() {
        return this._rows;
    }

    getCols() {
        return this._cols;
    }

    getData() {
        return this._data;
    }

    getPropsToObj() {
        return {
            rows: this._rows,
            cols: this._cols,
            data: this._data,
        };
    }

    setData(data) {
        this._data = data;
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

    getDeterminant() {
        if (this._rows !== this._cols) {
            throw new Error('Matrix is not square');
        }

        if (this._rows === 1) {
            return this._data[0][0];
        }

        if (this._rows === 2) {
            return (
                this._data[0][0] * this._data[1][1] -
                this._data[0][1] * this._data[1][0]
            );
        }

        if (this._rows === 3) {
            let a00 = this._data[0][0],
                a01 = this._data[0][1],
                a02 = this._data[0][2],
                a10 = this._data[1][0],
                a11 = this._data[1][1],
                a12 = this._data[1][2],
                a20 = this._data[2][0],
                a21 = this._data[2][1],
                a22 = this._data[2][2];
            return (
                a00 * a11 * a22 -
                a00 * a12 * a21 -
                a01 * a10 * a22 +
                a01 * a12 * a20 +
                a02 * a10 * a21 -
                a02 * a11 * a20
            );
        }

        if (this._rows == 4) {
            let a00 = this._data[0][0],
                a01 = this._data[0][1],
                a02 = this._data[0][2],
                a03 = this._data[0][3],
                a10 = this._data[1][0],
                a11 = this._data[1][1],
                a12 = this._data[1][2],
                a13 = this._data[1][3],
                a20 = this._data[2][0],
                a21 = this._data[2][1],
                a22 = this._data[2][2],
                a23 = this._data[2][3],
                a30 = this._data[3][0],
                a31 = this._data[3][1],
                a32 = this._data[3][2],
                a33 = this._data[3][3],
                b00 = a00 * a11 - a01 * a10,
                b01 = a00 * a12 - a02 * a10,
                b02 = a00 * a13 - a03 * a10,
                b03 = a01 * a12 - a02 * a11,
                b04 = a01 * a13 - a03 * a11,
                b05 = a02 * a13 - a03 * a12,
                b06 = a20 * a31 - a21 * a30,
                b07 = a20 * a32 - a22 * a30,
                b08 = a20 * a33 - a23 * a30,
                b09 = a21 * a32 - a22 * a31,
                b10 = a21 * a33 - a23 * a31,
                b11 = a22 * a33 - a23 * a32;
            return (
                b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06
            );
        } else {
            console.log('Matrix is too big');
        }
    }

    getAdjugate() {
        if (this._rows !== this._cols) {
            throw new Error('Matrix is not square');
        }

        if (this._rows === 1) {
            return new Matrix(1, 1, [[1]]);
        }

        if (this._rows === 2) {
            return new Matrix(2, 2, [
                [this._data[1][1], -this._data[0][1]],
                [-this._data[1][0], this._data[0][0]],
            ]);
        }

        if (this._rows === 3) {
            let a00 = this._data[0][0],
                a01 = this._data[0][1],
                a02 = this._data[0][2],
                a10 = this._data[1][0],
                a11 = this._data[1][1],
                a12 = this._data[1][2],
                a20 = this._data[2][0],
                a21 = this._data[2][1],
                a22 = this._data[2][2];

            return new Matrix(3, 3, [
                [a11 * a22 - a12 * a21, a02 * a21 - a01 * a22, a01 * a12 - a02 * a11],
                [a12 * a20 - a10 * a22, a00 * a22 - a02 * a20, a02 * a10 - a00 * a12],
                [a10 * a21 - a11 * a20, a01 * a20 - a00 * a21, a00 * a11 - a01 * a10],
            ]);
        }

        if (this._rows == 4) {
            let a00 = this._data[0][0],
                a01 = this._data[0][1],
                a02 = this._data[0][2],
                a03 = this._data[0][3],
                a10 = this._data[1][0],
                a11 = this._data[1][1],
                a12 = this._data[1][2],
                a13 = this._data[1][3],
                a20 = this._data[2][0],
                a21 = this._data[2][1],
                a22 = this._data[2][2],
                a23 = this._data[2][3],
                a30 = this._data[3][0],
                a31 = this._data[3][1],
                a32 = this._data[3][2],
                a33 = this._data[3][3];
            return new Matrix(4, 4, [
                [
                    a11 * a22 * a33 +
                    a12 * a23 * a31 +
                    a13 * a21 * a32 -
                    a11 * a23 * a32 -
                    a12 * a21 * a33 -
                    a13 * a22 * a31,
                    a01 * a23 * a32 +
                    a02 * a21 * a33 +
                    a03 * a22 * a31 -
                    a01 * a22 * a33 -
                    a02 * a23 * a31 -
                    a03 * a21 * a32,
                    a01 * a12 * a33 +
                    a02 * a13 * a31 +
                    a03 * a11 * a32 -
                    a01 * a13 * a32 -
                    a02 * a11 * a33 -
                    a03 * a12 * a31,
                    a01 * a13 * a22 +
                    a02 * a11 * a23 +
                    a03 * a12 * a21 -
                    a01 * a12 * a23 -
                    a02 * a13 * a21 -
                    a03 * a11 * a22,
                ],
                [
                    a10 * a23 * a32 +
                    a12 * a20 * a33 +
                    a13 * a22 * a30 -
                    a10 * a22 * a33 -
                    a12 * a23 * a30 -
                    a13 * a20 * a32,
                    a00 * a22 * a33 +
                    a02 * a23 * a30 +
                    a03 * a20 * a32 -
                    a00 * a23 * a32 -
                    a02 * a20 * a33 -
                    a03 * a22 * a30,
                    a00 * a13 * a32 +
                    a02 * a10 * a33 +
                    a03 * a12 * a30 -
                    a00 * a12 * a33 -
                    a02 * a13 * a30 -
                    a03 * a10 * a32,
                    a00 * a12 * a23 +
                    a02 * a13 * a20 +
                    a03 * a10 * a22 -
                    a00 * a13 * a22 -
                    a02 * a10 * a23 -
                    a03 * a12 * a20,
                ],
                [
                    a10 * a21 * a33 +
                    a11 * a23 * a30 +
                    a13 * a20 * a31 -
                    a10 * a23 * a31 -
                    a11 * a20 * a33 -
                    a13 * a21 * a30,
                    a00 * a23 * a31 +
                    a01 * a20 * a33 +
                    a03 * a21 * a30 -
                    a00 * a21 * a33 -
                    a01 * a23 * a30 -
                    a03 * a20 * a31,
                    a00 * a11 * a33 +
                    a01 * a13 * a30 +
                    a03 * a10 * a31 -
                    a00 * a13 * a31 -
                    a01 * a10 * a33 -
                    a03 * a11 * a30,
                    a00 * a13 * a21 +
                    a01 * a10 * a23 +
                    a03 * a11 * a20 -
                    a00 * a11 * a23 -
                    a01 * a13 * a20 -
                    a03 * a10 * a21,
                ],
                [
                    a10 * a22 * a31 +
                    a11 * a20 * a32 +
                    a12 * a21 * a30 -
                    a10 * a21 * a32 -
                    a11 * a22 * a30 -
                    a12 * a20 * a31,
                    a00 * a21 * a32 +
                    a01 * a22 * a30 +
                    a02 * a20 * a31 -
                    a00 * a22 * a31 -
                    a01 * a20 * a32 -
                    a02 * a21 * a30,
                    a00 * a12 * a31 +
                    a01 * a10 * a32 +
                    a02 * a11 * a30 -
                    a00 * a11 * a32 -
                    a01 * a12 * a30 -
                    a02 * a10 * a31,
                    a00 * a11 * a22 +
                    a01 * a12 * a20 +
                    a02 * a10 * a21 -
                    a00 * a12 * a21 -
                    a01 * a10 * a22 -
                    a02 * a11 * a20,
                ],
            ]);
        }

        console.log('Matrix is not invertible');
    }

    invert() {
        let det = this.getDeterminant();
        if (det == 0) {
            console.log('Matrix is not invertible');
        } else {
            let adj = this.getAdjugate();
            for (let i = 0; i < this._rows; i++) {
                for (let j = 0; j < this._cols; j++) {
                    adj._data[i][j] /= det;
                }
            }
            return adj;
        }
    }

    transpose() {
        let data = [];
        for (let i = 0; i < this._cols; i++) {
            let col = [];
            for (let j = 0; j < this._rows; j++) {
                col.push(this._data[j][i]);
            }
            data.push(col);
        }
        return new Matrix(this._cols, this._rows, data);
    }
}
