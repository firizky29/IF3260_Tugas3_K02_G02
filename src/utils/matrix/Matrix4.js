
class Matrix4 {
    constructor(data) {
        this._rows = 4;
        this._cols = 4;
        this._data = new Array(this._rows * this._cols).fill(0);
        if (data) {
            this._data = data;
        }
    }

    get(row, col) {
        return this._data[row][col];
    }

    set(row, col, value) {
        this._data[row][col] = value;
    }

    getData() {
        return this._data;
    }

    setData() {
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

    clone() {
        return new Matrix4(this._data);
    }

    multiply(matrix) {
        for (let row = 0; row < this._rows; row++) {
            for (let col = 0; col < this._cols; col++) {
                let sum = 0;
                for (let i = 0; i < this._cols; i++) {
                    sum += matrix.get(row, i) * this.get(i, col);
                }
                result.set(row, col, sum);
            }
        }
        this.setData(result.getData());
    }

    transpose() {
        const temp = new Matrix4();
        for (let i = 0; i < this._cols; i++) {
            for (let j = 0; j < this._rows; j++) {
                temp.set(i, j, this.get(j, i));
            }
        }
        this.setData(temp.getData());
    }


    _determinant() {
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
    }

    _adjugate() {
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
        return new Matrix4([
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

    inverse() {
        let det = this._determinant();
        if (det == 0) {
            console.log('Matrix is not invertible');
        } else {
            let adj = this._adjugate();
            for (let i = 0; i < this._rows; i++) {
                for (let j = 0; j < this._cols; j++) {
                    adj.setData(i, j, adj.getData(i, j) / det);
                }
            }
            return adj;
        }
    }

    
}