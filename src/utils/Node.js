import MatrixOp from '../matrix/MatrixOp.js';

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

    parent.children.append(this);
    this.parent = parent;
  }

  updateWorldMatrix(parentWorldMatrix) {
    this.worldMatrix = MatrixOp.multiply(this.localMatrix, parentWorldMatrix);

    this.children.forEach((child) => {
      child.updateWorldMatrix(this.worldMatrix);
    });
  }
}
