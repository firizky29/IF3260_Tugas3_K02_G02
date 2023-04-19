
class WebGLProgramInfo {
  constructor(gl, program) {
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
  }
}

export default WebGLProgramInfo;