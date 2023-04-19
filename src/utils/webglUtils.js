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