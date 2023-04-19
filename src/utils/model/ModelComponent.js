
class ModelComponent {
  constructor(gl, program, objectModel) {
    this.gl = gl;
    this.program = program;
    this.programInfo = {
      vertexLoc: {
        a_position: this.gl.getAttribLocation(this.program, "a_position"),
        a_color: this.gl.getAttribLocation(this.program, "a_color"),
        a_normal: this.gl.getAttribLocation(this.program, "a_normal"),
        a_tangent: this.gl.getAttribLocation(this.program, "a_tangent"),
        a_bitangent: this.gl.getAttribLocation(this.program, "a_bitangent"),
        a_textureCoord: this.gl.getAttribLocation(this.program, "a_texCoord"),
        u_projectionMat: this.gl.getUniformLocation(this.program, "u_projectionMat"),
        u_viewMat: this.gl.getUniformLocation(this.program, "u_viewMat"),
        u_modelMat: this.gl.getUniformLocation(this.program, "u_modelMat"),
        u_normalMat: this.gl.getUniformLocation(this.program, "u_normalMat"),
      },
      fragmentLoc: {
        isShading: this.gl.getUniformLocation(this.program, "isShading"),
        textureMode: this.gl.getUniformLocation(this.program, "textureMode"),
        u_reverseLightDir: this.gl.getUniformLocation(this.program, "u_reverseLightDirection"),
        u_worldCameraPos: this.gl.getUniformLocation(this.program, "u_worldCameraPosition"),
        u_texture_image: this.gl.getUniformLocation(this.program, "u_texture_image"),
        u_texture_env: this.gl.getUniformLocation(this.program, "u_texture_environment"),
        u_texture_bump : this.gl.getUniformLocation(this.program, "u_texture_bump"),
      }
    }
    this.objectModel = objectModel;

    this.translation = [0, 0, 0];
    this.rotation = [0, 0, 0];
    this.scale = [1, 1, 1];

    this.textureMode = -1;

    this.positionBuffer = this.gl.createBuffer();
    this.colorBuffer = this.gl.createBuffer();
    this.normalBuffer = this.gl.createBuffer();
    this.tangentBuffer = this.gl.createBuffer();
    this.bitangentBuffer = this.gl.createBuffer();
    this.textureCoordBuffer = this.gl.createBuffer();
  }

  setTextureMode(mode) {
    this.textureMode = mode;
  }

  setUpProp() {
    let object = this.objectModel.object;
    let positions = [];
    let colors = [];
    let textureCoordinates = [];

    let vertices = object.vertices;
    
    for (let i = 0; i < object.num_indices; i++) {
      let index = object.indices[i];

      // set vertex
      // set 1st part of triangle
      positions = positions.concat(vertices[index[0]]);
      positions = positions.concat(vertices[index[1]]);
      positions = positions.concat(vertices[index[2]]);
      // set 2nd part of triangle
      positions = positions.concat(vertices[index[0]]);
      positions = positions.concat(vertices[index[2]]);
      positions = positions.concat(vertices[index[3]]);

      // set color
      let colorIdx = i % object.colors.length;
      for (let j = 0; j < 6; j++) {
        colors = colors.concat(object.colors[colorIdx]);
      }

      // set texture coordinates
      textureCoordinates = textureCoordinates.concat([
        0, 0,
        0, 1,
        1, 1,
        1, 0,
        0, 0,
        1, 1
      ]);
    }

    let totalVertices = positions.length / 3;
    let vector = getVectorInfo(positions);

    // Set up the properties
    this.totalVertices = totalVertices;
    this.positions = positions;
    this.colors = colors;
    this.normals = vector.normals;
    this.tangents = vector.tangents;
    this.bitangents = vector.bitangents;
    this.textureCoords = textureCoordinates;

    // set up texture
    // this.textures = {
    //   image: TextureMap.imageMap(this.gl),
    //   environment: TextureMap.envMap(this.gl),
    //   bump: TextureMap.bumpMap(this.gl)
    // };
  }

  bindBuffers() {
    const gl = this.gl;

    // bind Position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

    // bind Color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(this.colors), gl.STATIC_DRAW);

    // bind Normal buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);

    // // bind Tangent buffer
    // gl.bindBuffer(gl.ARRAY_BUFFER, this.tangentBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tangents), gl.STATIC_DRAW);

    // // bind Bitangent buffer
    // gl.bindBuffer(gl.ARRAY_BUFFER, this.bitangentBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bitangents), gl.STATIC_DRAW);

    // // bind TextureCoord buffer
    // gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), gl.STATIC_DRAW);
  }

