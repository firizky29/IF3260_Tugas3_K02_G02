
class Model {
  constructor(gl, program, model) {
    this.gl = gl;
    this.program = program;
    this.model = model;
    this.children = [];
  }

  drawModel(projectionMat, viewMat, modelMat, cameraPos, isShading) {
    //Hitung model untuk anak2nya
    let newModelMat = modelMat.clone();
    newModelMat.transform(this.translation, this.rotation, this.scale);

    //Gambar object
    this.object.drawObject(projectionMat, viewMat, newModelMat, cameraPos, isShading);

    // Draw secara depth first search
    for(let i=0; i<this.children.length; i++){
        this.children[i].drawModel(projectionMat, viewMat, newModelMat, cameraPos, isShading);
    }
  }

  // image, environment, bump
  setTexture(textureType){
    this.object.setTexture(textureType);
    for(let i=0; i<this.children.length; i++){
        this.children[i].setTexture(textureType);
    }
  }
}

export default Model;