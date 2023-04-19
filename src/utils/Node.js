import MatrixOp from './matrix/MatrixOp.js';
import Matrix4 from './Matrix4.js';

export default class Node {
  constructor(children = [], parent = null) {
    this.children = children;
    this.parent = parent;
    this.localMatrix = new Matrix4().identity();
    this.worldMatrix = new Matrix4().identity();
  }

  setParent(parent) {
    if (this.parent) {
      const parentChildIdx = this.parent.children.indexOf(this);
      if (parentChildIdx >= 0) {
        this.parent.children.splice(parentChildIdx, 1);
      }
    }

    parent.children.push(this);
    this.parent = parent;
  }

  updateWorldMatrix(parentWorldMatrix) {
    if (parentWorldMatrix) {
      this.worldMatrix = this.localMatrix.multiply(parentWorldMatrix);
    } else {
      this.worldMatrix = this.localMatrix;
    }

    this.children.forEach((child) => {
      child.updateWorldMatrix(this.worldMatrix);
    });
  }
}
