
class Model {
  constructor(gl, program, model) {
    this.gl = gl;
    this.program = program;
    this.model = new ModelComponent(gl, program, model);

    this.children = [];
    for (let i = 0; i < model.children.length; i++) {
      this.children.push(new Model(gl, program, model.children[i]));
    }

    this.translation = {
      object : model.translation,
      subtree : model.subtree_translate
    };
    this.rotation = {
      object : model.rotation,
      subtree : model.subtree_rotate
    };
    this.scale = {
      object : model.scale,
      subtree : model.subtree_scale
    }

  }

  drawModel(projectionMat, viewMat, modelMat, cameraPos, isShading) {
    let newModelMat = modelMat.clone();

    newModelMat.transform(this.translation.object, this.rotation.object, this.scale.object);

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