  setBuffers() {
    const gl = this.gl

    // set Position buffer
    gl.enableVertexAttribArray(this.programInfo.vertexLoc.a_position);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.vertexAttribPointer(
      this.programInfo.vertexLoc.a_position,    // location
      3,                                        // size
      gl.FLOAT,                                 // type
      false,                                    // normalized
      0,                                        // stride
      0                                         // offset
    );

    // set Color buffer
    gl.enableVertexAttribArray(this.programInfo.vertexLoc.a_color);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.vertexAttribPointer(
      this.programInfo.vertexLoc.a_color,
      4,
      gl.UNSIGNED_BYTE,
      true,
      0,
      0
    );

    // set Normal buffer
    gl.enableVertexAttribArray(this.programInfo.vertexLoc.a_normal);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.vertexAttribPointer(
      this.programInfo.vertexLoc.a_normal,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );

    // // set Tangent buffer
    // gl.enableVertexAttribArray(this.programInfo.vertexLoc.a_tangent);
    // gl.bindBuffer(gl.ARRAY_BUFFER, this.tangentBuffer);
    // gl.vertexAttribPointer(
    //   this.programInfo.vertexLoc.a_tangent,
    //   3,
    //   gl.FLOAT,
    //   false,
    //   0,
    //   0
    // );

    // // set Bitangent buffer
    // gl.enableVertexAttribArray(this.programInfo.vertexLoc.a_bitangent);
    // gl.bindBuffer(gl.ARRAY_BUFFER, this.bitangentBuffer);
    // gl.vertexAttribPointer(
    //   this.programInfo.vertexLoc.a_bitangent,
    //   3,
    //   gl.FLOAT,
    //   false,
    //   0,
    //   0
    // );

    // // set TextureCoord buffer
    // gl.enableVertexAttribArray(this.programInfo.vertexLoc.a_textureCoord);
    // gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    // gl.vertexAttribPointer(
    //   this.programInfo.vertexLoc.a_textureCoord,
    //   2,
    //   gl.FLOAT,
    //   false,
    //   0,
    //   0
    // );
  }

  // projectionMat, viewMat, modelMat : Matrix4
  setUniform(projectionMat, viewMat, modelMat, cameraPos, isShading) {
    // set uniforms on vertex shader
    this.gl.uniformMatrix4fv(this.programInfo.vertexLoc.u_projectionMat, false, projectionMat.getData());
    this.gl.uniformMatrix4fv(this.programInfo.vertexLoc.u_viewMat, false, viewMat.getData());
    this.gl.uniformMatrix4fv(this.programInfo.vertexLoc.u_modelMat, false, modelMat.getData());
    const normalMat = modelMat.clone().multiply(viewMat.clone()).inverseTranspose();
    this.gl.uniformMatrix4fv(this.programInfo.vertexLoc.u_normalMat, false, normalMat.getData());
    
    // set uniforms on fragment shader
    this.gl.uniform3fv(this.programInfo.fragmentLoc.u_reverseLightDir, GeometryOp.normalize([0.0, 0.0, 1.0]));
    this.gl.uniform3fv(this.programInfo.fragmentLoc.worldCameraPosition, cameraPos);
    this.gl.uniform1i(this.programInfo.fragmentLoc.isShading, Number(isShading));
    // this.gl.uniform1i(this.programInfo.fragmentLoc.textureMode, Number(this.textureMode));

    // Set texture
    // image
    // this.gl.uniform1i(this.programInfo.fragmentLoc.u_texture_image, 0);
    // this.gl.activeTexture(this.gl.TEXTURE0);
    // this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures.image);
    // // environment
    // this.gl.uniform1i(this.programInfo.fragmentLoc.u_texture_env, 1);
    // this.gl.activeTexture(this.gl.TEXTURE1);
    // this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.textures.environment);
    // // bump
    // this.gl.uniform1i(this.programInfo.fragmentLoc.u_texture_bump, 2);
    // this.gl.activeTexture(this.gl.TEXTURE2);
    // this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures.bump);
  }

  drawObject(projectionMat, viewMat, modelMat, cameraPos, isShading) {

    this.gl.useProgram(this.program);
    this.bindBuffers();
    this.setBuffers();

    let newModelMat = modelMat.clone();
    newModelMat.transform(this.translation, this.rotation, this.scale);
    
    this.setUniform(projectionMat, viewMat, newModelMat, cameraPos, isShading);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.totalVertices);
  }
}