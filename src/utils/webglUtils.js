// set gl on canvas
function getWebGLContext(canvas) {
  const gl = canvas.getContext("webgl");
  if (!gl) alert("WebGL isn't available on current browser.");
  return gl;
}

async function fetchShader(filename) {
  try {
    const res = await fetch(`./shaders/${filename}`);
    const shader = await res.text();
    return shader;

  } catch (e) {
    console.log(`Failed to fetch shader at ${url}: ${e}`);
  }
}

// create shader
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return -1;
  }
  return shader;
}

// create program
async function createProgram(gl) {
  // set up vertex shader
  const vertexShaderPath = "vertex_shader.glsl";
  const vertexShaderScript = await fetchShader(vertexShaderPath);
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderScript);

  // set up fragment shader
  const fragmentShaderPath = "fragment_shader.glsl";
  const fragmentShaderScript = await fetchShader(fragmentShaderPath);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderScript);

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