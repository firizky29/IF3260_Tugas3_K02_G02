// set gl on canvas
export function getWebGLContext(canvas) {
  const gl = canvas.getContext("webgl");
  if (!gl) alert("WebGL isn't available on current browser.");
  return gl;
}

async function fetchShader(path) {
  try {
    const res = await fetch(`../shaders/${path}`);
    const shader = await res.text();
    return shader;
  } catch (e) {
    console.error(`Failed to fetch shader at ${url}: ${e}`);
  }
}

// create program
export function createProgram(gl) {
  // set up vertex shader
  const vertexShaderPath = "vertex_shader.glsl";
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, fetchShader(vertexShaderPath));

  // set up fragment shader
  const fragmentShaderPath = "fragment_shader.glsl";
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fetchShader(fragmentShaderPath));

  // create program
  const program = gl.createProgram();

  // attach shader to program
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const msg = "Shader program failed to link.\nError log :" + gl.getProgramInfoLog(program);
    alert(msg);
    return -1;
  }
  return program;
}

export class WebGLProgramInfo {
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
        a_textureCoord: this.gl.getAttribLocation(this.program, "a_textureCoord"),
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