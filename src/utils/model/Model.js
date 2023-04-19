
class Model {
  constructor(gl, program, model) {
    this.gl = gl;
    this.program = program;
    this.model = model;
    this.children = model.children;
  }

  drawModel(projectionMat, viewMat, modelMat, cameraPos, isShading) {
    let newModelMat = modelMat.clone();
    newModelMat.transform(this.translation, this.rotation, this.scale);

    this.model.drawObject(projectionMat, viewMat, newModelMat, cameraPos, isShading);

    for(let i=0; i<this.children.length; i++){
        this.children[i].drawModel(projectionMat, viewMat, newModelMat, cameraPos, isShading);
    }
  }

  // image, environment, bump
  setTexture(textureType){
    this.model.setTexture(textureType);
    for(let i=0; i<this.children.length; i++){
        this.children[i].setTexture(textureType);
    }
  }
}

export default Model;